import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { categoryPath, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: categoryPath("tecnologia"),
  },
};

/** Home aponta para a categoria padrão indexável. */
export default function HomePage() {
  permanentRedirect(categoryPath("tecnologia"));
}
