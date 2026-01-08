import { LucideIcon } from "lucide-react";

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  id: number;
  text: string;
  author: string;
  role: string;
  company: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}