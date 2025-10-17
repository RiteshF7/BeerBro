import { NextRequest, NextResponse } from 'next/server';
import { getLocations, createLocation } from '@/lib/adminconsole/locations/api';
import { locationSchema } from '@/lib/adminconsole/locations/types';

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = locationSchema.parse(body);
    
    const locationId = await createLocation(validatedData);
    return NextResponse.json({ id: locationId }, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
