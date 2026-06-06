import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Review } from '@/models/Review';
import { isAdminAuthenticated } from '@/lib/auth';

// GET: Fetch reviews (Publicly accessible)
export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({})
      .populate('linkedProduct', 'name slug SKU')
      .sort({ reviewDate: -1 })
      .lean();
    return NextResponse.json({ success: true, reviews });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// POST: Add new review (Admin only)
export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const newReview = new Review({
      customerName,
      location,
      avatar: avatar || '',
      rating: Number(rating),
      title,
      comment,
      linkedProduct: linkedProduct || undefined,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isPublished: isPublished !== undefined ? isPublished : true,
      source: source || 'Manual',
      reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
    });

    await newReview.save();

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
