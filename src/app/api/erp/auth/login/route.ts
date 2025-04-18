import { NextRequest, NextResponse } from 'next/server';
import { tokenStore } from '@/lib/tokenStore';

type User = {
  name: string;
  roll: string;
  branch: string;
  section: string;
  email: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing username or password' } satisfies LoginResponse,
        { status: 400 }
      );
    }

    const user = await loginToERP(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } satisfies LoginResponse,
        { status: 401 }
      );
    }

    const token = generateToken(username);

    // Store the token and associated credentials (in-memory for now)
    tokenStore[token] = { username, password };
    console.log(tokenStore);

    return NextResponse.json(
      { success: true, token, user } satisfies LoginResponse,
      { status: 200 }
    );
  } catch (err) {
    console.error('Internal error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies LoginResponse,
      { status: 500 }
    );
  }
}

async function loginToERP(username: string, password: string): Promise<User | null> {
  console.log('Simulating ERP login...');
  if (username === 'ashish' && password === 'ayush123') {
    return {
      name: 'Ashish Verma',
      roll: '21CS123',
      branch: 'CSE',
      section: 'A',
      email: 'ashish@example.edu',
    };
  }
  if (username === 'ayush' && password === 'ayush123') {
    return {
      name: 'Ayush Bhadauria',
      roll: '24B3422',
      branch: 'IOT',
      section: 'B',
      email: 'ayush@example.edu',
    };
  }
  return null; // unified return format — no exceptions
}

// Simulate token generation — in a real app use JWT or secure tokens
function generateToken(username: string): string {
  return `proxy-token-${Math.random().toString(36).substring(2)}-${username}`;
}