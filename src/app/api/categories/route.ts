import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { isAdminAuthenticated } from '@/lib/auth';

// GET: Fetch all categories (Publicly readable, but returns sorted list)
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({})
      .sort({ sortOrder: 1 })
      .lean();
    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// POST: Add new category (Admin only)
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
    const { name, slug, image, description, sortOrder, isActive, parent } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Please provide name and slug' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check unique slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      image: image || '',
      description: description || '',
      parent: parent || null,
      sortOrder: Number(sortOrder) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newCategory.save();

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
