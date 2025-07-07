// app/sitemap.ts

import { MetadataRoute } from 'next';
import { db, COLLECTIONS } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthyme.app';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/myths`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic myth pages
    const mythsRef = collection(db, COLLECTIONS.MYTHS);
    const mythsQuery = query(
      mythsRef,
      where('verified', '==', true),
      limit(1000) // Limit to prevent excessive sitemap size
    );
    
    const mythsSnapshot = await getDocs(mythsQuery);
    const mythPages: MetadataRoute.Sitemap = mythsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${baseUrl}/myths/${doc.id}`,
        lastModified: data.updatedAt?.toDate().toISOString() || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    // Dynamic nutrition pages (if you have individual nutrition fact pages)
    const nutritionRef = collection(db, COLLECTIONS.NUTRITION_FACTS);
    const nutritionQuery = query(
      nutritionRef,
      where('verified', '==', true),
      limit(500) // Limit to prevent excessive sitemap size
    );
    
    const nutritionSnapshot = await getDocs(nutritionQuery);
    const nutritionPages: MetadataRoute.Sitemap = nutritionSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${baseUrl}/nutrition/${doc.id}`,
        lastModified: data.updatedAt?.toDate().toISOString() || currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });

    // Category pages for myths
    const mythCategories = [
      'Weight Loss',
      'Macronutrients',
      'Vitamins',
      'Supplements',
      'Diet Plans',
      'Exercise',
      'Metabolism'
    ];

    const categoryPages: MetadataRoute.Sitemap = mythCategories.map(category => ({
      url: `${baseUrl}/myths/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      ...staticPages,
      ...mythPages,
      ...nutritionPages,
      ...categoryPages
    ];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if Firebase query fails
    return staticPages;
  }
}