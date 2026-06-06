import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT: Update category (Admin only)
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
    const { name, slug, image, description, sortOrder, isActive } = body;

    if (!name || !slug || !image || !description) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if another category is using the new slug
    const duplicate = await Category.findOne({
      slug: slug.toLowerCase(),
      _id: { $ne: id },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    category.name = name;
    category.slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    category.image = image;
    category.description = description;
    category.sortOrder = Number(sortOrder) || 0;
    category.isActive = isActive !== undefined ? isActive : true;

    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// DELETE: Remove category (Admin only)
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

    // Prevent deletion if category is in use by products
    const inUse = await Product.findOne({ category: id });
    if (inUse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete category because it contains active products. Re-assign products first.',
        },
        { status: 400 }
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
