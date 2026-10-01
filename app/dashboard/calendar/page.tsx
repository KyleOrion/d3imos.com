'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  Sheet,
  Alert,
  Modal,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  IconButton,
} from '@mui/joy';
import {
  CalendarMonth,
  Event,
  Add,
  Refresh,
  Warning,
  CheckCircle,
  AccessTime,
  LocationOn,
  Google,
} from '@mui/icons-material';
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  htmlLink?: string;
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    summary: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, currentMonth, router]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const timeMin = startOfMonth(currentMonth).toISOString();
      const timeMax = endOfMonth(currentMonth).toISOString();

      const response = await fetch(
        `/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startDateTime = `${newEvent.startDate}T${newEvent.startTime}:00`;
      const endDateTime = `${newEvent.endDate}T${newEvent.endTime}:00`;

      const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: newEvent.summary,
          description: newEvent.description,
          location: newEvent.location,
          start: {
            dateTime: startDateTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDateTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      setSuccess('Event created successfully!');
      setShowCreateModal(false);
      setNewEvent({
        summary: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
      });
      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.dateTime) {
      const start = parseISO(event.start.dateTime);
      const end = parseISO(event.end.dateTime!);
      return `${format(start, 'MMM d, yyyy h:mm a')} - ${format(end, 'h:mm a')}`;
    } else if (event.start.date) {
      return format(parseISO(event.start.date), 'MMM d, yyyy') + ' (All day)';
    }
    return 'No time specified';
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: CalendarEvent[] } = {};

    events.forEach((event) => {
      const dateKey = event.start.dateTime
        ? format(parseISO(event.start.dateTime), 'yyyy-MM-dd')
        : event.start.date || 'unknown';

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session?.user?.googleAccessToken) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Sheet sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: 'lg', textAlign: 'center' }}>
          <Google sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
          <Typography level="h3" sx={{ mb: 2 }}>
            Connect Google Calendar
          </Typography>
          <Typography level="body-md" sx={{ mb: 3 }}>
            To view and manage your calendar, please sign in with your Google account.
          </Typography>
          <Button
            size="lg"
            startDecorator={<Google />}
            onClick={() => router.push('/auth/signin')}
          >
            Sign in with Google
          </Button>
        </Sheet>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 4 }}>
      <Sheet sx={{ maxWidth: 1200, mx: 'auto', p: 4, borderRadius: 'lg', boxShadow: 'lg' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarMonth sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography level="h2">My Calendar</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={fetchEvents} disabled={loading}>
              <Refresh />
            </IconButton>
            <Button startDecorator={<Add />} onClick={() => setShowCreateModal(true)}>
              New Event
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }} startDecorator={<Warning />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" sx={{ mb: 2 }} startDecorator={<CheckCircle />}>
            {success}
          </Alert>
        )}

        {/* Month Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button variant="outlined" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            Previous
          </Button>
          <Typography level="h4">{format(currentMonth, 'MMMM yyyy')}</Typography>
          <Button variant="outlined" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next
          </Button>
        </Box>

        {/* Events List */}
        {events.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography level="h4" sx={{ mb: 1 }}>
              No events this month
            </Typography>
            <Typography level="body-md" color="neutral">
              Create a new event to get started
            </Typography>
          </Card>
        ) : (
          <Box>
            <Typography level="body-sm" sx={{ mb: 2, color: 'text.secondary' }}>
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </Typography>

            {groupEventsByDate().map(([date, dateEvents]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </Typography>
                <List>
                  {dateEvents.map((event) => (
                    <ListItem key={event.id}>
                      <Card sx={{ width: '100%', p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography level="title-lg" sx={{ mb: 0.5 }}>
                              {event.summary}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <AccessTime sx={{ fontSize: 16 }} />
                              <Typography level="body-sm">
                                {event.start.dateTime
                                  ? `${format(parseISO(event.start.dateTime), 'h:mm a')} - ${format(
                                      parseISO(event.end.dateTime!),
                                      'h:mm a'
                                    )}`
                                  : 'All day'}
                              </Typography>
                            </Box>

                            {event.location && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <LocationOn sx={{ fontSize: 16 }} />
                                <Typography level="body-sm">{event.location}</Typography>
                              </Box>
                            )}

                            {event.description && (
                              <Typography level="body-sm" sx={{ color: 'text.secondary', mt: 1 }}>
                                {event.description}
                              </Typography>
                            )}
                          </Box>

                          {event.htmlLink && (
                            <Button
                              size="sm"
                              variant="outlined"
                              component="a"
                              href={event.htmlLink}
                              target="_blank"
                            >
                              Open in Google
                            </Button>
                          )}
                        </Box>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}
      </Sheet>

      {/* Create Event Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalDialog sx={{ maxWidth: 500, width: '100%' }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            Create New Event
          </Typography>

          <form onSubmit={handleCreateEvent}>
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel>Event Title</FormLabel>
              <Input
                placeholder="Team Meeting"
                value={newEvent.summary}
                onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
              />
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Discuss Q4 goals..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                minRows={2}
              />
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Conference Room A"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <FormControl required>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <FormControl required>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button fullWidth type="submit" loading={loading}>
                Create Event
              </Button>
            </Box>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
