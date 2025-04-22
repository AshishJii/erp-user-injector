import { NextRequest, NextResponse } from 'next/server';
import { getTokenRecord } from '@/lib/tokenStore';
import { loginToERP } from '@/lib/loginToERP';
import { LoginResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json( { status: 'error', msg: 'Missing token' } satisfies LoginResponse, { status: 400 } );    
    }
    const record = getTokenRecord(token);
    if (!record) {
      return NextResponse.json( { status: 'error', msg: 'Invalid token' } satisfies LoginResponse, { status: 401 } );
    }

    const erpRes = await loginToERP(record.username, record.password);

    if (erpRes.status === 'error') {
      return NextResponse.json( { status: 'error', msg: 'Stored credentials invalid' } satisfies LoginResponse, { status: 401 } );
    }

    return NextResponse.json( { status: 'success', data: { user: erpRes.data } } satisfies LoginResponse, { status: 200 } );
  } catch (err) {
    console.error('Internal error:', err);
    return NextResponse.json( { status: 'error', msg: 'Internal server error' } satisfies LoginResponse, { status: 500 } );
  }
}