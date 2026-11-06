import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in – senedim" };

export default function Page() {
  return <LoginForm />;
}
