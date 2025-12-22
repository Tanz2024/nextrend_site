import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { journalProjects } from "@/app/journal/data/journalProjects";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return journalProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = journalProjects.find((entry) => entry.slug === params.slug);

  if (!project) {
    return {
      title: "Journal Article",
      description: "Stories and studies from the Nextrend journal.",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default function BlogSlugRedirect({ params }: PageProps) {
  redirect(`/journal/${params.slug}`);
}
