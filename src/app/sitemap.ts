import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://adhamoe.vercel.app',
      lastModified: new Date(),
    },
  ]
}