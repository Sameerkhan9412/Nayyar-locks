import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Review } from '@/models/Review';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT: Update review (Admin only)
export async function PUT(request: Request, { params }: RouteParams) {
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
    const {
      customerName,
      location,
      avatar,
      rating,
      title,
      comment,
      linkedProduct,
      isFeatured,
      isPublished,
      source,
      reviewDate,
    } = body;

    if (!customerName || !location || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    review.customerName = customerName;
    review.location = location;
    review.avatar = avatar || '';
    review.rating = Number(rating);
    review.title = title;
    review.comment = comment;
    review.linkedProduct = linkedProduct || undefined;
    review.isFeatured = isFeatured !== undefined ? isFeatured : false;
    review.isPublished = isPublished !== undefined ? isPublished : true;
    review.source = source || 'Manual';
    if (reviewDate) {
      review.reviewDate = new Date(reviewDate);
    }

    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// DELETE: Delete review (Admin only)
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
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
