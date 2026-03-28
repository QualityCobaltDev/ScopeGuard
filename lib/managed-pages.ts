import type { ManagedPage } from "@/lib/cms-store";

export type SystemManagedPageDefinition = {
  id: string;
  title: string;
  internalName: string;
  slug: string;
  pageKey: string;
  pageType: ManagedPage["pageType"];
  seoTitle: string;
  seoDescription: string;
  showInNavigation: boolean;
  sortOrder: number;
};

export const SYSTEM_MANAGED_PAGES: SystemManagedPageDefinition[] = [
  {
    id: "page-home",
    title: "Home",
    internalName: "Homepage",
    slug: "",
    pageKey: "home",
    pageType: "landing",
    seoTitle: "ScopeGuard - Freelancer Protection Systems",
    seoDescription: "Protect every client engagement with ScopeGuard systems.",
    showInNavigation: true,
    sortOrder: 1
  },
  {
    id: "page-product",
    title: "Product",
    internalName: "Product",
    slug: "product",
    pageKey: "product",
    pageType: "standard",
    seoTitle: "Product",
    seoDescription: "Explore Elevare AI deliverables, pricing tiers, and premium growth features.",
    showInNavigation: true,
    sortOrder: 2
  },
  {
    id: "page-resources",
    title: "Resources",
    internalName: "Resources",
    slug: "resources",
    pageKey: "resources",
    pageType: "resource",
    seoTitle: "ScopeGuard Resources",
    seoDescription: "Guides, worksheets, and templates for freelancers.",
    showInNavigation: true,
    sortOrder: 3
  },
  {
    id: "page-about",
    title: "About",
    internalName: "About",
    slug: "about",
    pageKey: "about",
    pageType: "standard",
    seoTitle: "About",
    seoDescription: "Why Elevare AI exists and how it helps digital product operators scale premium offers.",
    showInNavigation: true,
    sortOrder: 4
  },
  {
    id: "page-contact",
    title: "Contact",
    internalName: "Contact",
    slug: "contact",
    pageKey: "contact",
    pageType: "standard",
    seoTitle: "Contact",
    seoDescription: "Contact ScopeGuard for product and support inquiries.",
    showInNavigation: true,
    sortOrder: 5
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    internalName: "Privacy Policy",
    slug: "privacy",
    pageKey: "privacy",
    pageType: "legal",
    seoTitle: "Privacy Policy",
    seoDescription: "ScopeGuard privacy policy.",
    showInNavigation: false,
    sortOrder: 6
  },
  {
    id: "page-refund-policy",
    title: "Refund Policy",
    internalName: "Refund Policy",
    slug: "refund-policy",
    pageKey: "refund-policy",
    pageType: "legal",
    seoTitle: "Refund Policy",
    seoDescription: "ScopeGuard digital resource refund policy.",
    showInNavigation: false,
    sortOrder: 7
  },
  {
    id: "page-terms",
    title: "Terms",
    internalName: "Terms",
    slug: "terms",
    pageKey: "terms",
    pageType: "legal",
    seoTitle: "Terms",
    seoDescription: "ScopeGuard terms and conditions.",
    showInNavigation: false,
    sortOrder: 8
  }
];
