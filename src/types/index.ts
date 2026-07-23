export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface SiteSettings {
  id: string;
  websiteName: string;
  logo: string | null;
  favicon: string | null;
  metaTitle: string;
  metaDescription: string;
  themeColor: string;
  selectedTheme: string;
  darkMode: boolean;
  analyticsId: string | null;
  customCss: string | null;
  customJs: string | null;
  updatedAt: Date;
}

export interface Hero {
  id: string;
  profileImage: string | null;
  backgroundImage: string | null;
  backgroundVideo: string | null;
  name: string;
  role: string;
  tagline: string;
  description: string;
  resumeUrl: string | null;
  hireMeUrl: string | null;
  typingWords: string;
}

export interface About {
  id: string;
  photo: string | null;
  description: string;
  experienceYears: number;
  education: string;
  mission: string;
  vision: string;
  cvUrl: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  status: boolean;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string; // JSON Array string
  technologies: string;
  features: string;
  category: string;
  githubUrl: string | null;
  liveUrl: string | null;
  client: string | null;
  completionDate: string | null;
}

export interface WhyChooseMe {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WorkProcess {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface Testimonial {
  id: string;
  photo: string | null;
  clientName: string;
  company: string | null;
  designation: string | null;
  rating: number;
  review: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  counter: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string;
  buttonText: string;
  isPopular: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  coverImage: string;
  content: string;
  category: string;
  tags: string;
  date: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface ContactDetails {
  id: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  mapIframe: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
}

export interface PortfolioData {
  settings: SiteSettings;
  hero: Hero;
  about: About;
  services: Service[];
  skills: Skill[];
  projects: Project[];
  whyChooseMe: WhyChooseMe[];
  workProcess: WorkProcess[];
  testimonials: Testimonial[];
  achievements: Achievement[];
  pricingPlans: PricingPlan[];
  faqs: FAQ[];
  blogs: BlogPost[];
  contact: ContactDetails;
}
