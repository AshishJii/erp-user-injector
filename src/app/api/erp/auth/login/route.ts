import { NextRequest, NextResponse } from 'next/server';
import { loginToERP } from '@/lib/loginToERP';
import { saveToken } from '@/lib/tokenStore';
import { LoginResponse } from '@/lib/types';

function generateToken(username: string): string {
  return `proxy-token-${Math.random().toString(36).substring(2)}-${username}`;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Missing username or password' } satisfies LoginResponse, { status: 400 });
    }
    const user = await loginToERP(username, password);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' } satisfies LoginResponse, { status: 401 });
    }
    const token = generateToken(username);
    saveToken(token, { username, password });
    return NextResponse.json({ success: true, token, user } satisfies LoginResponse, { status: 200 });
  } catch (err) {
    console.error('Internal error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' } satisfies LoginResponse, { status: 500 });
  }
}