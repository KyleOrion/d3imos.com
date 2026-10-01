import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { listCalendarEvents } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin') || undefined;
    const timeMax = searchParams.get('timeMax') || undefined;
    const maxResults = parseInt(searchParams.get('maxResults') || '50');

    const events = await listCalendarEvents(timeMin, timeMax, maxResults);

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Calendar events fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}
