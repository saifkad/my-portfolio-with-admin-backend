import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...data } = body; // strip internals

    const skill = await Skill.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    return NextResponse.json(skill);
    revalidatePath('/');
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const skill = await Skill.findByIdAndDelete(params.id);
    if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    return NextResponse.json({ success: true });
    revalidatePath('/');
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}