import Image from 'next/image';
import { journalProjects, type JournalProject } from '../data/journalProjects';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JournalPageClient from './JournalPageClient';

// Generate static params for all journal projects
export async function generateStaticParams() {
  return journalProjects.map((project) => ({
    slug: project.slug,
  }));
}

interface JournalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalPage({ params }: JournalPageProps) {
  const { slug } = await params;
  
  // Find the current project on the server
  const currentProject = journalProjects.find((p) => p.slug === slug);
  
  // If project not found, trigger 404
  if (!currentProject) {
    notFound();
  }
  
  // Get related projects
  const relatedProjects = currentProject.relatedProjects
    ? journalProjects.filter((p) => currentProject.relatedProjects!.includes(p.slug))
    : journalProjects.filter((p) => p.slug !== currentProject.slug).slice(0, 2);

  return (
    <JournalPageClient 
      currentProject={currentProject} 
      relatedProjects={relatedProjects} 
    />
  );
}
