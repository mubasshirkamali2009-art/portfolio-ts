import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/auth"; // Using your exact auth configuration paths

// GET: Fetch all projects from the database
export async function GET(req: NextRequest) {
  try {
    // Access your target collection from MongoDB
    const projectsCollection = db.collection("projectscollection");

    // Fetch all documents from the collection as an array
    const projects = await projectsCollection.find({}).toArray();

    return NextResponse.json(
      { 
        success: true, 
        projects 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching all projects:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal Server Error", 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}

// POST: Add a completely new project to your portfolio
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user via better-auth session headers
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." }, 
        { status: 401 }
      );
    }

    // 2. Parse incoming JSON body from the frontend form
    const body = await req.json();
    const { 
      title, 
      liveLink, 
      githubLink, 
      linkedinLink, 
      techStack, 
      category, 
      date, 
      hours, 
      shortDescription, 
      purpose, 
      fullDescription, 
      images 
    } = body;

    // 3. Simple backend validation check for required fields
    if (!title || !shortDescription || !fullDescription) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (Title, Short Description, or Full Description)." }, 
        { status: 400 }
      );
    }

    // 4. Construct the new project document structure
    const newProject = {
      title,
      liveLink: liveLink || "",
      githubLink: githubLink || "",
      linkedinLink: linkedinLink || "",
      techStack: Array.isArray(techStack) ? techStack : [],
      category: category || "web",
      date: date ? new Date(date) : new Date(),
      hours: Number(hours) || 0,
      shortDescription,
      purpose: purpose || "",
      fullDescription,
      images: Array.isArray(images) ? images : [],
      reviews: [], // Default empty array for incoming ratings
      averageRating: 0,
      reviewCount: 0,
      userId: session.user.id, // Tracks which user added it
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 5. Save the document into MongoDB
    const projectsCollection = db.collection("projectscollection");
    const result = await projectsCollection.insertOne(newProject);

    return NextResponse.json(
      { 
        success: true, 
        message: "Project created successfully!", 
        projectId: result.insertedId 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal Server Error", 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}