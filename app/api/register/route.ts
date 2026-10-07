import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/user';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - Feelix Brothers Protection
    // Educational: Allow 3 registration attempts per IP per hour
    // Prevents mass account creation and DoS attacks
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, {
      maxRequests: 3,
      windowSeconds: 3600, // 1 hour
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'Too many registration attempts. Please try again later.',
          resetTime: resetDate.toISOString(),
        },
        {
          status: 429, // 429 Too Many Requests
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { username, email, password, confirmPassword } = body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Password strength validation - Feelix Brothers Protection
    // Educational: Strong passwords prevent brute force attacks
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character (!@#$%^&*...)' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Username validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters (letters, numbers, underscore only)' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(username, email, password);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.message === 'Username or email already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
