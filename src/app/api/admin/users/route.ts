import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/features/users/api';
import { userSchema } from '@/features/users/types';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);
    
    const userId = await createUser(validatedData);
    return NextResponse.json({ id: userId }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
