# Google Calendar API Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Name it: "Kyle Bethke Calendar"
5. Click "Create"

## Step 2: Enable Google Calendar API

1. Make sure your new project is selected
2. Go to "APIs & Services" > "Library"
3. Search for "Google Calendar API"
4. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Kyle Bethke Calendar
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Search for and add: `https://www.googleapis.com/auth/calendar`
   - Search for and add: `https://www.googleapis.com/auth/calendar.events`
7. Click "Save and Continue"
8. **Test users**: Add your Google email (so you can test it)
9. Click "Save and Continue"

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Name it: "Kyle Bethke Website"
5. **Authorized JavaScript origins**:
   - Add: `http://localhost:3004`
6. **Authorized redirect URIs**:
   - Add: `http://localhost:3004/api/auth/callback/google`
7. Click "Create"
8. **IMPORTANT**: Copy your:
   - Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-xxxxx`)

## Step 5: Add to Environment Variables

We'll add these to your `.env.local` file in the next step!

Save your Client ID and Client Secret somewhere safe for now.

## Production Setup (Later)

When you deploy to production, you'll need to:
1. Add your production domain to "Authorized JavaScript origins"
2. Add your production callback URL to "Authorized redirect URIs"
3. Publish your OAuth consent screen (or keep it in testing with specific users)

---

**Ready?** Once you have your Client ID and Client Secret, let me know and we'll continue building!
