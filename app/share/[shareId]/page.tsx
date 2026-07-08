import { SharedForge } from "@/features/forges/shared-forge";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  return <SharedForge shareId={shareId} />;
}
