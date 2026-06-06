import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT: Update product (Admin only)
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
      name,
      slug,
      description,
      shortDescription,
      category,
      images,
      SKU,
      brand,
      price,
      originalPrice,
      material,
      keyType,
      securityGrade,
      features,
      specifications,
      tags,
      isActive,
      isFeatured,
      isBestseller,
      isNewArrival,
      whatsappOverride,
    } = body;

    // Validation
    if (
      !name ||
      !slug ||
      !description ||
      !shortDescription ||
      !category ||
      !images ||
      images.length === 0 ||
      !SKU ||
      !brand ||
      price === undefined ||
      originalPrice === undefined ||
      !material ||
      !keyType ||
      !securityGrade
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check slug duplicate
    const duplicateSlug = await Product.findOne({
      slug: slug.toLowerCase(),
      _id: { $ne: id },
    });
    if (duplicateSlug) {
      return NextResponse.json(
        { success: false, error: 'A product with this URL slug already exists' },
        { status: 400 }
      );
    }

    // Check SKU duplicate
    const duplicateSKU = await Product.findOne({
      SKU,
      _id: { $ne: id },
    });
    if (duplicateSKU) {
      return NextResponse.json(
        { success: false, error: 'A product with this SKU already exists' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    product.name = name;
    product.slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    product.description = description;
    product.shortDescription = shortDescription;
    product.category = category;
    product.images = images;
    product.SKU = SKU;
    product.brand = brand;
    product.price = Number(price);
    product.originalPrice = Number(originalPrice);
    product.material = material;
    product.keyType = keyType;
    product.securityGrade = securityGrade;
    product.features = features || [];
    product.specifications = specifications || {};
    product.tags = tags || [];
    product.isActive = isActive !== undefined ? isActive : true;
    product.isFeatured = isFeatured !== undefined ? isFeatured : false;
    product.isBestseller = isBestseller !== undefined ? isBestseller : false;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : false;
    product.whatsappOverride = whatsappOverride || undefined;

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// DELETE: Delete product (Admin only)
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
