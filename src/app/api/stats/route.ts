import { NextResponse } from "next/server";
import { db } from "@/lib/auth";

export async function GET() {
  try {
    const projectsCollection = db.collection("projectscollection");
    const projects = await projectsCollection.find({}).toArray();

    const totalProjects = projects.length;

    // ইউনিক ক্যাটাগরি কাউন্টের জন্য
    const categoriesSet = new Set<string>();
    const techCounts: Record<string, number> = {};
    
    const ratingBreakdown = { 
      "1 Star": 0, 
      "2 Star": 0, 
      "3 Star": 0, 
      "4 Star": 0, 
      "5 Star": 0 
    };

    // যে টেকনোলজিগুলো আমরা চার্টে দেখাতে চাই না (সব প্রজেক্টেই কমন থাকে)
    const excludedTech = new Set([
      "html", "html5", "css", "css3", "tailwind", "tailwind css", "tailwind_css"
    ]);

    projects.forEach((project) => {
      // ক্যাটাগরি প্রসেস
      if (project && typeof project.category === "string" && project.category.trim() !== "") {
        categoriesSet.add(project.category.toLowerCase().trim());
      }

      // টেক স্ট্যাক প্রসেস (HTML, CSS ও Tailwind ফিল্টার সহ)
      if (project && Array.isArray(project.techStack)) {
        project.techStack.forEach((tech: string) => {
          if (tech && typeof tech === "string") {
            const formattedTech = tech.trim();
            const lowerTech = formattedTech.toLowerCase();
            
            // যদি টেকনোলজিটি আমাদের এক্সক্লুড লিস্টে না থাকে, তবেই কাউন্ট হবে
            if (!excludedTech.has(lowerTech)) {
              techCounts[formattedTech] = (techCounts[formattedTech] || 0) + 1;
            }
          }
        });
      }

      // ১ থেকে ৫ স্টার রিভিউ এর কাউন্ট
      if (project && Array.isArray(project.reviews)) {
        project.reviews.forEach((review: any) => {
          if (review && review.rating !== undefined) {
            const rating = Number(review.rating);
            if (rating === 1) ratingBreakdown["1 Star"]++;
            else if (rating === 2) ratingBreakdown["2 Star"]++;
            else if (rating === 3) ratingBreakdown["3 Star"]++;
            else if (rating === 4) ratingBreakdown["4 Star"]++;
            else if (rating === 5) ratingBreakdown["5 Star"]++;
          }
        });
      }
    });

    // সর্ট করে টপ ৩ টেকনোলজি সিলেক্ট
    const top3Tech = Object.keys(techCounts)
      .map((name) => ({ name, count: techCounts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const ratingData = Object.keys(ratingBreakdown).map((key) => ({
      stars: key,
      count: ratingBreakdown[key as keyof typeof ratingBreakdown]
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        totalCategories: categoriesSet.size,
        top3Tech,
        ratingData
      }
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}