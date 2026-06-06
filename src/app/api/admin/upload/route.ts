import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authenticate Admin Session
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    // 2. Validate Cloudinary Configuration Credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudinary credentials are not configured in your .env.local file. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
        },
        { status: 400 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 3. Extract File from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in request.' },
        { status: 400 }
      );
    }

    // 4. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload Stream to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nayyarslocks',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    }) as any;

    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve secure URL from Cloudinary.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: unknown) {
    console.error('Cloudinary upload route error:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
