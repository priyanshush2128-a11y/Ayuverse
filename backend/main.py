from __future__ import annotations

import base64
import hashlib
import hmac
import io
import json
import os
import re
import secrets
import sqlite3
import sys
import zlib
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import requests
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "naya.db"
SECRET = os.environ.get("NAYA_SECRET", "dev-secret-change-me")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
BUNDLED_PYTHON_PACKAGES = Path.home() / ".cache" / "codex-runtimes" / "codex-primary-runtime" / "dependencies" / "python" / "Lib" / "site-packages"

app = FastAPI(title="Ayuverse API", version="1.0.0")
app.mount("/static", StaticFiles(directory=ROOT / "frontend"), name="static")


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profiles (
                user_id INTEGER PRIMARY KEY,
                date_of_birth TEXT,
                sex TEXT,
                blood_type TEXT,
                height_cm REAL,
                weight_kg REAL,
                allergies TEXT,
                conditions TEXT,
                emergency_contact TEXT,
                health_goals TEXT,
                city TEXT,
                state TEXT,
                reviewed_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS checkins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                mood INTEGER NOT NULL,
                energy INTEGER NOT NULL,
                sleep_hours REAL NOT NULL,
                active_minutes INTEGER NOT NULL,
                stress INTEGER NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                dosage TEXT NOT NULL,
                frequency TEXT NOT NULL,
                time_of_day TEXT,
                pills_left INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS medication_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                medication_id INTEGER NOT NULL,
                log_date TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'taken',
                created_at TEXT NOT NULL,
                UNIQUE(medication_id, log_date),
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(medication_id) REFERENCES medications(id)
            );
            CREATE TABLE IF NOT EXISTS period_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT,
                flow TEXT,
                symptoms TEXT,
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                note TEXT,
                file_name TEXT,
                ai_summary TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                doctor_name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                appointment_date TEXT NOT NULL,
                slot TEXT NOT NULL,
                reason TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS guardian_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            """
        )
        existing_record_columns = {row["name"] for row in conn.execute("PRAGMA table_info(records)").fetchall()}
        if "file_name" not in existing_record_columns:
            conn.execute("ALTER TABLE records ADD COLUMN file_name TEXT")
        if "ai_summary" not in existing_record_columns:
            conn.execute("ALTER TABLE records ADD COLUMN ai_summary TEXT")
        existing_profile_columns = {row["name"] for row in conn.execute("PRAGMA table_info(profiles)").fetchall()}
        if "city" not in existing_profile_columns:
            conn.execute("ALTER TABLE profiles ADD COLUMN city TEXT")
        if "state" not in existing_profile_columns:
            conn.execute("ALTER TABLE profiles ADD COLUMN state TEXT")


@app.on_event("startup")
def startup() -> None:
    init_db()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_dotenv_value(key: str) -> str | None:
    dotenv_path = ROOT / ".env"
    if not dotenv_path.exists():
        return None
    for line in dotenv_path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() == key:
            return value.strip().strip('"').strip("'")
    return None


def groq_api_key() -> str:
    key = os.environ.get("GROQ_API_KEY") or read_dotenv_value("GROQ_API_KEY")
    if not key:
        raise HTTPException(status_code=503, detail="Groq API key is not configured")
    return key


def text_quality(text: str) -> float:
    if not text:
        return 0.0
    printable = sum(1 for char in text if char.isprintable() or char in "\n\r\t")
    latin_or_digits = sum(1 for char in text if char.isascii() and char.isalnum())
    useful_spacing = sum(1 for char in text if char.isascii() and (char.isspace() or char in ".,;:%/+-()[]"))
    replacement_marks = text.count("\ufffd") + text.count("\u00ef")
    repeated_char_penalty = 0.0
    compact = re.sub(r"\s+", "", text)
    if compact:
        top_count = max(compact.count(char) for char in set(compact))
        repeated_char_penalty = min(0.45, top_count / len(compact))
    return (
        (printable / len(text)) * 0.35
        + (latin_or_digits / len(text)) * 0.45
        + (useful_spacing / len(text)) * 0.2
        - min(0.5, replacement_marks / max(1, len(text)))
        - repeated_char_penalty
    )


def clean_extracted_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[^\S\r\n]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def ensure_bundled_pdf_packages() -> None:
    if BUNDLED_PYTHON_PACKAGES.exists() and str(BUNDLED_PYTHON_PACKAGES) not in sys.path:
        sys.path.append(str(BUNDLED_PYTHON_PACKAGES))


def decode_pdf_literal(value: str) -> str:
    replacements = {
        r"\n": "\n",
        r"\r": "\r",
        r"\t": "\t",
        r"\b": "\b",
        r"\f": "\f",
        r"\(": "(",
        r"\)": ")",
        r"\\": "\\",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def extract_uncompressed_pdf_text(pdf_bytes: bytes) -> str:
    raw = pdf_bytes.decode("latin-1", errors="ignore")
    texts: list[str] = []
    stream_pattern = re.compile(r"<<(?P<dict>.*?)>>\s*stream\r?\n(?P<data>.*?)\r?\nendstream", re.S)
    for match in stream_pattern.finditer(raw):
        dictionary = match.group("dict")
        stream_data = match.group("data").encode("latin-1", errors="ignore")
        if "/FlateDecode" in dictionary:
            try:
                stream_text = zlib.decompress(stream_data).decode("latin-1", errors="ignore")
            except zlib.error:
                continue
        elif "/Filter" in dictionary:
            continue
        else:
            stream_text = stream_data.decode("latin-1", errors="ignore")
        for literal in re.findall(r"\((?:\\.|[^\\()])+\)\s*Tj", stream_text):
            texts.append(decode_pdf_literal(literal[1:literal.rfind(")")]))
        for array in re.findall(r"\[(.*?)\]\s*TJ", stream_text, flags=re.S):
            parts = re.findall(r"\((?:\\.|[^\\()])+\)", array)
            texts.append("".join(decode_pdf_literal(part[1:-1]) for part in parts))
    return clean_extracted_text(" ".join(texts))


def extract_pdf_text(pdf_bytes: bytes) -> str:
    ensure_bundled_pdf_packages()
    try:
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = clean_extracted_text("\n".join((page.extract_text() or "").strip() for page in reader.pages))
        if text_quality(text) >= 0.45:
            return text
    except Exception:
        pass
    text = extract_uncompressed_pdf_text(pdf_bytes)
    if text_quality(text) >= 0.45:
        return text
    raise HTTPException(
        status_code=422,
        detail="Could not extract readable text from this PDF. Please upload a text-based report PDF. Scanned/image-only reports need OCR before summarizing.",
    )


def summarize_health_report(report_text: str, file_name: str) -> str:
    if len(report_text) < 40 or text_quality(report_text) < 0.45:
        raise HTTPException(status_code=422, detail="Could not read enough text from this PDF. Try a text-based health report PDF.")
    prompt = f"""
You are Ayuverse's clinical report summarizer. Summarize this health report for a patient.

Rules:
- Do not diagnose.
- Do not invent values that are not present.
- Flag values that appear out of range only if the report text itself includes ranges or clear labels.
- Keep the language simple and action-oriented.
- Return only this exact structure, with short bullets:

Report Summary

Key Findings:
- ...

Questions to Ask Your Clinician:
- ...

Care Reminders:
- ...

- Do not use Markdown bold.
- Keep each bullet under 22 words.

File name: {file_name}
Report text:
{report_text[:12000]}
""".strip()
    try:
        response = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {groq_api_key()}", "Content-Type": "application/json"},
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": "You produce concise, careful medical-report summaries for patient education."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 700,
            },
            timeout=35,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except requests.HTTPError as exc:
        detail = exc.response.text[:300] if exc.response is not None else "Groq request failed"
        raise HTTPException(status_code=502, detail=f"Groq summary failed: {detail}") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="Could not reach Groq for AI summary") from exc


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120_000)
    return f"{salt}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    salt, digest = stored.split("$", 1)
    return hmac.compare_digest(hash_password(password, salt).split("$", 1)[1], digest)


def sign_token(payload: dict[str, Any]) -> str:
    body = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    sig = hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).digest()
    return f"{body}.{base64.urlsafe_b64encode(sig).decode().rstrip('=')}"


def read_token(token: str) -> dict[str, Any]:
    try:
        body, sig = token.split(".", 1)
        expected = base64.urlsafe_b64encode(hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).digest()).decode().rstrip("=")
        if not hmac.compare_digest(sig, expected):
            raise ValueError
        padded = body + "=" * (-len(body) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
        if payload.get("exp", 0) < int(datetime.now(timezone.utc).timestamp()):
            raise ValueError
        return payload
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session") from exc


def current_user(authorization: str = Header(default="")) -> sqlite3.Row:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing session")
    payload = read_token(authorization.removeprefix("Bearer ").strip())
    with db() as conn:
        user = conn.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (payload["sub"],)).fetchone()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


class AuthIn(BaseModel):
    name: str | None = None
    email: str
    password: str = Field(min_length=6)


class ProfileIn(BaseModel):
    date_of_birth: str | None = None
    sex: str | None = None
    blood_type: str | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    allergies: str | None = ""
    conditions: str | None = ""
    emergency_contact: str | None = ""
    health_goals: str | None = ""
    city: str | None = None
    state: str | None = None


class CheckinIn(BaseModel):
    mood: int = Field(ge=1, le=5)
    energy: int = Field(ge=1, le=5)
    sleep_hours: float = Field(ge=0, le=24)
    active_minutes: int = Field(ge=0, le=1440)
    stress: int = Field(ge=1, le=5)
    notes: str | None = ""


class MedicationIn(BaseModel):
    name: str
    dosage: str
    frequency: str
    time_of_day: str | None = ""
    pills_left: int = Field(default=0, ge=0)
    active: bool = True


class RecordIn(BaseModel):
    title: str
    category: str
    note: str | None = ""


class AppointmentIn(BaseModel):
    doctor_name: str
    specialty: str
    appointment_date: str
    slot: str
    reason: str | None = ""


class PeriodLogIn(BaseModel):
    start_date: str
    end_date: str | None = None
    flow: str | None = "Medium"
    symptoms: str | None = ""
    notes: str | None = ""


class GuardianChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=1600)
    doctor_context: list[dict[str, Any]] | None = None


def row_to_dict(row: sqlite3.Row | None) -> dict[str, Any] | None:
    return dict(row) if row else None


def compact_text(value: Any, fallback: str = "Not set") -> str:
    text = str(value or "").strip()
    return text if text else fallback


def build_guardian_memory(user: sqlite3.Row) -> str:
    with db() as conn:
        profile = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],)).fetchone()
        checkins = conn.execute("SELECT * FROM checkins WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", (user["id"],)).fetchall()
        meds = conn.execute("SELECT * FROM medications WHERE user_id = ? AND active = 1 ORDER BY created_at DESC", (user["id"],)).fetchall()
        med_logs = conn.execute(
            """
            SELECT ml.log_date, ml.status, m.name AS medication_name
            FROM medication_logs ml
            JOIN medications m ON m.id = ml.medication_id
            WHERE ml.user_id = ?
            ORDER BY ml.created_at DESC
            LIMIT 30
            """,
            (user["id"],),
        ).fetchall()
        records = conn.execute("SELECT * FROM records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user["id"],)).fetchall()
        period_logs = conn.execute("SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date DESC LIMIT 12", (user["id"],)).fetchall()
        appointments = conn.execute("SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date DESC LIMIT 8", (user["id"],)).fetchall()

    lines = [
        f"User: {user['name']} ({user['email']})",
        "Profile:",
    ]
    if profile:
        lines.extend(
            [
                f"- Sex: {compact_text(profile['sex'])}",
                f"- DOB: {compact_text(profile['date_of_birth'])}",
                f"- City/State: {compact_text(profile['city'])}, {compact_text(profile['state'])}",
                f"- Blood type: {compact_text(profile['blood_type'])}",
                f"- Height/Weight: {compact_text(profile['height_cm'])} cm, {compact_text(profile['weight_kg'])} kg",
                f"- Allergies: {compact_text(profile['allergies'])}",
                f"- Conditions: {compact_text(profile['conditions'])}",
                f"- Goals: {compact_text(profile['health_goals'])}",
            ]
        )
    else:
        lines.append("- No profile reviewed yet.")

    lines.append("Recent check-ins:")
    if checkins:
        for row in checkins:
            lines.append(
                f"- {row['created_at'][:10]}: mood {row['mood']}/5, energy {row['energy']}/5, "
                f"sleep {row['sleep_hours']}h, active {row['active_minutes']}m, stress {row['stress']}/5, notes: {compact_text(row['notes'], 'none')}"
            )
    else:
        lines.append("- None.")

    lines.append("Active medications:")
    if meds:
        for row in meds:
            lines.append(f"- {row['name']} {row['dosage']}, {row['frequency']}, time {compact_text(row['time_of_day'])}, pills left {row['pills_left']}")
    else:
        lines.append("- None.")

    lines.append("Medication logs:")
    if med_logs:
        for row in med_logs:
            lines.append(f"- {row['log_date']}: {row['medication_name']} marked {row['status']}")
    else:
        lines.append("- None.")

    lines.append("Health records and AI report summaries:")
    if records:
        for row in records:
            summary = row["ai_summary"] or row["note"] or ""
            lines.append(f"- {row['created_at'][:10]} {row['category']}: {row['title']}. {compact_text(summary, 'No note')[:900]}")
    else:
        lines.append("- None.")

    lines.append("Women's cycle logs:")
    if period_logs:
        guardian = womens_guardian(period_logs)
        lines.append(f"- Current cycle insight: {guardian.get('summary', 'No summary')}")
        for row in period_logs:
            lines.append(f"- {row['start_date']} to {compact_text(row['end_date'])}: flow {compact_text(row['flow'])}, symptoms {compact_text(row['symptoms'], 'none')}, notes {compact_text(row['notes'], 'none')}")
    else:
        lines.append("- None.")

    lines.append("Appointments:")
    if appointments:
        for row in appointments:
            lines.append(f"- {row['appointment_date']} {row['slot']}: {row['doctor_name']} ({row['specialty']}), reason: {compact_text(row['reason'], 'not set')}")
    else:
        lines.append("- None.")

    today_iso = date.today().isoformat()
    med_taken = {(row["medication_name"], row["log_date"]) for row in med_logs}
    pending_meds = [row for row in meds if daily_doses_for_frequency(row["frequency"]) > 0 and (row["name"], today_iso) not in med_taken]
    habit_reminders = health_habit_reminders(profile, checkins, records, period_logs)
    lines.append("Active Guardian reminders:")
    if pending_meds or habit_reminders:
        for row in pending_meds:
            lines.append(f"- Medication pending today: {row['name']} {row['dosage']} ({row['frequency']})")
        for item in habit_reminders:
            lines.append(f"- Habit: {item['title']} - {item['body']}")
    else:
        lines.append("- None.")

    return "\n".join(lines)[:14000]


def doctor_context_text(items: list[dict[str, Any]] | None) -> str:
    if not items:
        return "No doctor ranking context was supplied by the frontend."
    lines = ["Ranked doctors available in the app:"]
    for index, item in enumerate(items[:8], start=1):
        contact = item.get("contact") or {}
        lines.append(
            f"{index}. {compact_text(item.get('name'))} - {compact_text(item.get('specialty'))}, "
            f"{compact_text(item.get('hospital'))}, {compact_text(item.get('city'))}, {compact_text(item.get('state'))}; "
            f"match {compact_text(item.get('score'))}%; phone {compact_text(contact.get('phone'))}; email {compact_text(contact.get('email'))}"
        )
    return "\n".join(lines)


def guardian_fallback_reply(message: str, memory: str, doctors: str) -> str:
    severe = re.search(r"\b(severe|unbearable|chest pain|faint|fainted|bleeding heavily|shortness of breath|can't breathe|suicidal|emergency)\b", message, re.I)
    sections = [
        "Ayuverse Guardian",
        "",
        "What I Noticed:",
        "- I can see your saved check-ins, medications, logs, records, and profile context.",
        "- I could not reach the AI model right now, so this is a conservative safety response.",
        "",
        "Next Steps:",
    ]
    if severe:
        sections.extend(
            [
                "- This sounds potentially urgent. Please seek emergency care or contact a local clinician now.",
                "- Open Find a Doctor for the nearest ranked doctor details saved in Ayuverse.",
            ]
        )
    else:
        sections.extend(
            [
                "- Keep logging symptoms, medication doses, sleep, stress, and activity.",
                "- For exercise, start gently unless a clinician has restricted activity.",
                "- If symptoms worsen, become severe, or feel unusual for you, contact a doctor.",
            ]
        )
    return "\n".join(sections)


def daily_doses_for_frequency(frequency: str) -> int:
    frequency = (frequency or "").lower()
    if "needed" in frequency:
        return 0
    return 1


def parse_iso_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


def period_days(logs: list[sqlite3.Row]) -> set[str]:
    days: set[str] = set()
    for log in logs:
        start = parse_iso_date(log["start_date"])
        end = parse_iso_date(log["end_date"]) or start
        if not start or not end:
            continue
        end = min(end, start + timedelta(days=10))
        day = start
        while day <= end:
            days.add(day.isoformat())
            day += timedelta(days=1)
    return days


def womens_guardian(logs: list[sqlite3.Row]) -> dict[str, Any]:
    if not logs:
        return {
            "phase": "Baseline needed",
            "next_period_estimate": None,
            "cycle_length": None,
            "summary": "Log your period start and end dates to unlock cycle-aware guidance.",
            "medication": [
                "For cramps, consider heat therapy and hydration first.",
                "Use over-the-counter pain relief only if it is safe for you and matches the label.",
            ],
            "exercise": [
                "Start with gentle walking, stretching, or yoga until your baseline is clearer.",
            ],
            "doctor": [
                "Speak with a clinician for severe pain, very heavy bleeding, dizziness, or missed periods.",
            ],
        }
    sorted_logs = sorted(logs, key=lambda row: row["start_date"], reverse=True)
    starts = [parse_iso_date(row["start_date"]) for row in sorted_logs]
    starts = [day for day in starts if day]
    latest = starts[0]
    intervals = [(starts[i] - starts[i + 1]).days for i in range(len(starts) - 1) if 18 <= (starts[i] - starts[i + 1]).days <= 45]
    cycle_length = round(sum(intervals) / len(intervals)) if intervals else 28
    day_of_cycle = (date.today() - latest).days + 1
    next_period = latest + timedelta(days=cycle_length)
    symptoms_text = " ".join((row["symptoms"] or "") + " " + (row["notes"] or "") for row in sorted_logs[:3]).lower()
    heavy_or_severe = any(word in symptoms_text for word in ["severe", "heavy", "faint", "dizzy", "vomit", "clot"])
    if day_of_cycle <= 5:
        phase = "Menstrual phase"
        exercise = ["Choose low-intensity movement: walking, mobility, yoga, or light cycling.", "Prioritize sleep and recovery if cramps or fatigue are high."]
        medication = ["For cramps, heat packs may help.", "If you normally tolerate them, OTC anti-inflammatory pain relief can be considered as directed on the label."]
    elif day_of_cycle <= 13:
        phase = "Follicular phase"
        exercise = ["Energy may rise here, so strength training or moderate cardio can fit well.", "Keep iron-rich foods in mind after bleeding days."]
        medication = ["No routine medication is suggested from cycle timing alone.", "Track headaches, cramps, or unusual symptoms if they appear."]
    elif day_of_cycle <= 16:
        phase = "Ovulation window"
        exercise = ["Moderate strength, mobility, or cardio can work well if you feel good.", "Scale down if pelvic pain, nausea, or fatigue appears."]
        medication = ["Mild ovulation discomfort can often be managed with rest and heat.", "Use pain relief only if safe for you and label-appropriate."]
    else:
        phase = "Luteal phase"
        exercise = ["Try steady cardio, stretching, and lighter strength work if PMS symptoms build.", "Reduce intensity if sleep, mood, or cramps worsen."]
        medication = ["For PMS discomfort, prioritize hydration, regular meals, and sleep.", "Discuss recurring severe PMS, migraines, or mood changes with a clinician."]
    doctor = [
        "Book a gynecology consult if pain disrupts daily life, bleeding is very heavy, or cycles are often under 21 or over 35 days.",
    ]
    if heavy_or_severe:
        doctor.insert(0, "Your recent symptoms include severe/heavy warning words. Consider speaking with a doctor soon.")
    if date.today() > next_period + timedelta(days=7):
        doctor.insert(0, "Your estimated period is more than a week late. Consider pregnancy testing if relevant and medical guidance if unusual.")
    return {
        "phase": phase,
        "next_period_estimate": next_period.isoformat(),
        "cycle_length": cycle_length,
        "day_of_cycle": max(1, day_of_cycle),
        "summary": f"You appear to be in the {phase.lower()} around cycle day {max(1, day_of_cycle)}.",
        "medication": medication,
        "exercise": exercise,
        "doctor": doctor,
    }


def health_habit_reminders(
    profile: sqlite3.Row | None,
    checkins: list[sqlite3.Row],
    records: list[sqlite3.Row],
    period_logs: list[sqlite3.Row],
) -> list[dict[str, Any]]:
    reminders: list[dict[str, Any]] = []
    latest = checkins[0] if checkins else None
    health_text = " ".join(
        [
            compact_text(profile["conditions"], "") if profile else "",
            compact_text(profile["health_goals"], "") if profile else "",
            " ".join((row["note"] or "") + " " + (row["ai_summary"] or "") for row in records),
            " ".join((row["symptoms"] or "") + " " + (row["notes"] or "") for row in period_logs[:3]),
        ]
    ).lower()

    def add(key: str, title: str, body: str, action: str, priority: str = "info") -> None:
        reminders.append(
            {
                "id": f"habit-{key}",
                "type": "habit",
                "priority": priority,
                "title": title,
                "body": body,
                "action": action,
            }
        )

    if not latest:
        add("baseline-checkin", "Build today's baseline", "Add a 10-second check-in so Guardian can tune exercise and habit reminders.", "Add check-in", "warn")
        return reminders

    if latest["sleep_hours"] < 6:
        add("sleep-recovery", "Recovery-first movement", "Sleep is low. Try 8-10 minutes of breathing, neck rolls, and Yoga Nidra before intense exercise.", "Try recovery asana", "warn")
    if latest["stress"] >= 4:
        add("stress-breathing", "Calm your stress signal", "Stress is high. Try 5 rounds of box breathing or Anulom Vilom, then a short walk.", "Do breathing")
    if latest["active_minutes"] < 20:
        add("activity-walk", "Move gently today", "Activity is low. Aim for a 15-20 minute walk or light Surya Namaskar if you feel well.", "Start movement")
    if latest["energy"] <= 2:
        add("low-energy", "Low-energy routine", "Energy is low. Choose mobility, child's pose, cat-cow, and hydration instead of heavy training.", "Do mobility", "warn")
    if "cholesterol" in health_text or "ldl" in health_text or "triglyceride" in health_text:
        add("lipid-cardio", "Heart-friendly habit", "Your records mention lipid risk. Add brisk walking and two strength sessions weekly if your clinician allows.", "Plan cardio")
    if "blood sugar" in health_text or "diabetes" in health_text or "glucose" in health_text:
        add("sugar-walk", "Post-meal walk", "For blood sugar support, take a gentle 10-minute walk after meals when possible.", "Walk after meals")
    if period_logs:
        guardian = womens_guardian(period_logs)
        phase = (guardian.get("phase") or "").lower()
        if "menstrual" in phase:
            add("cycle-gentle", "Cycle-aware movement", "During menstrual days, choose gentle yoga, walking, heat therapy, and extra recovery.", "Gentle yoga")
        elif "luteal" in phase:
            add("cycle-luteal", "Luteal phase support", "Try steady cardio, stretching, and lighter strength work while watching sleep and mood.", "Lighter workout")

    return reminders[:6]


def auth_response(user: sqlite3.Row) -> dict[str, Any]:
    exp = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
    token = sign_token({"sub": user["id"], "exp": exp})
    return {"token": token, "user": row_to_dict(user)}


@app.get("/")
def index() -> FileResponse:
    return FileResponse(ROOT / "frontend" / "index.html")


@app.post("/api/auth/register")
def register(payload: AuthIn) -> dict[str, Any]:
    if not payload.name or not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if "@" not in payload.email or "." not in payload.email:
        raise HTTPException(status_code=400, detail="Enter a valid email")
    try:
        with db() as conn:
            cur = conn.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (payload.name.strip(), payload.email.lower(), hash_password(payload.password), now_iso()),
            )
            conn.execute("INSERT INTO profiles (user_id) VALUES (?)", (cur.lastrowid,))
            user = conn.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()
        return auth_response(user)
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=409, detail="An account with this email already exists") from exc


@app.post("/api/auth/login")
def login(payload: AuthIn) -> dict[str, Any]:
    if "@" not in payload.email or "." not in payload.email:
        raise HTTPException(status_code=400, detail="Enter a valid email")
    with db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (payload.email.lower(),)).fetchone()
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    public_user = {k: user[k] for k in ("id", "name", "email", "created_at")}
    return auth_response(public_user)


@app.get("/api/me")
def me(user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        profile = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],)).fetchone()
    return {"user": row_to_dict(user), "profile": row_to_dict(profile)}


@app.put("/api/me/profile")
def save_profile(payload: ProfileIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        existing = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],)).fetchone()
        data = dict(existing) if existing else {"user_id": user["id"]}
        data.update(payload.model_dump(exclude_unset=True))
        conn.execute(
            """
            UPDATE profiles
            SET date_of_birth=?, sex=?, blood_type=?, height_cm=?, weight_kg=?,
                allergies=?, conditions=?, emergency_contact=?, health_goals=?, city=?, state=?, reviewed_at=?
            WHERE user_id=?
            """,
            (
                data["date_of_birth"], data["sex"], data["blood_type"], data["height_cm"], data["weight_kg"],
                data["allergies"], data["conditions"], data["emergency_contact"], data["health_goals"],
                data["city"], data["state"], now_iso(), user["id"],
            ),
        )
        profile = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],)).fetchone()
    return {"profile": row_to_dict(profile)}


@app.get("/api/dashboard")
def dashboard(user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        profile = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],)).fetchone()
        checkins = conn.execute("SELECT * FROM checkins WHERE user_id = ? ORDER BY created_at DESC LIMIT 30", (user["id"],)).fetchall()
        meds = conn.execute("SELECT * FROM medications WHERE user_id = ? AND active = 1 ORDER BY created_at DESC", (user["id"],)).fetchall()
        med_logs = conn.execute(
            """
            SELECT ml.*, m.name AS medication_name
            FROM medication_logs ml
            JOIN medications m ON m.id = ml.medication_id
            WHERE ml.user_id = ? AND ml.log_date >= ?
            ORDER BY ml.created_at DESC
            """,
            (user["id"], (date.today() - timedelta(days=6)).isoformat()),
        ).fetchall()
        records = conn.execute("SELECT * FROM records WHERE user_id = ? ORDER BY created_at DESC LIMIT 8", (user["id"],)).fetchall()
        appointments = conn.execute("SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date ASC LIMIT 5", (user["id"],)).fetchall()
        period_logs = conn.execute("SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date DESC LIMIT 24", (user["id"],)).fetchall()
    wellness = 0
    streak = 0
    avg_sleep = 0.0
    avg_energy = 0.0
    if checkins:
        avg_sleep = sum(row["sleep_hours"] for row in checkins) / len(checkins)
        avg_energy = sum(row["energy"] for row in checkins) / len(checkins)
        avg_mood = sum(row["mood"] for row in checkins) / len(checkins)
        avg_stress = sum(row["stress"] for row in checkins) / len(checkins)
        avg_active = sum(row["active_minutes"] for row in checkins) / len(checkins)
        wellness = round(min(100, max(0, (avg_sleep / 8 * 25) + (avg_energy / 5 * 25) + (avg_mood / 5 * 25) + (avg_active / 45 * 15) + ((6 - avg_stress) / 5 * 10))))
        seen_days = {row["created_at"][:10] for row in checkins}
        day = date.today()
        while day.isoformat() in seen_days:
            streak += 1
            day -= timedelta(days=1)
    profile_ready = bool(profile and profile["reviewed_at"])
    today_iso = date.today().isoformat()
    med_log_dates = {(row["medication_id"], row["log_date"]) for row in med_logs}
    med_items = []
    medication_reminders = []
    scheduled_weekly_doses = 0
    completed_weekly_doses = len(med_logs)
    for med in meds:
        item = row_to_dict(med)
        item["taken_today"] = (med["id"], today_iso) in med_log_dates
        item["status"] = "Taken" if item["taken_today"] else "Pending"
        item["daily_doses"] = daily_doses_for_frequency(med["frequency"])
        scheduled_weekly_doses += item["daily_doses"] * 7
        med_items.append(item)
        if item["daily_doses"] > 0 and not item["taken_today"]:
            medication_reminders.append(
                {
                    "id": f"med-{med['id']}-{today_iso}",
                    "type": "medication",
                    "priority": "urgent",
                    "medication_id": med["id"],
                    "title": f"{med['name']} is pending",
                    "body": f"{med['dosage']} - {med['frequency']}{' - ' + med['time_of_day'] if med['time_of_day'] else ''}",
                    "action": "Log taken",
                }
            )
    adherence_percent = round((completed_weekly_doses / scheduled_weekly_doses) * 100) if scheduled_weekly_doses else 0
    habit_reminders = health_habit_reminders(profile, checkins, records, period_logs)
    return {
        "user": row_to_dict(user),
        "profile": row_to_dict(profile),
        "profile_ready": profile_ready,
        "summary": {
            "wellness": wellness,
            "streak": streak,
            "avg_sleep": round(avg_sleep, 1),
            "avg_energy": round(avg_energy, 1),
            "risk_label": "Baseline needed" if not checkins else ("Low" if wellness >= 75 else "Moderate" if wellness >= 55 else "Elevated"),
            "next_action": "Review your profile to personalize insights." if not profile_ready else ("Add today's check-in." if not checkins or checkins[0]["created_at"][:10] != date.today().isoformat() else "Today's check-in is complete."),
        },
        "checkins": [row_to_dict(row) for row in checkins],
        "medications": med_items,
        "medication_logs": [row_to_dict(row) for row in med_logs],
        "medication_adherence": {
            "completed": completed_weekly_doses,
            "scheduled": scheduled_weekly_doses,
            "percent": min(100, adherence_percent),
            "pending_today": sum(1 for item in med_items if not item["taken_today"] and item["daily_doses"] > 0),
        },
        "records": [row_to_dict(row) for row in records],
        "appointments": [row_to_dict(row) for row in appointments],
        "period_logs": [row_to_dict(row) for row in period_logs],
        "period_days": sorted(period_days(period_logs)),
        "womens_guardian": womens_guardian(period_logs),
        "reminders": medication_reminders + habit_reminders,
    }


@app.get("/api/guardian/messages")
def guardian_messages(user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        rows = conn.execute(
            """
            SELECT role, content, created_at
            FROM guardian_messages
            WHERE user_id = ?
            ORDER BY created_at ASC
            LIMIT 80
            """,
            (user["id"],),
        ).fetchall()
    return {"messages": [row_to_dict(row) for row in rows]}


@app.post("/api/guardian/chat")
def guardian_chat(payload: GuardianChatIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    memory = build_guardian_memory(user)
    doctors = doctor_context_text(payload.doctor_context)
    system_prompt = """
You are Ayuverse Guardian, a warm health assistant inside a patient-owned health app.
You have memory from the user's saved profile, check-ins, medication logs, period logs, appointments, and health report summaries.

Safety rules:
- You are not a doctor and must not diagnose, prescribe, or change medicines.
- Use the user's saved data only as context. Do not invent lab values, medicines, or diagnoses.
- If the user describes severe, urgent, or dangerous symptoms, tell them to seek urgent medical care now.
- When severe symptoms match an available doctor, recommend the most relevant doctor from the supplied ranked doctor list, but still advise urgent care if appropriate.
- For exercise advice, tailor intensity to sleep, stress, energy, menstrual symptoms, and health goals. Keep it practical and safe.
- Keep answers easy to scan with short headings and bullets.
- End with one specific next action inside Ayuverse when useful, such as logging a check-in, marking medication, uploading a report, or opening Find a Doctor.
""".strip()
    user_prompt = f"""
User message:
{message}

Saved Ayuverse health memory:
{memory}

Doctor ranking context:
{doctors}

Reply with this structure when it fits:
Quick Read:
- ...

Personalized Guidance:
- ...

Exercise or Care Plan:
- ...

Doctor Guidance:
- ...
""".strip()

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {groq_api_key()}", "Content-Type": "application/json"},
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.25,
                "max_tokens": 900,
            },
            timeout=35,
        )
        response.raise_for_status()
        reply = response.json()["choices"][0]["message"]["content"].strip()
    except requests.RequestException:
        reply = guardian_fallback_reply(message, memory, doctors)

    created_user = now_iso()
    created_assistant = now_iso()
    with db() as conn:
        conn.execute(
            "INSERT INTO guardian_messages (user_id, role, content, created_at) VALUES (?, 'user', ?, ?)",
            (user["id"], message, created_user),
        )
        conn.execute(
            "INSERT INTO guardian_messages (user_id, role, content, created_at) VALUES (?, 'assistant', ?, ?)",
            (user["id"], reply, created_assistant),
        )
    return {
        "messages": [
            {"role": "user", "content": message, "created_at": created_user},
            {"role": "assistant", "content": reply, "created_at": created_assistant},
        ]
    }


@app.post("/api/checkins")
def add_checkin(payload: CheckinIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO checkins (user_id, mood, energy, sleep_hours, active_minutes, stress, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (user["id"], payload.mood, payload.energy, payload.sleep_hours, payload.active_minutes, payload.stress, payload.notes, now_iso()),
        )
        row = conn.execute("SELECT * FROM checkins WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"checkin": row_to_dict(row)}


@app.post("/api/medications")
def add_medication(payload: MedicationIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO medications (user_id, name, dosage, frequency, time_of_day, pills_left, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (user["id"], payload.name, payload.dosage, payload.frequency, payload.time_of_day, payload.pills_left, int(payload.active), now_iso()),
        )
        row = conn.execute("SELECT * FROM medications WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"medication": row_to_dict(row)}


@app.delete("/api/medications/{med_id}")
def delete_medication(med_id: int, user: sqlite3.Row = Depends(current_user)) -> dict[str, bool]:
    with db() as conn:
        conn.execute("DELETE FROM medication_logs WHERE medication_id = ? AND user_id = ?", (med_id, user["id"]))
        conn.execute("DELETE FROM medications WHERE id = ? AND user_id = ?", (med_id, user["id"]))
    return {"ok": True}


@app.post("/api/medications/{med_id}/logs")
def log_medication_taken(med_id: int, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    log_date = date.today().isoformat()
    with db() as conn:
        med = conn.execute("SELECT * FROM medications WHERE id = ? AND user_id = ? AND active = 1", (med_id, user["id"])).fetchone()
        if not med:
            raise HTTPException(status_code=404, detail="Medication not found")
        conn.execute(
            """
            INSERT OR IGNORE INTO medication_logs (user_id, medication_id, log_date, status, created_at)
            VALUES (?, ?, ?, 'taken', ?)
            """,
            (user["id"], med_id, log_date, now_iso()),
        )
        if med["pills_left"] > 0:
            conn.execute("UPDATE medications SET pills_left = MAX(pills_left - 1, 0) WHERE id = ? AND user_id = ?", (med_id, user["id"]))
        row = conn.execute("SELECT * FROM medication_logs WHERE medication_id = ? AND user_id = ? AND log_date = ?", (med_id, user["id"], log_date)).fetchone()
    return {"log": row_to_dict(row)}


@app.post("/api/records")
def add_record(payload: RecordIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO records (user_id, title, category, note, created_at) VALUES (?, ?, ?, ?, ?)",
            (user["id"], payload.title, payload.category, payload.note, now_iso()),
        )
        row = conn.execute("SELECT * FROM records WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"record": row_to_dict(row)}


@app.post("/api/womens/period-logs")
def add_period_log(payload: PeriodLogIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    start = parse_iso_date(payload.start_date)
    end = parse_iso_date(payload.end_date) if payload.end_date else start
    if not start:
        raise HTTPException(status_code=400, detail="Start date is required")
    if end and end < start:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")
    if end and (end - start).days > 10:
        raise HTTPException(status_code=400, detail="Period log cannot be longer than 10 days")
    with db() as conn:
        cur = conn.execute(
            """
            INSERT INTO period_logs (user_id, start_date, end_date, flow, symptoms, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user["id"], start.isoformat(), end.isoformat() if end else None, payload.flow, payload.symptoms, payload.notes, now_iso()),
        )
        row = conn.execute("SELECT * FROM period_logs WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"period_log": row_to_dict(row)}


@app.delete("/api/womens/period-logs/{log_id}")
def delete_period_log(log_id: int, user: sqlite3.Row = Depends(current_user)) -> dict[str, bool]:
    with db() as conn:
        conn.execute("DELETE FROM period_logs WHERE id = ? AND user_id = ?", (log_id, user["id"]))
    return {"ok": True}


@app.post("/api/records/report-pdf")
async def summarize_report_pdf(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    user: sqlite3.Row = Depends(current_user),
) -> dict[str, Any]:
    if file.content_type not in {"application/pdf", "application/x-pdf"} and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF health report")
    pdf_bytes = await file.read()
    if len(pdf_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="PDF must be under 8 MB")
    report_text = extract_pdf_text(pdf_bytes)
    summary = summarize_health_report(report_text, file.filename)
    record_title = title.strip() if title and title.strip() else file.filename
    with db() as conn:
        cur = conn.execute(
            """
            INSERT INTO records (user_id, title, category, note, file_name, ai_summary, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user["id"], record_title, "AI Health Report", summary, file.filename, summary, now_iso()),
        )
        row = conn.execute("SELECT * FROM records WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"record": row_to_dict(row), "summary": summary}


@app.post("/api/appointments")
def add_appointment(payload: AppointmentIn, user: sqlite3.Row = Depends(current_user)) -> dict[str, Any]:
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO appointments (user_id, doctor_name, specialty, appointment_date, slot, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user["id"], payload.doctor_name, payload.specialty, payload.appointment_date, payload.slot, payload.reason, now_iso()),
        )
        row = conn.execute("SELECT * FROM appointments WHERE id = ?", (cur.lastrowid,)).fetchone()
    return {"appointment": row_to_dict(row)}


@app.get("/{path:path}")
def spa_fallback(path: str, request: Request) -> FileResponse:
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(ROOT / "frontend" / "index.html")
