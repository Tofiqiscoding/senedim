import { Suspense } from "react";
import { WorkersList } from "../../screens/workers";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorkersList />
    </Suspense>
  );
}
