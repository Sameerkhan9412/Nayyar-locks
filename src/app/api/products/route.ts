import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { isAdminAuthenticated } from '@/lib/auth';
import mongoose from 'mongoose';

// GET: Fetch products (Public/Admin, support listing all)
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get('category') || '';
    const adminFetch = searchParams.get('admin') === 'true';

    const query: any = {};
    if (!adminFetch) {
      query.isActive = true;
    }
    if (categoryQuery) {
      const isObjectId = mongoose.Types.ObjectId.isValid(categoryQuery);
      const matchedCategory = await Category.findOne(
        isObjectId ? { _id: categoryQuery } : { slug: categoryQuery }
      );
      if (matchedCategory) {
        const subCategories = await Category.find({ parent: matchedCategory._id }).select('_id');
        const ids = [matchedCategory._id, ...subCategories.map((c) => c._id)];
        query.category = { $in: ids };
      } else {
        query.category = categoryQuery;
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// POST: Add new product (Admin only)
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

    // Check unique slug and SKU
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'A product with this URL slug already exists' },
        { status: 400 }
      );
    }

    const existingSKU = await Product.findOne({ SKU });
    if (existingSKU) {
      return NextResponse.json(
        { success: false, error: 'A product with this SKU already exists' },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      description: description || '',
      shortDescription: shortDescription || '',
      category,
      images,
      SKU: SKU || 'SKU-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      brand: brand || 'Nayyars',
      price: price !== undefined ? Number(price) : 0,
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : 0,
      material: material || '',
      keyType: keyType || '',
      securityGrade: securityGrade || '',
      features: features || [],
      specifications: specifications || {},
      tags: tags || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isBestseller: isBestseller !== undefined ? isBestseller : false,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : false,
      whatsappOverride: whatsappOverride || undefined,
    });

    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
