// app/components/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nextrend-cookie-consent-v1";

type ConsentStatus = "accepted" | "rejected";

declare global {
  interface Window {
    nextrendOpenCookiePanel?: () => void;
  }
}

const COOKIE_CATEGORIES = [
  { id: "privacy", label: "Your Privacy", required: true },
  { id: "necessary", label: "Strictly Necessary Cookies", required: true },
  { id: "performance", label: "Performance Cookies" },
  { id: "functional", label: "Functional Cookies" },
  { id: "targeting", label: "Targeting Cookies" },
  { id: "chat", label: "Chat Cookies" },
] as const;

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  privacy:
    "When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience.",
  necessary:
    "Strictly necessary cookies are essential for the site to function. They keep sessions alive, help with security, and allow the interface to behave consistently across pages.",
  performance:
    "Performance cookies help us understand how visitors use the site. They collect anonymous statistics that let us improve speed and reliability without identifying you personally.",
  functional:
    "Functional cookies remember choices you make, like language or region, so the site feels bespoke across visits without logging you in explicitly.",
  targeting:
    "Targeting cookies help us tailor Nextrend communications to your interests. They may record which pages or case studies you view so we can share more relevant projects, events, or updates.",
  chat:
    "Chat cookies keep the context of conversations about your project, so our team can follow your enquiry and respond more smoothly when you return to the site.",
};

type CategoryState = Record<string, boolean>;

const defaultCategoryState: CategoryState = COOKIE_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = true;
    return acc;
  },
  {} as CategoryState
);

// one place for the champagne tone
const CHAMPAGNE = "#cfa96c";

export function CookieBanner() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selection, setSelection] = useState<ConsentStatus>("accepted");
  const [initialSelection, setInitialSelection] =
    useState<ConsentStatus>("accepted");
  const [hasStoredChoice, setHasStoredChoice] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    COOKIE_CATEGORIES[0].id
  );
  const [categoryStates, setCategoryStates] =
    useState<CategoryState>(defaultCategoryState);

  /* ------------------- load stored choice on mount ------------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setBannerVisible(true);
        setSelection("accepted");
        setInitialSelection("accepted");
        setHasStoredChoice(false);
        setCategoryStates(defaultCategoryState);
        return;
      }

      const parsed = JSON.parse(raw) as {
        status?: ConsentStatus;
        categories?: CategoryState;
      } | null;

      const storedStatus: ConsentStatus =
        parsed?.status === "rejected" ? "rejected" : "accepted";

      setSelection(storedStatus);
      setInitialSelection(storedStatus);
      setHasStoredChoice(true);
      setBannerVisible(false);

      if (parsed?.categories) {
        setCategoryStates({
          ...defaultCategoryState,
          ...parsed.categories,
        });
      }
    } catch {
      setBannerVisible(true);
      setSelection("accepted");
      setInitialSelection("accepted");
      setHasStoredChoice(false);
      setCategoryStates(defaultCategoryState);
    }
  }, []);

  /* ------------------ global opener from footer/icon ----------------- */
  useEffect(() => {
    window.nextrendOpenCookiePanel = () => {
      setPanelOpen(true);
      setBannerVisible(false);
    };
    return () => {
      delete window.nextrendOpenCookiePanel;
    };
  }, []);

  /* ---------------------- lock body scroll --------------------------- */
  useEffect(() => {
    if (!panelOpen) return;

    const body = document.body;
    const html = document.documentElement;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
    };
  }, [panelOpen]);

  /* -------------------------- helpers -------------------------------- */

  const persistChoice = (
    status: ConsentStatus,
    overrideCategories?: CategoryState
  ) => {
    const categoriesToStore = overrideCategories ?? categoryStates;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status,
          updatedAt: new Date().toISOString(),
          categories: categoriesToStore,
          essential: true,
          analytics: status === "accepted",
        })
      );
    } catch {
      // ignore storage errors
    }
    setSelection(status);
    setInitialSelection(status);
    setHasStoredChoice(true);
    setBannerVisible(false);
    setPanelOpen(false);
  };

  const savePreferences = () => {
    persistChoice(selection);
  };

  // “only important cookies keep for our website”
  const acceptOnlyTechnicalCookies = () => {
    const technicalOnly: CategoryState = {};
    COOKIE_CATEGORIES.forEach((cat) => {
      // keep only required categories (privacy + strictly necessary)
      technicalOnly[cat.id] = !!cat.required;
    });
    setCategoryStates(technicalOnly);
    persistChoice("rejected", technicalOnly);
  };

  const closePanel = () => {
    setSelection(initialSelection);
    setPanelOpen(false);
    if (!hasStoredChoice) {
      setBannerVisible(true);
    }
  };

  const toggleCategory = (id: string) => {
    const category = COOKIE_CATEGORIES.find((c) => c.id === id);
    if (category?.required) return;

    setCategoryStates((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const anyOptionalOff = COOKIE_CATEGORIES.some(
        (c) => !c.required && !next[c.id]
      );
      setSelection(anyOptionalOff ? "rejected" : "accepted");
      return next;
    });
  };

  const openSettingsPanel = () => {
    setPanelOpen(true);
    setBannerVisible(false);
  };

  /* ---------------------------- banner ------------------------------- */

  return (
    <>
      {/* bottom bar banner */}
      {bannerVisible && (
        <>
          {/* ---------- MOBILE ---------- */}
          <div
            className="fixed inset-x-0 bottom-0 z-[115] sm:hidden"
            aria-live="polite"
          >
            <div className="w-full border-t border-[#e3dacd] bg-white px-4 py-4 text-[#111]">
              <p className="text-[0.8rem] leading-snug">
                In addition to the cookies that are strictly necessary for the
                operation of this website, Nextrend uses cookies and other
                tracking tools to remember your preferences, to propose services
                relevant to your projects, to measure our website performance,
                and to improve our understanding of how visitors use our
                content.
              </p>
              <p className="mt-2 text-[0.8rem] leading-snug">
                You can click on &quot;Accept all cookies&quot; to consent to
                these uses or click on &quot;Cookie Settings&quot; to configure
                your choices. You may change your preferences, or withdraw your
                consent, on this website at any moment.
              </p>
              <p className="mt-2 text-[0.8rem] leading-snug">
                For more information about these technologies and their use on
                this website, please consult our{" "}
                <a
                  href="/privacy"
                  className="underline decoration-[#c9a56f] decoration-2 underline-offset-4"
                >
                  Cookie Policy
                </a>
                .
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={openSettingsPanel}
                  className="rounded-full border border-[#d2c7b3] bg-transparent px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-[#1f1911]"
                >
                  Cookie Settings
                </button>
                <button
                  type="button"
                  onClick={() => persistChoice("accepted")}
                  className="rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1e1204]"
                  style={{
                    background: `linear-gradient(120deg,#fff9ef 0%,#f5e0c7 45%,${CHAMPAGNE} 100%)`,
                    boxShadow: "0 12px 30px rgba(53,36,18,0.35)",
                  }}
                >
                  Accept all cookies
                </button>
              </div>
            </div>
          </div>

          {/* ---------- DESKTOP / TABLET ---------- */}
          <div
            className="fixed inset-x-0 bottom-0 z-[115] hidden sm:block"
            aria-live="polite"
          >
            <div className="w-full border-t border-[#e3dacd] bg-white px-6 py-5 text-[#111] sm:px-10 sm:py-6">
              <p className="text-[0.92rem] leading-relaxed">
                In addition to the cookies that are strictly necessary for the
                operation of this website, Nextrend uses cookies and other
                tracking tools to remember your preferences, to propose services
                relevant to your projects, to measure our website performance,
                and to improve our understanding of how visitors use our
                content.
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed">
                You can click on &quot;Accept all cookies&quot; to consent to
                these uses or click on &quot;Cookie Settings&quot; to configure
                your choices. You may change your preferences, or withdraw your
                consent, on this website at any moment.
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed">
                For more information about these technologies and their use on
                this website, please consult our{" "}
                <a
                  href="/privacy"
                  className="underline decoration-[#c9a56f] decoration-2 underline-offset-4"
                >
                  Cookie Policy
                </a>
                .
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={openSettingsPanel}
                  className="rounded-full border border-[#d2c7b3] bg-transparent px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-[#1f1911]"
                >
                  Cookie Settings
                </button>
                <button
                  type="button"
                  onClick={() => persistChoice("accepted")}
                  className="rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1e1204]"
                  style={{
                    background: `linear-gradient(120deg,#fff9ef 0%,#f5e0c7 45%,${CHAMPAGNE} 100%)`,
                    boxShadow: "0 18px 40px rgba(53,36,18,0.35)",
                  }}
                >
                  Accept all cookies
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --------------------------- panel ---------------------------- */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-[rgba(0,0,0,0.55)] px-4 pt-10 pb-0 sm:px-8"
          aria-live="polite"
          onClick={closePanel}
        >
          <div
            className="relative flex w-full max-w-5xl max-h-[calc(100vh-40px)] flex-col overflow-hidden border border-[#d4d4d4] bg-white text-[#111] shadow-2xl rounded-t-[14px] sm:rounded-none"
            onClick={(event) => event.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4">
              <div className="flex-1" />
              <h2 className="flex-1 text-center text-[15px] font-semibold text-[#111]">
                Privacy Preference Center
              </h2>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close preferences panel"
                className="flex-1 text-right text-xl text-[#333]"
              >
                ×
              </button>
            </div>

            {/* body */}
            <div className="flex min-h-[260px] flex-1 overflow-y-auto flex-col sm:flex-row">
              {/* left rail */}
              <div className="w-full border-b border-[#d4d4d4] bg-[#f7f7f7] sm:w-[260px] sm:border-b-0 sm:border-r">
                <ul>
                  {COOKIE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={[
                            "flex w-full items-center justify-between border-b border-[#d4d4d4] px-5 py-3 text-left text-[13px] transition-colors",
                            isActive
                              ? "bg-white font-semibold text-[#111]"
                              : "bg-[#f7f7f7] text-[#333]",
                          ].join(" ")}
                        >
                          <span>{cat.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* right content */}
              <div className="flex-1 px-4 py-4 sm:px-8 sm:py-6">
                {(() => {
                  const current = COOKIE_CATEGORIES.find(
                    (c) => c.id === activeCategory
                  )!;
                  const isRequired = !!current.required;
                  const isOn = categoryStates[current.id];

                  return (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold text-[#cfa96c]">
                          {current.label}
                        </h3>

                        {isRequired ? (
                          <span className="text-[11px] uppercase tracking-[0.16em] text-[#777]">
                            Always active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleCategory(current.id)}
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#555]"
                            aria-pressed={isOn}
                          >
                            <span>{isOn ? "On" : "Off"}</span>
                            <span
                              className={[
                                "inline-flex h-5 w-9 items-center rounded-full p-[2px] transition-colors",
                                isOn ? "bg-[#cfa96c]" : "bg-[#ccc]",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                  isOn ? "translate-x-4" : "translate-x-0",
                                ].join(" ")}
                              />
                            </span>
                          </button>
                        )}
                      </div>

                      <p className="text-[13px] leading-relaxed text-[#333]">
                        {CATEGORY_DESCRIPTIONS[current.id]}
                      </p>

                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777]">
                        Cookies details
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
                        Below you can confirm your choices for each cookie
                        category. Your preferences will be stored on this device
                        and you can revisit this panel at any time.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* footer */}
            <div className="flex flex-col gap-3 border-t border-[#d4d4d4] px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#777]">
                Essential cookies stay active to keep the experience secure.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="rounded-[3px] border border-[#cfa96c] bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111] transition-colors hover:bg-[#cfa96c] hover:text-white"
                >
                  Confirm my choices
                </button>
                <button
                  type="button"
                  onClick={acceptOnlyTechnicalCookies}
                  className="rounded-[3px] border border-[#cfa96c] bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111] transition-colors hover:bg-[#cfa96c] hover:text-white"
                >
                  Accept only technical cookies
                </button>
                <button
                  type="button"
                  onClick={() => persistChoice("accepted")}
                  className="rounded-[3px] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1e1204]"
                  style={{
                    background: `linear-gradient(120deg,#fff9ef 0%,#f5e0c7 45%,${CHAMPAGNE} 100%)`,
                    boxShadow: "0 18px 40px rgba(53,36,18,0.35)",
                  }}
                >
                  Allow all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
