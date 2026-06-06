import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully',
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
