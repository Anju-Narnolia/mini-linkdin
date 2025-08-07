import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import User from '../../../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { userId: string };
    userId = decoded.userId; // FIXED: use userId from JWT payload
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text || typeof text !== 'string' || text.length > 500) {
    return NextResponse.json({ message: 'Invalid post text' }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const post = await Post.create({ user: user._id, text });
  return NextResponse.json(post, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate('user', 'name bio avatar');
  return NextResponse.json(posts);
}
