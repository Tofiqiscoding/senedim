import { Suspense } from "react";
import { WorkerRequests } from "../../screens/requests";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorkerRequests />
    </Suspense>
  );
}
