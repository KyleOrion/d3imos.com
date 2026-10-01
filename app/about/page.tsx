'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/joy';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExploreIcon from '@mui/icons-material/Explore';

// Things you're interested in or learning about
const interests = [
  {
    icon: CodeIcon,
    title: "Learning to Code",
    description: "Exploring web development with Next.js, React, and TypeScript. Building this portfolio is my first real project!",
    skills: ["Next.js", "React", "TypeScript", "Material-UI"],
  },
  {
    icon: SchoolIcon,
    title: "Student",
    description: "Currently learning and growing, always curious about how things work.",
    skills: ["Problem Solving", "Critical Thinking", "Always Learning"],
  },
  {
    icon: SportsEsportsIcon,
    title: "Gaming",
    description: "Interested in game development and the technology behind interactive experiences.",
    skills: ["Game Design", "Interactive Media", "Problem Solving"],
  },
  {
    icon: ExploreIcon,
    title: "Explorer",
    description: "Curious about technology, space, and how things work. Always ready to learn something new.",
    skills: ["Curiosity", "Innovation", "Adventure"],
  },
];

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: 'background.body', minHeight: 'calc(100vh - 73px)', py: 6 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Stack spacing={3} alignItems="center" sx={{ mb: 6 }}>
          <Typography
            level="h1"
            sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Kyle
          </Typography>

          <Typography level="h3" color="neutral" sx={{ textAlign: 'center' }}>
            Student • Developer • Explorer
          </Typography>

          <Typography level="body-lg" sx={{ maxWidth: 800, textAlign: 'center', px: 2 }}>
            Hi! I'm Kyle Bethke. I'm learning to build websites and exploring the world of software development.
            This portfolio is my first major project, and I'm excited to share my journey with you!
          </Typography>
        </Stack>

        {/* Interests Grid */}
        <Stack spacing={3} sx={{ mb: 6 }}>
          <Typography level="h2" textAlign="center">
            What I'm Into
          </Typography>

          <Grid container spacing={3}>
            {interests.map((interest, index) => {
              const Icon = interest.icon;
              return (
                <Grid key={index} xs={12} sm={6} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'lg',
                        borderColor: 'primary.500',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Icon sx={{ fontSize: 32, color: 'primary.500' }} />
                          <Typography level="h4">{interest.title}</Typography>
                        </Stack>

                        <Typography level="body-md" color="neutral">
                          {interest.description}
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {interest.skills.map((skill) => (
                            <Chip
                              key={skill}
                              variant="soft"
                              color="primary"
                              size="sm"
                            >
                              {skill}
                            </Chip>
                          ))}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>

        {/* Journey Section - Placeholder for now */}
        <Card variant="soft" sx={{ p: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography level="h3">My Journey</Typography>
            <Typography level="body-lg" textAlign="center" color="neutral">
              I'm just getting started! This space will grow as I learn more, build more projects,
              and have more experiences to share. Check back later to see what I've been up to!
            </Typography>
          </Stack>
        </Card>

        {/* Fun Facts */}
        <Stack spacing={3} sx={{ mt: 6 }}>
          <Typography level="h3" textAlign="center">
            Quick Facts
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography level="title-sm" color="primary">
                      🎯 Currently Learning
                    </Typography>
                    <Typography level="body-md">
                      Next.js, React, TypeScript, and web development fundamentals
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography level="title-sm" color="primary">
                      💡 Fun Fact
                    </Typography>
                    <Typography level="body-md">
                      This portfolio is my first real coding project!
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography level="title-sm" color="primary">
                      🚀 Goals
                    </Typography>
                    <Typography level="body-md">
                      Build cool projects and learn something new every day
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography level="title-sm" color="primary">
                      🎮 Interests
                    </Typography>
                    <Typography level="body-md">
                      Gaming, technology, coding, and exploring new ideas
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
