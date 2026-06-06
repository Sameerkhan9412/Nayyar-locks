import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim() === '') {
      return NextResponse.json({ success: true, products: [] });
    }

    // Connect categories so we can display them or filter them
    // Fetch categories first to see if query matches a category name
    const matchingCategories = await Category.find({
      name: { $regex: query, $options: 'i' },
      isActive: true,
    }).select('_id');

    const categoryIds = matchingCategories.map((c) => c._id);

    const regexSearch = { $regex: query, $options: 'i' };

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: regexSearch },
        { brand: regexSearch },
        { tags: regexSearch },
        { description: regexSearch },
        { shortDescription: regexSearch },
        { SKU: regexSearch },
        { category: { $in: categoryIds } },
      ],
    })
      .populate('category', 'name slug')
      .limit(6)
      .select('name slug images price SKU brand category')
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
