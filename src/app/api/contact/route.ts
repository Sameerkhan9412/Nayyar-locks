import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ContactMessage } from '@/models/ContactMessage';
import { isAdminAuthenticated } from '@/lib/auth';

// POST: Public contact message submission
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    const newMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully!',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// GET: Admin only list all messages
export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
