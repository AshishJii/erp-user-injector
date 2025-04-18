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
    const { token } = await req.json();

    if (!token || !tokenStore[token]) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing token' } satisfies LoginResponse,
        { status: 401 }
      );
    }

    const { username, password } = tokenStore[token];
    const user = await loginToERP(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } satisfies LoginResponse,
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, user } satisfies LoginResponse,
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
  return null;
}
