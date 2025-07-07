// src/app/loading.tsx
import { PageLoader } from "@/components/common/loading-spinner";

/**
 * This is the global loading UI for the entire application.
 * Next.js will automatically wrap page layouts with a Suspense boundary
 * and display this component during page transitions and initial server-side data fetching.
 */
export default function Loading() {
  // You can add any UI you want here, like a skeleton screen or a progress bar.
  // For now, we'll use the full-page loader component we created earlier.
  return <PageLoader />;
}