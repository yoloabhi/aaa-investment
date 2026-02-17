import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Site Settings
  await prisma.siteSettings.create({
    data: {
      yearsExperience: "30+",
      clientsCount: "5000+",
      aum: "600+",
      claimSettlement: "99.1%",
      awardsCount: "200+",
      showStats: true,
    }
  })

  // 2. Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Founder Name",
        roleTitle: "Founder & CEO",
        bio: "Visionary leader with 30+ years in the industry.",
        photoUrl: "https://via.placeholder.com/400x400",
        order: 1
      },
      {
        name: "Senior Consultant",
        roleTitle: "Head of Investments",
        bio: "Expert in mutual funds and portfolio management.",
        photoUrl: "https://via.placeholder.com/400x400",
        order: 2
      },
      {
        name: "Operations Head",
        roleTitle: "Operations Manager",
        bio: "Ensuring smooth client service and claims processing.",
        photoUrl: "https://via.placeholder.com/400x400",
        order: 3
      }
    ]
  })

  // 3. Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      { title: "Award Ceremony 2023", category: "Awards", cloudinaryPublicId: "sample", url: "https://via.placeholder.com/600x400", published: true },
      { title: "Office Opening", category: "Events", cloudinaryPublicId: "sample", url: "https://via.placeholder.com/600x400", published: true },
      { title: "Client Meetup", category: "Events", cloudinaryPublicId: "sample", url: "https://via.placeholder.com/600x400", published: true },
    ]
  })

  // 4. Posts
  await prisma.post.create({
    data: {
      title: "Why Health Insurance is Critical in 2026",
      slug: "health-insurance-2026",
      excerpt: "Medical inflation is rising. Here is why you need adequate cover.",
      markdownContent: `
# Health Insurance in 2026

Healthcare costs are skyrocketing. **Medical inflation** is currently at 14%.

## Why you need it
1. Financial protection
2. Access to quality care
3. Tax benefits

> "Health is wealth, but insurance protects wealth."

Contact us to review your policy today.
      `,
      published: true,
      coverUrl: "https://via.placeholder.com/800x400"
    }
  })

  await prisma.post.create({
    data: {
      title: "Investment Strategies for High Net Worth Individuals",
      slug: "hni-investment-strategies",
      excerpt: "Tailored advice for growing and preserving substantial wealth.",
      markdownContent: `
# HNI Strategies

Preserving capital while beating inflation requires a **balanced approach**.

- **Equity**: Long term growth
- **Debt**: Stability
- **Gold**: Hedge

## Our Approach
We customize portfolios based on your *risk appetite* and *time horizon*.
      `,
      published: true,
      coverUrl: "https://via.placeholder.com/800x400"
    }
  })

  // 5. Resource (Lead Magnet)
  await prisma.resource.create({
    data: {
      title: "Ultimate Tax Saving Guide 2026",
      slug: "tax-saving-guide-2026",
      description: "Save up to ₹1.5 Lakhs under 80C and more with our comprehensive guide.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Placeholder PDF
      pdfCloudinaryPublicId: "sample-pdf",
      published: true,
      campaignTag: "tax-season"
    }
  })

  console.log('Seed data created.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
