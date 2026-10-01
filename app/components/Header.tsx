'use client';

import { Box, Stack, IconButton, Typography } from '@mui/joy';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Start simple - just Home for now!
// We'll add more pages as you build them:
// - About page
// - Projects page
// - Blog page
// - Contact page

const routes = [
  { path: '/', label: 'Home', icon: HomeRoundedIcon },
  { path: '/about', label: 'About', icon: PersonRoundedIcon },
  { path: '/dashboard/calendar', label: 'Calendar', icon: CalendarMonthIcon },
  // Uncomment these as you build the pages:
  // { path: '/projects', label: 'Projects', icon: FolderOpenIcon },
  // { path: '/blog', label: 'Blog', icon: ArticleRoundedIcon },
  // { path: '/contact', label: 'Contact', icon: ContactMailIcon },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        p: 2,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Logo/Name */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography
            level="h4"
            sx={{
              fontWeight: 600,
              color: '#1d1d1f',
              cursor: 'pointer',
              letterSpacing: '-0.5px',
              fontFamily: 'display',
            }}
          >
            d3imos
          </Typography>
        </Link>

        {/* Navigation Icons */}
        <Stack direction="row" spacing={1}>
          {routes.map(({ path, label, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <IconButton
                key={path}
                component={Link}
                href={path}
                variant={isActive ? 'soft' : 'plain'}
                color={isActive ? 'primary' : 'neutral'}
                title={label}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Icon />
              </IconButton>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
