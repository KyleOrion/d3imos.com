import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TOTP, Secret } from 'otpauth';
import QRCode from 'qrcode';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/user';

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

    // Generate a secret for TOTP
    const secret = new Secret({ size: 20 });

    // Create TOTP instance
    const totp = new TOTP({
      issuer: process.env.NEXT_PUBLIC_APP_NAME || 'Kyle Bethke',
      label: session.user.email || session.user.name || 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    // Generate QR code
    const otpauthURL = totp.toString();
    const qrCodeDataURL = await QRCode.toDataURL(otpauthURL);

    // Store the secret temporarily (will be verified before enabling)
    // In production, you might want to use a temporary storage like Redis
    const users = await getUsersCollection();
    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          tempMfaSecret: secret.base32,
          updatedAt: new Date(),
        }
      }
    );

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataURL,
      otpauthURL: otpauthURL,
    });
  } catch (error: any) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}
