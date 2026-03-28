import { readPageSections, readPages, type ManagedPage, type PageSectionBlock } from "@/lib/cms-store";

export type ManagedPageContent = {
  page: ManagedPage | null;
  sections: PageSectionBlock[];
};

export async function readManagedPageContent(pageKey: string): Promise<ManagedPageContent> {
  const [pages, sections] = await Promise.all([readPages(), readPageSections()]);
  const page = pages.find((entry) => entry.pageKey === pageKey) || null;
  const scopedSections = sections
    .filter((section) => {
      if (!section.visible) return false;
      if (page) return section.pageId === page.id || section.pageKey === page.pageKey;
      return section.pageKey === pageKey;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return { page, sections: scopedSections };
}

export function isPageLive(page: ManagedPage | null) {
  if (!page) return true;
  return page.isPublished && page.isVisible;
}
