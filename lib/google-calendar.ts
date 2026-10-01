import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getGoogleCalendarClient() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.googleAccessToken) {
    throw new Error('No Google access token found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  );

  oauth2Client.setCredentials({
    access_token: session.user.googleAccessToken,
    refresh_token: session.user.googleRefreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  return { calendar, oauth2Client };
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
  conferenceData?: any;
}

export async function listCalendarEvents(
  timeMin?: string,
  timeMax?: string,
  maxResults: number = 50
) {
  const { calendar } = await getGoogleCalendarClient();

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin || new Date().toISOString(),
    timeMax,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}

export async function createCalendarEvent(event: CalendarEvent) {
  const { calendar } = await getGoogleCalendarClient();

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: event.conferenceData ? 1 : undefined,
  });

  return response.data;
}

export async function updateCalendarEvent(eventId: string, event: Partial<CalendarEvent>) {
  const { calendar } = await getGoogleCalendarClient();

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: event,
  });

  return response.data;
}

export async function deleteCalendarEvent(eventId: string) {
  const { calendar } = await getGoogleCalendarClient();

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });

  return { success: true };
}
