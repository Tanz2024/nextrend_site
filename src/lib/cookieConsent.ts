export type ConsentStatus = "accepted" | "rejected";

const STORAGE_KEY = "nextrend-cookie-consent-v1";
const AUTO_SHOW_KEY = "nextrend-cookie-consent-seen-v1";

export type ConsentRecord = {
  status: ConsentStatus;
  updatedAt: string;
  essential: true;
  analytics: boolean;
};

const listeners = new Set<(consent: ConsentRecord | null) => void>();

function safeWindow() {
  return typeof window === "undefined" ? null : window;
}

export function getConsentRecord(): ConsentRecord | null {
  const win = safeWindow();
  if (!win) {
    return null;
  }

  const raw = win.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

export function shouldAutoShowBanner(): boolean {
  const win = safeWindow();
  if (!win) {
    return false;
  }

  if (getConsentRecord()) {
    return false;
  }

  return win.localStorage.getItem(AUTO_SHOW_KEY) !== "true";
}

export function markAutoShowSeen() {
  const win = safeWindow();
  if (!win) {
    return;
  }

  win.localStorage.setItem(AUTO_SHOW_KEY, "true");
}

export function resetAutoShowFlag() {
  const win = safeWindow();
  if (!win) {
    return;
  }

  win.localStorage.removeItem(AUTO_SHOW_KEY);
}

function notifyConsentChange(consent: ConsentRecord | null) {
  listeners.forEach((listener) => listener(consent));
}

export function storeConsentChoice(status: ConsentStatus) {
  const consent: ConsentRecord = {
    status,
    updatedAt: new Date().toISOString(),
    essential: true,
    analytics: status === "accepted",
  };

  const win = safeWindow();
  if (win) {
    try {
      win.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* noop */
    }

    win.localStorage.setItem(AUTO_SHOW_KEY, "true");
  }

  notifyConsentChange(consent);
  return consent;
}

export function subscribeToConsentChanges(listener: (consent: ConsentRecord | null) => void) {
  listeners.add(listener);
  listener(getConsentRecord());
  return () => listeners.delete(listener);
}
