import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json({ success: true, data: users });
}

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: 'name and email are required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({ data: { name, email } });
  return NextResponse.json({ success: true, data: user }, { status: 201 });
}
