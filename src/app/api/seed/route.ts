import { NextResponse } from 'next/server';
import { runSeed } from '@/lib/seed';

export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
