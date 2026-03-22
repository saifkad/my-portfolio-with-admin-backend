import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

// DELETE handler to remove a project
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Get the ID from the URL (e.g., /api/projects/12345 -> params.id is "12345")
    const { id } = params;

    // Find and delete the project
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}