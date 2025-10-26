import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Email is required',
          code: 'MISSING_EMAIL' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT' 
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { 
          error: 'Password is required',
          code: 'MISSING_PASSWORD' 
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 6 characters long',
          code: 'PASSWORD_TOO_SHORT' 
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Name is required',
          code: 'MISSING_NAME' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();

    // Check if email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          error: 'Email already exists',
          code: 'EMAIL_EXISTS' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db.insert(users)
      .values({
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        createdAt: new Date().toISOString()
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);

    // Handle unique constraint violation (in case race condition occurs)
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          error: 'Email already exists',
          code: 'EMAIL_EXISTS' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message 
      },
      { status: 500 }
    );
  }
}