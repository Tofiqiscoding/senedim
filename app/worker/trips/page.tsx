import { redirect } from "next/navigation";

// merged into the single Requests page
export default function Page() {
  redirect("/worker/requests?type=trip");
}
