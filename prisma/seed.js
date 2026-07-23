const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.user.deleteMany({});
  await prisma.siteSettings.deleteMany({});
  await prisma.hero.deleteMany({});
  await prisma.about.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.whyChooseMe.deleteMany({});
  await prisma.workProcess.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.pricingPlan.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.contactDetails.deleteMany({});

  // 1. Create Default Admin User (Password: admin123)
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@portfolio.com",
      password: hashedPassword,
      name: "Alex Rivers",
    },
  });
  console.log("Admin user created:", admin.email);

  // 2. Create Site Settings
  const settings = await prisma.siteSettings.create({
    data: {
      id: "singleton",
      websiteName: "Alex Rivers | Creative Portfolio",
      metaTitle: "Alex Rivers | Lead Interactive Developer & Designer",
      metaDescription: "Welcome to my creative space. I build interactive web designs with Next.js, Framer Motion, and GSAP.",
      themeColor: "#3b82f6",
      selectedTheme: "apple",
      darkMode: true,
      analyticsId: "UA-123456789-1",
    },
  });

  // 3. Create Hero Section
  await prisma.hero.create({
    data: {
      id: "singleton",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80",
      backgroundImage: "",
      backgroundVideo: "",
      name: "Alex Rivers",
      role: "Lead Interactive Developer",
      tagline: "Sculpting immersive digital experiences through code & design.",
      description: "I am a design-minded developer specializing in high-performance web applications, fluid layouts, and polished animations.",
      resumeUrl: "#",
      hireMeUrl: "#",
      typingWords: "Creative Developer,UI/UX Designer,Next.js Expert",
    },
  });

  // 4. Create About Section
  await prisma.about.create({
    data: {
      id: "singleton",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80",
      description: "I bridge the gap between complex engineering and aesthetic design. Over the last 6 years, I have worked with creative agencies, startups, and enterprise clients to ship fast, accessible, and delightful digital products.",
      experienceYears: 6,
      education: "B.S. in Computer Science - Stanford University",
      mission: "To empower modern brands with state-of-the-art web performance and visual excellence that commands attention.",
      vision: "To set the benchmark for user-centric interaction design and micro-animated digital products.",
      cvUrl: "#",
    },
  });

  // 5. Create Services
  await prisma.service.createMany({
    data: [
      {
        title: "Frontend Engineering",
        description: "Pixel-perfect implementation of layouts in Next.js, Tailwind, and React with extreme attention to responsiveness and SEO.",
        icon: "Code",
        order: 1,
        status: true,
      },
      {
        title: "Creative Animations",
        description: "Adding life to applications using Framer Motion, GSAP, scroll-driven interactions, and interactive 3D elements.",
        icon: "Sparkles",
        order: 2,
        status: true,
      },
      {
        title: "UI/UX Design",
        description: "Designing interface assets, wireframes, and design systems in Figma geared towards conversions and ease of use.",
        icon: "Layout",
        order: 3,
        status: true,
      },
      {
        title: "Performance Optimization",
        description: "Auditing, refactoring, and optimizing websites to achieve perfect 100/100 Core Web Vitals scores and faster load times.",
        icon: "Zap",
        order: 4,
        status: true,
      },
    ],
  });

  // 6. Create Skills
  await prisma.skill.createMany({
    data: [
      { name: "Next.js / React", percentage: 95, category: "Frontend", color: "#000000" },
      { name: "TypeScript", percentage: 90, category: "Frontend", color: "#3178c6" },
      { name: "Tailwind CSS", percentage: 98, category: "Frontend", color: "#38bdf8" },
      { name: "Framer Motion", percentage: 88, category: "Design", color: "#ff007f" },
      { name: "GSAP / Canvas", percentage: 80, category: "Design", color: "#88ce02" },
      { name: "Node.js / Express", percentage: 85, category: "Backend", color: "#339933" },
      { name: "Prisma / PostgreSQL", percentage: 82, category: "Backend", color: "#2d3748" },
    ],
  });

  // 7. Create Projects
  await prisma.project.createMany({
    data: [
      {
        title: "Nova E-Commerce Portal",
        description: "A highly immersive and animated premium e-commerce design showing interactive product reviews, dynamic filters, and lightning-fast checkout.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80"
        ]),
        technologies: "Next.js, Tailwind CSS, Framer Motion, Stripe",
        features: "Immersive 3D product renders\nInstant dynamic filters\nFully integrated stripe payment gateway",
        category: "E-Commerce",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        client: "Nova Corp",
        completionDate: "Dec 2025",
      },
      {
        title: "Aura Creative Space",
        description: "A digital portfolio and social community platform built specifically for designers and digital artists to share high-fidelity mockups.",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        gallery: "[]",
        technologies: "React, GSAP, Express, MongoDB",
        features: "Drag and drop responsive editor\nLive community feedback boards\nWebSockets instant messenger integration",
        category: "Creative Site",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        client: "Aura Labs",
        completionDate: "Sep 2025",
      },
      {
        title: "Apex Analytics Engine",
        description: "A professional business analytics tool presenting beautiful dashboard graphics, lazy-loading widgets, and automated report exports.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        gallery: "[]",
        technologies: "Next.js, ChartJS, Prisma, PostgreSQL",
        features: "Custom widget configuration dashboard\nAuto-export to PDF/CSV weekly\nReal-time user event tracking tracking",
        category: "SaaS Application",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        client: "Apex SaaS LLC",
        completionDate: "Jun 2025",
      },
    ],
  });

  // 8. Create Why Choose Me
  await prisma.whyChooseMe.createMany({
    data: [
      { icon: "Shield", title: "Industry Experience", description: "Over 6 years of coding and product development for global clients." },
      { icon: "Clock", title: "Prompt Communication", description: "Daily reports, agile feedback loops, and highly responsive workflows." },
      { icon: "TrendingUp", title: "Performance Driven", description: "I don't just build, I optimize. High lighthouse scores guaranteed." },
    ],
  });

  // 9. Create Work Process
  await prisma.workProcess.createMany({
    data: [
      { icon: "Search", title: "1. Research & Discovery", description: "Aligning on goals, specifications, wireframes, and mood boards.", order: 1 },
      { icon: "PenTool", title: "2. Visual Layout & UI Design", description: "Crafting beautiful layouts in Figma with responsive grids.", order: 2 },
      { icon: "Code2", title: "3. Robust Coding", description: "Building the clean Next.js system with strict TypeScript and clean CSS.", order: 3 },
      { icon: "Sparkle", title: "4. Fine Animations & Polish", description: "Adding micro-interactions and performing stress tests on performance.", order: 4 },
      { icon: "Rocket", title: "5. Production Deployment", description: "Optimizing assets, SEO configuration, and launching live to Vercel.", order: 5 },
    ],
  });

  // 10. Create Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Sarah Jenkins",
        company: "Starlight Media",
        designation: "Marketing Director",
        rating: 5,
        review: "Working with Alex was a game-changer. The interactive portfolio they built for our product line drove a 35% increase in lead generation in the first month.",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        clientName: "David Kim",
        company: "Apex Platforms",
        designation: "Founder",
        rating: 5,
        review: "Alex is that rare developer who has a profound grasp of design. The animations they coded using Framer Motion are incredibly smooth and run perfectly.",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  });

  // 11. Create Achievements
  await prisma.achievement.createMany({
    data: [
      { icon: "CheckSquare", title: "Projects Completed", counter: 48 },
      { icon: "Users", title: "Happy Clients", counter: 25 },
      { icon: "Award", title: "Design Nominations", counter: 12 },
      { icon: "Coffee", title: "Cups of Espresso", counter: 800 },
    ],
  });

  // 12. Create Pricing Plans
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: "Introductory Project",
        price: "$1,500",
        features: "Single page custom portfolio\nNext.js & Tailwind responsive structure\nBasic contact form setup\n1 round of revisions",
        buttonText: "Consult Now",
        isPopular: false,
      },
      {
        name: "Creative Standard",
        price: "$3,200",
        features: "Up to 5 custom styled pages\nFull Framer Motion animations\nCMS Admin Dashboard integration\nCustom domain & SEO setups\n3 rounds of revisions",
        buttonText: "Hire Me",
        isPopular: true,
      },
      {
        name: "Agency Partner",
        price: "Custom",
        features: "Ongoing development support\nWeb3 / Immersive 3D features\nCustom backend databases\nDedicated Slack communications\nUnlimited modifications",
        buttonText: "Discuss Options",
        isPopular: false,
      },
    ],
  });

  // 13. Create FAQs
  await prisma.fAQ.createMany({
    data: [
      { question: "What is your main technology stack?", answer: "I build the vast majority of my projects using React, Next.js, TypeScript, Tailwind CSS, and Prisma ORM." },
      { question: "Do you offer web design services as well?", answer: "Yes, I design all my projects from scratch in Figma before writing any code, ensuring a cohesive design language." },
      { question: "How long does a standard portfolio take?", answer: "A single-page website takes about 7-10 days, while a fully custom site with an integrated dashboard takes 2-3 weeks." },
    ],
  });

  // 14. Create Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: "Mastering Next.js 15 Server Actions",
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        content: "Next.js 15 Server Actions offer a secure way to execute server-side functions directly from client components. In this guide, we dive deep into setup, security measures, form actions, state handling, and error logging.",
        category: "Web Development",
        tags: "Nextjs,React,WebDev",
        date: "Jul 10, 2026",
        seoTitle: "Mastering Next.js 15 Server Actions | Guide",
        seoDescription: "Learn how to build secure, robust server-side actions in Next.js 15 for forms and data operations.",
      },
      {
        title: "Creating High Performance Framer Motion Animations",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        content: "Animations can make or break a website's core metrics. Learn how to optimize Framer Motion components by using hardware acceleration, reducing layout shifts, utilizing layoutId, and limiting active component triggers.",
        category: "Animation",
        tags: "FramerMotion,CSS,Frontend",
        date: "Jun 24, 2026",
        seoTitle: "Creating High Performance Framer Motion Animations",
        seoDescription: "An in-depth article about optimization tricks for Framer Motion in Next.js apps.",
      },
    ],
  });

  // 15. Create Contact Details
  await prisma.contactDetails.create({
    data: {
      id: "singleton",
      phone: "+1 (555) 234-5678",
      email: "alex@riversdev.com",
      whatsapp: "+15552345678",
      address: "San Francisco, California, USA",
      mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098462!2d-122.50764019999999!3d37.757815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
