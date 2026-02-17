import db from "./db"
import { cache } from "react"

export const getTeamMembers = cache(async () => {
  try {
    return await db.teamMember.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    })
  } catch (e) {
    return [
      { id: '1', name: 'Ashok Kumar', roleTitle: 'Managing Director', bio: '30+ years of expertise in wealth management.', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
      { id: '2', name: 'S. K. Sharma', roleTitle: 'Sr. Insurance Consultant', bio: 'Expert in risk management and claim settlement.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    ]
  }
})

export const getGalleryItems = cache(async () => {
  try {
    return await db.galleryItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    })
  } catch (e) {
    return [
      { id: '1', title: 'Excellence Award 2023', category: 'Awards', url: 'https://images.unsplash.com/photo-1578574515313-ad9929c2a230?auto=format&fit=crop&q=80&w=600' },
      { id: '2', title: 'Corporate Event', category: 'Events', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600' },
    ]
  }
})

export const getPosts = cache(async () => {
  try {
    return await db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    console.error("Database error in getPosts:", e)
    return [
      { id: '1', title: 'The Future of Mutual Funds in 2026', slug: 'future-mutual-funds', excerpt: 'Deep dive into market trends...', createdAt: new Date(), coverUrl: 'https://images.unsplash.com/photo-1611974717537-48358a60d374?auto=format&fit=crop&q=80&w=800' },
    ]
  }
})

export const getResources = cache(async () => {
  try {
    return await db.resource.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    return [
      { id: '1', title: '2026 Tax Planning Guide', slug: 'tax-guide-2026', description: 'Comprehensive guide to saving tax...', coverUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600' },
    ]
  }
})

export const getSiteSettings = cache(async () => {
  try {
    const settings = await db.siteSettings.findFirst()
    if (settings) return settings
    
    return {
      yearsExperience: "30+",
      clientsCount: "5000+",
      aum: "600+",
      claimSettlement: "99.1%",
      awardsCount: "200+",
      showStats: true
    }
  } catch (e) {
    return {
      yearsExperience: "30+",
      clientsCount: "5000+",
      aum: "600+",
      claimSettlement: "99.1%",
      awardsCount: "200+",
      showStats: true
    }
  }
})
