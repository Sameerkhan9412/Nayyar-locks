import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Settings } from '@/models/Settings';
import { isAdminAuthenticated } from '@/lib/auth';

// GET: Fetch settings
export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const defaultSettings = new Settings();
      await defaultSettings.save();
      settings = defaultSettings.toObject();
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// PUT: Update settings (Admin only)
export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
    } else {
      // Clean request payload to avoid assigning empty structures
      Object.assign(settings, body);
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
