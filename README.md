# Ayuverse

Ayuverse is an AI-assisted preventive healthcare web application built for a hackathon setting. The app gives each user a private health workspace where they can track daily health signals, manage medication logs, upload health reports, chat with an AI health guardian, and discover doctors based on their location and health needs.

The project is designed to start with no demo patient data. Every account begins empty, and the experience becomes more useful as the user adds their own profile, check-ins, medications, records, and cycle logs.

## What The App Does

Ayuverse brings together multiple everyday health workflows into one dashboard:

- User registration and login
- Profile recheck after login
- Location-aware doctor suggestions
- Daily health check-ins
- Medication schedule and dose logging
- Medication reminder notifications
- Habit and exercise reminders based on logs
- AI health report PDF summarization
- AI Guardian chatbot with memory of user health data
- Women's health and menstrual cycle support
- Appointment booking
- Health timeline
- Health passport
- Biological health age calculator
- Rewards and consistency tracking
- Dark and light theme support

## Main Features

### Authentication

Users can create an account using their name, email, and password. Passwords are hashed before being stored. After login, the user is asked to review their profile so that recommendations are based on current information.

The app keeps each user's data separate. A user only sees their own profile, check-ins, records, medications, appointments, and Guardian chat history.

### Health Profile Recheck

The profile section stores important health context:

- Date of birth
- Sex
- Blood type
- City and state
- Height and weight
- Allergies
- Existing conditions
- Health goals
- Emergency contact

The city and state are used to prioritize nearby doctors in the Find a Doctor section.

### Dashboard

The dashboard gives a quick summary of the user's current health state. It calculates a wellness score using:

- Mood
- Energy
- Sleep hours
- Active minutes
- Stress level

It also shows streaks, recent check-ins, upcoming appointments, and next recommended actions.

### Daily Check-Ins

The check-in system is designed to be quick. A user logs:

- Mood
- Energy
- Sleep hours
- Active minutes
- Stress
- Notes

These logs power the wellness score, Guardian chatbot memory, reminders, and habit suggestions.

### Medication Hub

The Medication Hub allows users to add active medications with:

- Medication name
- Dosage
- Frequency
- Time of day
- Pills left

Users can mark a medication as taken. The app stores medication logs and calculates weekly adherence.

Pending medications appear as reminders until they are marked as taken.

### Notifications And Reminders

Ayuverse includes a notification section for active reminders.

Medication reminders are generated when a scheduled medication has not been marked as taken for the current day. Once the user clicks "Log taken", the reminder is automatically removed.

The app also generates habit reminders from the user's logs. For example:

- Low sleep can trigger a recovery-focused reminder
- High stress can trigger breathing or light movement suggestions
- Low active minutes can trigger a walking reminder
- Low energy can suggest gentle mobility instead of intense exercise
- Lipid or blood sugar signals in reports can trigger lifestyle reminders
- Menstrual cycle phase can trigger cycle-aware movement suggestions

### AI Guardian Chatbot

The AI Guardian is a chatbot connected to the user's saved health data. It can use memory from:

- Profile
- Daily check-ins
- Medications
- Medication logs
- Health report summaries
- Period logs
- Appointments
- Active reminders
- Ranked doctor suggestions

The chatbot is designed to give simple, readable guidance. It can help users understand their logs, plan safe exercise, remember medications, and decide when to contact a doctor.

It does not diagnose, prescribe medicine, or replace a clinician. If the user describes severe symptoms, the Guardian recommends urgent medical care and can point toward a relevant doctor from the app's ranked doctor list.

### Records Vault

Users can add health records manually or upload a PDF health report.

When a report PDF is uploaded, the backend extracts readable text from the PDF and sends it to the Groq LLM API. The app then saves a simple point-wise AI summary in the Records Vault.

The summary format is designed to be easier to read than a dense paragraph. It includes:

- Key findings
- Questions to ask a clinician
- Care reminders

### Women's Guardian

The Women's Guardian supports menstrual cycle tracking. Users can log:

- Period start date
- End date
- Flow
- Symptoms
- Notes

The app estimates cycle phase and gives guidance around:

- Medication support
- Exercise plan
- Doctor guidance

If symptoms include severe pain, heavy bleeding, dizziness, or unusual cycle patterns, the app suggests speaking with a doctor.

### Find A Doctor

The Find a Doctor page ranks doctors based on the user's location and health needs.

Ranking considers:

- Same city
- Same state
- Video consultation availability
- Profile conditions
- Health goals
- Check-in patterns
- Medication context
- Health report summaries
- Women's health logs

Doctors are grouped by specialization, and each card includes:

- Doctor name
- Specialty
- Hospital or clinic
- City and state
- Experience
- Consultation mode
- Match reasons
- Phone number
- Email
- Address
- Book consultation button

The current doctor directory is local static data inside the frontend. It can later be replaced with a real doctor marketplace, hospital API, or location-based provider database.

### Appointments

Users can book a consultation from the Find a Doctor page. Booked appointments appear in the dashboard and health timeline.

### Health Timeline

The timeline combines user activity into one chronological view. It shows:

- Check-ins
- Records
- Appointments

This helps users understand how their health activity changes over time.

### Health Passport

The Health Passport is a compact profile card containing important information like:

- Name
- Email
- Blood type
- Date of birth
- Allergies
- Conditions
- Emergency contact
- Last profile review

### Biological Health Age Calculator

The Biological Health Age Calculator estimates a user's lifestyle-based health age. It uses four lifestyle factors:

- Sleep quality
- Physical activity
- Nutrition habits
- Stress levels

If the user has added a date of birth in the profile, the calculator can use it to estimate chronological age. The user can also enter their age manually.

The calculator compares chronological age with an estimated biological health age. A healthier lifestyle pattern can make the biological age estimate lower than chronological age, while poor sleep, low activity, weak nutrition habits, or high stress can increase the estimate.

The result includes:

- Chronological age
- Estimated biological health age
- Lifestyle score
- Personalized focus areas

This section is educational and should not be treated as a medical or laboratory-based biological age test.

### Rewards

The Rewards section shows consistency through a heatmap. It uses check-in history to encourage regular logging.

### Theme Support

The app supports dark and light themes. The Ayuverse logo changes based on the selected theme.

## Tech Stack

### Backend

- FastAPI
- Python
- Uvicorn
- Pydantic
- SQLite
- python-multipart
- pypdf
- Requests

### Frontend

- HTML
- CSS
- Vanilla JavaScript
- Font Awesome icons

### AI

- Groq Chat Completions API
- Default model configured through `GROQ_MODEL`
- Health report summarization
- AI Guardian chatbot

### Storage

- SQLite database stored as `naya.db`
- User sessions are handled with signed tokens
- Environment variables are read from `.env`

## Project Structure

```text
naya_project/
  backend/
    main.py
    __init__.py
  frontend/
    index.html
    app.js
    styles.css
    assets/
      ayuverse-logo-dark.png
      ayuverse-logo-light.png
  requirements.txt
  README.md
  .env
  .gitignore
```

## Backend Overview

The backend is contained mainly in `backend/main.py`.

It handles:

- Database initialization
- User registration
- User login
- Session token validation
- Profile saving
- Dashboard data aggregation
- Check-in creation
- Medication creation, deletion, and dose logging
- Period log creation and deletion
- Record creation
- PDF report upload and summarization
- Guardian chat history
- Guardian chatbot responses
- Appointment booking
- Static frontend serving

The database tables include:

- `users`
- `profiles`
- `checkins`
- `medications`
- `medication_logs`
- `period_logs`
- `records`
- `appointments`
- `guardian_messages`

## Frontend Overview

The frontend is a single-page app written in vanilla JavaScript.

Important frontend responsibilities include:

- Rendering login and registration pages
- Rendering all app views
- Managing local UI state
- Calling backend APIs
- Displaying notifications and reminders
- Formatting AI summaries
- Ranking doctors on the client side
- Managing dark and light theme
- Showing modals for check-ins, medications, records, reports, location, period logs, and appointments
- Calculating lifestyle-based biological health age on the client side

## How To Run Locally

### 1. Open The Project

Open this folder in VS Code:

```powershell
C:\Users\priya\OneDrive\Documents\naya_project
```

Or use:

```powershell
cd C:\Users\priya\OneDrive\Documents\naya_project
code .
```

### 2. Create A Virtual Environment

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure Groq API Key

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Optional:

```env
GROQ_MODEL=llama-3.1-8b-instant
NAYA_SECRET=change-this-secret-in-production
```

Do not commit `.env` to GitHub.

### 5. Start The App

```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8010 --reload
```

Open:

```text
http://127.0.0.1:8010/
```

## Environment Variables

### `GROQ_API_KEY`

Required for AI report summaries and Guardian chatbot responses.

### `GROQ_MODEL`

Optional. Defaults to:

```text
llama-3.1-8b-instant
```

### `NAYA_SECRET`

Optional for local development, but should be set in production. It is used for signing session tokens.

## Important Notes

This is a hackathon project and should not be treated as a medical device.

The app provides educational and organizational support. It does not diagnose medical conditions, prescribe medicine, or replace a qualified clinician.

For severe symptoms such as chest pain, fainting, heavy bleeding, breathing difficulty, or suicidal thoughts, users should seek urgent medical care.

## Current Limitations

- Doctor data is currently stored as static frontend data
- Doctor contact details are demo-style generated contacts
- SQLite is suitable for local development, but not ideal for a large production deployment
- PDF extraction works best with text-based PDFs, not scanned image PDFs
- There is no OCR pipeline yet
- There is no real push notification service yet
- The app does not integrate with wearable devices yet
- The app does not currently send email or SMS reminders
- The AI assistant depends on external Groq API availability

## Future Scope

### Real Doctor Network Integration

The local doctor directory can be replaced with real data from:

- Hospital systems
- Clinic networks
- Practo-like doctor APIs
- Government health registries
- Verified partner doctor databases

This would allow real appointment slots, consultation fees, live availability, and verified contact details.

### Real Location Services

The app currently uses city and state entered by the user. Future versions can integrate:

- Browser geolocation
- Google Maps API
- Mapbox
- OpenStreetMap
- Distance-based doctor ranking
- Nearby hospital search

### Push Notifications

Medication and habit reminders can be upgraded with:

- Browser push notifications
- Email reminders
- SMS reminders
- WhatsApp reminders
- Mobile app notifications

This would make reminders useful even when the user is not actively on the website.

### Wearable Device Integration

Ayuverse can integrate with:

- Google Fit
- Apple Health
- Fitbit
- Garmin
- Samsung Health

This would allow automatic tracking of sleep, steps, heart rate, activity minutes, and stress signals.

### OCR For Scanned Reports

Many health reports are scanned images inside PDFs. Future versions can add OCR using:

- Tesseract
- Google Vision API
- Azure Document Intelligence
- AWS Textract

This would improve report summarization for image-only PDFs.

### Better AI Medical Context

The Guardian can be improved with:

- Retrieval over full user history
- Structured lab value extraction
- Trend analysis across multiple reports
- Risk explainability
- Clinician-facing summaries
- Safer medical triage flows

### Production Database

SQLite can be replaced with:

- PostgreSQL
- MySQL
- Supabase
- Neon
- PlanetScale

This would support better concurrency, backups, migrations, and deployment scaling.

### Role-Based Access

Future versions can add different roles:

- Patient
- Doctor
- Caregiver
- Admin

This would allow doctors or family members to review selected user data with permission.

### Secure File Storage

The current app stores report metadata and summaries. A production version can add:

- Encrypted file storage
- S3-compatible storage
- Signed download URLs
- Document access logs
- User-controlled file deletion

### Mobile App

The frontend can later be extended into:

- Progressive Web App
- React Native app
- Flutter app

This would make reminders, check-ins, and medication logging easier for daily use.

### Analytics And Reports

The monthly report section can be expanded into:

- PDF health summaries
- Medication adherence reports
- Check-in trend charts
- Cycle reports
- Doctor visit preparation sheets

### Biological Age Enhancements

The current biological health age calculator is based on self-reported lifestyle factors. Future versions can make it more accurate by integrating:

- Wearable sleep data
- Step count and activity trends
- Heart rate variability
- Resting heart rate
- Nutrition logs
- Blood biomarkers from lab reports
- Long-term stress and mood trends

This could turn the calculator from a simple lifestyle estimate into a more personalized longevity and preventive health tool.

## Deployment Ideas

For a hackathon demo, the app can run locally with Uvicorn.

For deployment, possible platforms include:

- Render
- Railway
- Fly.io
- Azure App Service
- AWS EC2
- Google Cloud Run

For production, the recommended direction would be:

- FastAPI backend
- PostgreSQL database
- Object storage for files
- HTTPS
- Strong secret management
- Proper authentication and refresh tokens
- Audit logs for sensitive health data

## GitHub Push Checklist

Before pushing the project:

```powershell
git status
```

Make sure these files are not committed:

```text
.env
naya.db
__pycache__/
*.pyc
.venv/
```

Then:

```powershell
git add .
git commit -m "Build Ayuverse health assistant app"
git push
```

## Summary

Ayuverse is a full-stack preventive health assistant that combines personal health tracking, medication adherence, AI report summarization, cycle-aware guidance, doctor discovery, and an AI Guardian chatbot. The current version is suitable for a hackathon demo and gives a strong base for future healthcare integrations.
