import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - api/register (registration endpoint)
     * - auth/signin (sign in page)
     * - auth/signup (sign up page)
     * - auth/error (auth error page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/register|auth/signin|auth/signup|auth/error|_next/static|_next/image|favicon.ico).*)',
  ],
};
