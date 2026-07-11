import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";
import { ObjectId } from "mongodb";

interface Review {
  userId: string;
  userName: string;
  userImage: string | null;
  comment: string;
  rating: number;
  createdAt: Date;
}

// GET: Fetch All Projects OR Single Project based on Query Parameter
export async function GET(req: NextRequest) {
  try {
    const projectsCollection = db.collection("projectscollection");

    // URL theke query parameter 'id' ber kora (jemon: /api/projects?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // ১. Jodi URL-e kono ID thake, tahole single project fetch korbe
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: "Invalid Project ID" }, { status: 400 });
      }

      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

      if (!project) {
        return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, project });
    }

    // ২. Jodi URL-e kono ID NA thake (jemon shudhu /api/projects), tahole sob project array hisebe pathabe
    const projects = await projectsCollection.find({}).toArray();
    return NextResponse.json({ success: true, projects });

  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add Comment and Rating (Apnar ager dynamic id parameterer jaygay URL searchParams hobe)
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid or missing Project ID" }, { status: 400 });
    }

    // Authenticate the user using better-auth
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { comment, rating } = body;

    if (!comment?.trim() || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Valid comment and rating (1-5) are required." }, { status: 400 });
    }

    const projectsCollection = db.collection("projectscollection");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    // New review object
    const newReview: Review = {
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      comment: comment.trim(),
      rating: Number(rating),
      createdAt: new Date(),
    };

    const currentReviews: Review[] = project.reviews || [];
    const updatedReviews = [...currentReviews, newReview];

    const totalRating = updatedReviews.reduce((sum: number, rev: Review) => sum + rev.rating, 0);
    const averageRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    // Update MongoDB Document
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

    return NextResponse.json({
      success: true,
      message: "Review added successfully",
      reviews: updatedReviews,
      averageRating,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}