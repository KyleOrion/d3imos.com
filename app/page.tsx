'use client';

import { Box, Typography, Card, Grid, Sheet, IconButton, Stack } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  // Sample data - will be made dynamic later
  const habits = [
    { id: 1, name: 'Morning Exercise', completed: true },
    { id: 2, name: 'Read for 30 min', completed: false },
    { id: 3, name: 'Drink 8 glasses of water', completed: true },
    { id: 4, name: 'Journal', completed: false },
  ];

  const quickLinks = [
    { id: 1, name: 'GitHub', url: 'https://github.com' },
    { id: 2, name: 'Linear', url: 'https://linear.app' },
    { id: 3, name: 'Notion', url: 'https://notion.so' },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 73px)',
        backgroundColor: '#f5f5f7',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Welcome Section */}
      <Box sx={{ mb: 4, maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.5px',
            mb: 1,
          }}
        >
          Welcome to d3imos
        </Typography>
        <Typography
          level="body-lg"
          sx={{
            color: '#6e6e73',
            fontSize: { xs: '1rem', md: '1.125rem' },
          }}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>

      {/* Widget Grid */}
      <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Habit Tracker Widget */}
        <Grid xs={12} md={6} lg={4}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                level="h4"
                sx={{
                  fontWeight: 600,
                  color: '#1d1d1f',
                  fontSize: '1.25rem',
                }}
              >
                Daily Habits
              </Typography>
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            <Stack spacing={1.5}>
              {habits.map((habit) => (
                <Sheet
                  key={habit.id}
                  variant="plain"
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: habit.completed ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: habit.completed ? 'rgba(33, 150, 243, 0.12)' : 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  {habit.completed ? (
                    <CheckCircleOutlineIcon sx={{ color: '#2196f3', fontSize: '1.5rem' }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ color: '#6e6e73', fontSize: '1.5rem' }} />
                  )}
                  <Typography
                    sx={{
                      color: habit.completed ? '#1d1d1f' : '#6e6e73',
                      textDecoration: habit.completed ? 'line-through' : 'none',
                      fontSize: '0.95rem',
                    }}
                  >
                    {habit.name}
                  </Typography>
                </Sheet>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Quick Links Widget */}
        <Grid xs={12} md={6} lg={4}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                level="h4"
                sx={{
                  fontWeight: 600,
                  color: '#1d1d1f',
                  fontSize: '1.25rem',
                }}
              >
                Quick Links
              </Typography>
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <Sheet
                  key={link.id}
                  variant="plain"
                  component="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  <LinkIcon sx={{ color: '#2196f3', fontSize: '1.5rem' }} />
                  <Typography
                    sx={{
                      color: '#1d1d1f',
                      fontSize: '0.95rem',
                    }}
                  >
                    {link.name}
                  </Typography>
                </Sheet>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Projects Widget - Placeholder */}
        <Grid xs={12} md={6} lg={4}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography
              level="h4"
              sx={{
                fontWeight: 600,
                color: '#1d1d1f',
                fontSize: '1.25rem',
                mb: 2,
              }}
            >
              Active Projects
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6e6e73',
              }}
            >
              <Typography level="body-sm">Coming soon...</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Notes Widget - Placeholder */}
        <Grid xs={12} md={6} lg={8}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              minHeight: '300px',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography
              level="h4"
              sx={{
                fontWeight: 600,
                color: '#1d1d1f',
                fontSize: '1.25rem',
                mb: 2,
              }}
            >
              Quick Notes
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: '#f5f5f7',
                minHeight: '240px',
                color: '#6e6e73',
              }}
            >
              <Typography level="body-sm">Your whiteboard space...</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}