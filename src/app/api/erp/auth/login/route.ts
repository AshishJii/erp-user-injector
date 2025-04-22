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
      return NextResponse.json(
        { status: "error", msg: 'Missing username or password' } satisfies LoginResponse, { status: 400 }
      );
    }

    const erpRes = await loginToERP(username, password);
    if (erpRes.status === 'error') {
      return NextResponse.json(
        { status: "error", msg: erpRes.msg } satisfies LoginResponse, { status: 401 }
      );
    }

    const token = generateToken(username);
    saveToken(token, { username, password });
    return NextResponse.json(
      {
        status: "success",
        data: {
          user: erpRes.data,
          token,
        },
      } satisfies LoginResponse,
      { status: 200 }
    );
  } catch (err) {
    console.error('Internal error:', err);
    return NextResponse.json(
      { status: "error", msg: 'Internal server error' } satisfies LoginResponse, { status: 500 }
    );
  }
}