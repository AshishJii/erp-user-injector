import { NextRequest, NextResponse } from 'next/server';
import { getTokenRecord } from '@/lib/tokenStore';
import { loginToERP } from '@/lib/loginToERP';
import { LoginResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing token' } satisfies LoginResponse, { status: 400 });
    }
    const record = getTokenRecord(token);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Invalid token' } satisfies LoginResponse, { status: 401 });
    }
    const user = await loginToERP(record.username, record.password);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Stored credentials invalid' } satisfies LoginResponse, { status: 401 });
    }
    return NextResponse.json({ success: true, user } satisfies LoginResponse, { status: 200 });
  } catch (err) {
    console.error('Internal error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' } satisfies LoginResponse, { status: 500 });
  }
}