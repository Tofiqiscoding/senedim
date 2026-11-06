import { Suspense } from "react";
import Shell from "../shared/Shell";

export const metadata = { title: "HR – senedim" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Shell role="hr">{children}</Shell>
    </Suspense>
  );
}
