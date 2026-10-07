/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['shared-components', 'shared-utils'],

  // Security Headers - Feelix Brothers Defense Protocol
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Content Security Policy - Prevents XSS attacks
          // Educational: Controls what resources can load (scripts, styles, images, etc.)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'", // Only load resources from same origin by default
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts (needed for Next.js/React)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow inline styles + Google Fonts
              "font-src 'self' https://fonts.gstatic.com data:", // Allow fonts from Google + data URIs
              "img-src 'self' data: https: blob:", // Allow images from anywhere (for user uploads, external APIs)
              "connect-src 'self' https://accounts.google.com https://www.googleapis.com", // Allow API calls to Google
              "frame-ancestors 'none'", // Prevent embedding in iframes (anti-clickjacking)
              "base-uri 'self'", // Restrict <base> tag to prevent base tag hijacking
              "form-action 'self'", // Only allow forms to submit to same origin
              "upgrade-insecure-requests", // Auto-upgrade HTTP to HTTPS
            ].join('; '),
          },

          // X-Frame-Options - Prevents clickjacking attacks
          // Educational: Stops attackers from embedding your site in invisible iframes
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Never allow embedding in frames
          },

          // X-Content-Type-Options - Prevents MIME-sniffing attacks
          // Educational: Forces browser to respect Content-Type header
          // Stops "image.jpg" from being executed as JavaScript
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // Referrer-Policy - Controls referrer information leakage
          // Educational: Prevents sensitive URL parameters from leaking to third parties
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Send full URL to same origin, only origin to cross-origin
          },

          // Permissions-Policy - Disables unnecessary browser features
          // Educational: Prevents malicious scripts from accessing camera, microphone, etc.
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()', // Disable camera
              'microphone=()', // Disable microphone
              'geolocation=()', // Disable geolocation
              'interest-cohort=()', // Disable FLoC tracking
              'payment=()', // Disable payment API
              'usb=()', // Disable USB access
            ].join(', '),
          },

          // Strict-Transport-Security (HSTS) - Forces HTTPS
          // Educational: Once user visits site, browser will ONLY use HTTPS for next 2 years
          // Prevents SSL stripping attacks
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // X-DNS-Prefetch-Control - Prevents DNS prefetch to protect privacy
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig