import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { resumeDownload } from '@/data/contact';

/**
 * API route for serving resume PDF with proper headers
 * Requirements: 3.2, 3.3
 */
export async function GET(request: NextRequest) {
  try {
    // Get the resume file path
    const resumePath = join(process.cwd(), 'public', 'resume', resumeDownload.filename);
    
    // Read the PDF file
    const pdfBuffer = await readFile(resumePath);
    
    // Create response with proper headers
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resumeDownload.filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Last-Modified': new Date(resumeDownload.lastUpdated).toUTCString(),
      },
    });

    return response;
  } catch (error) {
    console.error('Error serving resume:', error);
    
    return NextResponse.json(
      { error: 'Resume not found' },
      { status: 404 }
    );
  }
}

/**
 * Handle HEAD requests for resume metadata
 */
export async function HEAD(request: NextRequest) {
  try {
    const resumePath = join(process.cwd(), 'public', 'resume', resumeDownload.filename);
    const pdfBuffer = await readFile(resumePath);
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Last-Modified': new Date(resumeDownload.lastUpdated).toUTCString(),
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 404 });
  }
}