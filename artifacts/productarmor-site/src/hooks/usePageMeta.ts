import { useEffect } from "react";
import { SITE } from "@/constants/site";

type PageMeta = {
  title: string;
  description?: string;
  path?: string;
};

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets the document title and core SEO meta tags for a page.
 * Runs client-side so each route gets its own title, description and canonical URL.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE.shortName}`;
    const desc = description ?? SITE.description;
    const canonical = SITE.domain + (path ?? "");

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setCanonical(canonical);
    window.scrollTo(0, 0);
  }, [title, description, path]);
}
