// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: Promise<{ id: string }>; // Typed as a Promise
}

async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  if ((session.user as any).role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden: admin access required" };
  }
  return { ok: true as const, session };
}

// GET: Fetch Single Project by path parameter
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const projectsCollection = db.collection("projectscollection");

    // 💡 MUST await the params promise before reading the id
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Project ID" }, { status: 400 });
    }

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add Comment and Rating to a Single Project
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const projectsCollection = db.collection("projectscollection");

    // 💡 MUST await the params promise here too
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid or missing Project ID" }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { comment, rating } = body;

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const newReview = {
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      comment: comment?.trim(),
      rating: Number(rating),
      createdAt: new Date(),
    };

    const updatedReviews = [...(project.reviews || []), newReview];
    const totalRating = updatedReviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
    const averageRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    await projectsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          reviews: updatedReviews,
          averageRating: averageRating,
          reviewCount: updatedReviews.length,
        },
      }
    );

    return NextResponse.json({ success: true, message: "Review added", reviews: updatedReviews, averageRating });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update a project — used for both the "featured" toggle and full edits.
// Admin-only. Only whitelisted fields are ever written to the DB.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const projectsCollection = db.collection("projectscollection");
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid or missing Project ID" }, { status: 400 });
    }

    const adminCheck = await requireAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json(
        { success: false, message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    const body = await req.json();

    // Whitelist updatable fields so arbitrary keys (like reviews/_id) can't be overwritten.
    const allowedFields = [
      "title",
      "shortDescription",
      "purpose",
      "fullDescription",
      "category",
      "hours",
      "techStack",
      "images",
      "liveLink",
      "githubLink",
      "linkedinLink",
      "featured",
    ] as const;

    const updateFields: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateFields[field] = body[field];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    await projectsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    const updatedProject = await projectsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Project updated", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove a project. Admin-only.
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const projectsCollection = db.collection("projectscollection");
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid or missing Project ID" }, { status: 400 });
    }

    const adminCheck = await requireAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json(
        { success: false, message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    await projectsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}