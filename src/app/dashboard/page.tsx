import { Suspense } from "react";
import DashboardContent from "./Content";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
