import { notFound } from "next/navigation";

import { EVENT_DETAILS, getEventDetail, getEventSummary } from "../data";
import { EventDetailView } from "./EventDetailView";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(EVENT_DETAILS).map((slug) => ({ slug }));
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = getEventDetail(slug);

  if (!detail) {
    notFound();
  }

  const summary = getEventSummary(slug);

  return <EventDetailView detail={detail} summary={summary} />;
}

