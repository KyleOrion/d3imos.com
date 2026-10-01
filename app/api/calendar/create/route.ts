import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createCalendarEvent, CalendarEvent } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!session.user?.googleAccessToken) {
      return NextResponse.json(
        { error: 'No Google Calendar access. Please sign in with Google.' },
        { status: 403 }
      );
    }

    const body: CalendarEvent = await request.json();

    // Validation
    if (!body.summary) {
      return NextResponse.json(
        { error: 'Event summary is required' },
        { status: 400 }
      );
    }

    if (!body.start || (!body.start.dateTime && !body.start.date)) {
      return NextResponse.json(
        { error: 'Event start time is required' },
        { status: 400 }
      );
    }

    if (!body.end || (!body.end.dateTime && !body.end.date)) {
      return NextResponse.json(
        { error: 'Event end time is required' },
        { status: 400 }
      );
    }

    const event = await createCalendarEvent(body);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}
