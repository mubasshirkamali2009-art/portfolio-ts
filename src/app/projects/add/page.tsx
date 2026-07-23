import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AddProjectForm from "@/components/AddProjectForm";

// Server component: runs before any HTML is sent, so a signed-out
// visitor never sees a flash of the form before being redirected.
export default async function AddProjectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Only allow non-"user" roles (e.g. "admin") to add projects.
  // Regular users get sent back to the home page.
  if (session.user.role === "user") {
    redirect("/");
  }

  return <AddProjectForm />;
}