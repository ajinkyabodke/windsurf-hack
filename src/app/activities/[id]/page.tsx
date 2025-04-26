import { ActivityDetails } from "./ActivityDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityPage({ params }: PageProps) {
  const { id } = await params;
  return <ActivityDetails id={id} />;
}
