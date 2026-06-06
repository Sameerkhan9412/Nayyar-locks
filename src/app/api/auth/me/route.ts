import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ success: true, user: decoded });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Invalid token';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 401 }
    );
  }
}
