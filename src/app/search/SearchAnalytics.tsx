"use client";

import Link from "next/link";
import React from "react";
import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

type SearchAnalyticsProps = {
  query: string;
  hasResults: boolean;
};

export function SearchAnalytics({ query, hasResults }: SearchAnalyticsProps) {
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || lastTracked.current === trimmed) {
      return;
    }

    lastTracked.current = trimmed;
    track("search_query", {
      query: trimmed,
      hasResults,
    });
  }, [query, hasResults]);

  return null;
}

type TrackedSearchLinkProps = {
  href: string;
  query: string;
  label: string;
  kind: "project" | "product" | "category" | "suggestion" | "other";
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

export function TrackedSearchLink({
  href,
  query,
  label,
  kind,
  className,
  ariaLabel,
  children,
}: TrackedSearchLinkProps) {
  const handleClick = () => {
    const trimmed = query.trim();
    track("search_result_click", {
      query: trimmed || "empty",
      href,
      kind,
      label,
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
