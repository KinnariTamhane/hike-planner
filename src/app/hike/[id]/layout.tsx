import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Hike Details`,
    description: "Explore this amazing hiking trail",
  };
}

export default function HikeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
