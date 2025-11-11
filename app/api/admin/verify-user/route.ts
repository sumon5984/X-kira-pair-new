import { NextResponse } from 'next/server';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { phoneNumber, verified, adminKey } = await request.json();
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!phoneNumber) {
      return NextResponse.json(
        { status: 'error', message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const database = getDatabase(app);
    const userRef = ref(database, `users/${phoneNumber}`);
    
    await set(userRef, {
      phoneNumber,
      verified: verified !== undefined ? verified : true,
      verifiedAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      status: 'success',
      message: `User ${phoneNumber} has been ${verified ? 'verified' : 'unverified'}`
    });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to verify user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('adminKey');
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const database = getDatabase(app);
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return NextResponse.json({
        status: 'success',
        users
      });
    } else {
      return NextResponse.json({
        status: 'success',
        users: {}
      });
    }
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
