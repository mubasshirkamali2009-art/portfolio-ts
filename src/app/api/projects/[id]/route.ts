import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: Promise<{ id: string }>; // Typed as a Promise
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