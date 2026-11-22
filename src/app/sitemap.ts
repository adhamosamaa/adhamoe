import type { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/data/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://adhamoe.vercel.app';
  
  const projects = await getPublishedProjects();
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/works/${project.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/works`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    ...projectPages,
  ];
}