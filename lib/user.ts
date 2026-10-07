import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  tempMfaSecret?: string;
  // Google OAuth fields
  googleId?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DATABASE_NAME = 'd3imos_auth';
const USERS_COLLECTION = 'users';

export async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  return db.collection<User>(USERS_COLLECTION);
}

export async function findUserByUsername(username: string) {
  const users = await getUsersCollection();
  return await users.findOne({ username: username.toLowerCase() });
}

export async function findUserByEmail(email: string) {
  const users = await getUsersCollection();
  return await users.findOne({ email: email.toLowerCase() });
}

export async function createUser(username: string, email: string, password: string) {
  const users = await getUsersCollection();

  // Check if user already exists
  const existingUser = await users.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() }
    ]
  });

  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
    mfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users.insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function verifyPassword(user: User, password: string) {
  if (!user.password) {
    return false;
  }
  return await bcrypt.compare(password, user.password);
}

export async function enableMFA(userId: ObjectId, secret: string) {
  const users = await getUsersCollection();
  await users.updateOne(
    { _id: userId },
    {
      $set: {
        mfaEnabled: true,
        mfaSecret: secret,
        updatedAt: new Date(),
      }
    }
  );
}

export async function disableMFA(userId: ObjectId) {
  const users = await getUsersCollection();
  await users.updateOne(
    { _id: userId },
    {
      $set: {
        mfaEnabled: false,
        mfaSecret: undefined,
        updatedAt: new Date(),
      }
    }
  );
}
