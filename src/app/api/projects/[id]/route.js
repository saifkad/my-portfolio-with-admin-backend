import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { revalidatePath } from 'next/cache';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...data } = body;

    const project = await Project.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json(project);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(params.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}