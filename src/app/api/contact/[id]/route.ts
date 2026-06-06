import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ContactMessage } from '@/models/ContactMessage';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH: Toggle isRead or isReplied
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await dbConnect();
    const message = await ContactMessage.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    if (body.isRead !== undefined) message.isRead = body.isRead;
    if (body.isReplied !== undefined) message.isReplied = body.isReplied;

    await message.save();

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: message,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// DELETE: Delete message
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await dbConnect();
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
