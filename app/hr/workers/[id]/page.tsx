import { Suspense } from "react";
import { WorkerDetail } from "../../../screens/workers";

// Seed ids are prerendered; workers added at runtime render on demand.
export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: `w${i + 1}` }));
}

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={null}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Params }) {
  const { id } = await params;
  return <WorkerDetail id={id} />;
}
