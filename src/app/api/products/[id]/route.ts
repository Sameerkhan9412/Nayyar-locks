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
      !category ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields: name, slug, category, and at least one image' },
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
    product.description = description !== undefined ? description : (product.description || '');
    product.shortDescription = shortDescription !== undefined ? shortDescription : (product.shortDescription || '');
    product.category = category;
    product.images = images;
    product.SKU = SKU || product.SKU || 'SKU-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    product.brand = brand !== undefined ? brand : (product.brand || 'Nayyars');
    product.price = price !== undefined ? Number(price) : (product.price || 0);
    product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : (product.originalPrice || 0);
    product.material = material !== undefined ? material : (product.material || '');
    product.keyType = keyType !== undefined ? keyType : (product.keyType || '');
    product.securityGrade = securityGrade !== undefined ? securityGrade : (product.securityGrade || '');
    product.features = features !== undefined ? features : (product.features || []);
    product.specifications = specifications !== undefined ? specifications : (product.specifications || {});
    product.tags = tags !== undefined ? tags : (product.tags || []);
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isBestseller = isBestseller !== undefined ? isBestseller : product.isBestseller;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
    product.whatsappOverride = whatsappOverride !== undefined ? whatsappOverride : product.whatsappOverride;

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
