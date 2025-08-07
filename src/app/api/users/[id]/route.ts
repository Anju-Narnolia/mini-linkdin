import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Post from '@/models/Post';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const posts = await Post.find({ user: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      name: user.name,
      bio: user.bio || '',
      posts: posts.map(p => ({ _id: p._id.toString(), text: p.text })),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { name, bio } = await req.json();
  const user = await User.findByIdAndUpdate(
    id,
    { name, bio },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
  });
}
