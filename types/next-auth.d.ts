import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    mfaEnabled?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mfaEnabled?: boolean;
      googleAccessToken?: string;
      googleRefreshToken?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    mfaEnabled?: boolean;
    googleAccessToken?: string;
    googleRefreshToken?: string;
  }
}
