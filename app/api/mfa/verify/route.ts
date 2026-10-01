import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TOTP } from 'otpauth';
import { ObjectId } from 'mongodb';
import { getUsersCollection, enableMFA } from '@/lib/user';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'MFA code is required' },
        { status: 400 }
      );
    }

    // Get the temporary secret
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(session.user.id) });

    if (!user || !user.tempMfaSecret) {
      return NextResponse.json(
        { error: 'No MFA setup in progress' },
        { status: 400 }
      );
    }

    // Verify the code
    const totp = new TOTP({
      secret: user.tempMfaSecret,
    });

    const isValid = totp.validate({
      token: code,
      window: 1,
    });

    if (isValid === null) {
      return NextResponse.json(
        { error: 'Invalid MFA code' },
        { status: 400 }
      );
    }

    // Enable MFA and move temp secret to permanent
    await enableMFA(new ObjectId(session.user.id), user.tempMfaSecret);

    // Clear temp secret
    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $unset: { tempMfaSecret: '' }
      }
    );

    return NextResponse.json({
      message: 'MFA enabled successfully',
    });
  } catch (error: any) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
