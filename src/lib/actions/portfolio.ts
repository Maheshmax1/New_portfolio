"use server";

import { prisma } from "../db";
import { verifySession, createSession, deleteSession, verifyPassword } from "../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PortfolioData } from "@/types";

// --- AUTH ACTIONS ---

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter email and password" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid credentials" };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Invalid credentials" };
    }

    await createSession(user.id, user.email);
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  await deleteSession();
  redirect("/admin/login");
}

// --- PORTFOLIO FETCH ACTIONS ---

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    // Singletons
    let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "singleton", websiteName: "My Portfolio CMS" },
      });
    }

    let hero = await prisma.hero.findUnique({ where: { id: "singleton" } });
    if (!hero) {
      hero = await prisma.hero.create({
        data: { id: "singleton", description: "Default Description" },
      });
    }

    let about = await prisma.about.findUnique({ where: { id: "singleton" } });
    if (!about) {
      about = await prisma.about.create({
        data: { id: "singleton" },
      });
    }

    let contact = await prisma.contactDetails.findUnique({ where: { id: "singleton" } });
    if (!contact) {
      contact = await prisma.contactDetails.create({
        data: { id: "singleton" },
      });
    }

    // CRUD lists
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    const skills = await prisma.skill.findMany({ orderBy: { percentage: "desc" } });
    const projects = await prisma.project.findMany({});
    const whyChooseMe = await prisma.whyChooseMe.findMany({});
    const workProcess = await prisma.workProcess.findMany({ orderBy: { order: "asc" } });
    const testimonials = await prisma.testimonial.findMany({});
    const achievements = await prisma.achievement.findMany({});
    const pricingPlans = await prisma.pricingPlan.findMany({});
    const faqs = await prisma.fAQ.findMany({});
    const blogs = await prisma.blogPost.findMany({ orderBy: { date: "desc" } });

    return {
      settings,
      hero,
      about,
      services,
      skills,
      projects,
      whyChooseMe,
      workProcess,
      testimonials,
      achievements,
      pricingPlans,
      faqs,
      blogs,
      contact,
    };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    throw new Error("Could not load portfolio data.");
  }
}

// --- SINGLETON UPDATE ACTIONS ---

async function checkAuth() {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized access. Please login.");
  }
}

export async function updateSiteSettings(data: any) {
  await checkAuth();
  const result = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/settings");
  return result;
}

export async function updateHero(data: any) {
  await checkAuth();
  const result = await prisma.hero.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/hero");
  return result;
}

export async function updateAbout(data: any) {
  await checkAuth();
  const result = await prisma.about.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/about");
  return result;
}

export async function updateContact(data: any) {
  await checkAuth();
  const result = await prisma.contactDetails.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/contact");
  return result;
}

// --- CRUD LIST ACTIONS ---

// Services
export async function saveService(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.service.update({ where: { id }, data });
  } else {
    result = await prisma.service.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return result;
}

export async function deleteService(id: string) {
  await checkAuth();
  const result = await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return result;
}

// Skills
export async function saveSkill(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.skill.update({ where: { id }, data });
  } else {
    result = await prisma.skill.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/skills");
  return result;
}

export async function deleteSkill(id: string) {
  await checkAuth();
  const result = await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/skills");
  return result;
}

// Projects
export async function saveProject(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.project.update({ where: { id }, data });
  } else {
    result = await prisma.project.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/projects");
  return result;
}

export async function deleteProject(id: string) {
  await checkAuth();
  const result = await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/projects");
  return result;
}

// Why Choose Me
export async function saveWhyChooseMe(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.whyChooseMe.update({ where: { id }, data });
  } else {
    result = await prisma.whyChooseMe.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

export async function deleteWhyChooseMe(id: string) {
  await checkAuth();
  const result = await prisma.whyChooseMe.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

// Work Process
export async function saveWorkProcess(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.workProcess.update({ where: { id }, data });
  } else {
    result = await prisma.workProcess.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

export async function deleteWorkProcess(id: string) {
  await checkAuth();
  const result = await prisma.workProcess.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

// Testimonials
export async function saveTestimonial(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.testimonial.update({ where: { id }, data });
  } else {
    result = await prisma.testimonial.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
  return result;
}

export async function deleteTestimonial(id: string) {
  await checkAuth();
  const result = await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
  return result;
}

// Achievements
export async function saveAchievement(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.achievement.update({ where: { id }, data });
  } else {
    result = await prisma.achievement.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

export async function deleteAchievement(id: string) {
  await checkAuth();
  const result = await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return result;
}

// Pricing Plans
export async function savePricingPlan(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.pricingPlan.update({ where: { id }, data });
  } else {
    result = await prisma.pricingPlan.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/pricing");
  return result;
}

export async function deletePricingPlan(id: string) {
  await checkAuth();
  const result = await prisma.pricingPlan.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/pricing");
  return result;
}

// FAQs
export async function saveFAQ(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.fAQ.update({ where: { id }, data });
  } else {
    result = await prisma.fAQ.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/faq");
  return result;
}

export async function deleteFAQ(id: string) {
  await checkAuth();
  const result = await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/faq");
  return result;
}

// Blog Posts
export async function saveBlogPost(id: string | null, data: any) {
  await checkAuth();
  let result;
  if (id) {
    result = await prisma.blogPost.update({ where: { id }, data });
  } else {
    result = await prisma.blogPost.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard/blog");
  return result;
}

export async function deleteBlogPost(id: string) {
  await checkAuth();
  const result = await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/blog");
  return result;
}

// Theme Apply Action
export async function applyTheme(themeSlug: string) {
  await checkAuth();
  const result = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { selectedTheme: themeSlug },
    create: { id: "singleton", selectedTheme: themeSlug },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard/themes");
  return result;
}
