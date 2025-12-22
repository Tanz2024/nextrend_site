"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { getConsentRecord, subscribeToConsentChanges } from "@/lib/cookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
const HOTJAR_SV = process.env.NEXT_PUBLIC_HOTJAR_SV;

function useAnalyticsConsent() {
  const [allowed, setAllowed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return Boolean(getConsentRecord()?.analytics);
  });

  useEffect(() => {
    const unsubscribe = subscribeToConsentChanges((consent) => {
      setAllowed(Boolean(consent?.analytics));
    });
    return unsubscribe;
  }, []);

  return allowed;
}

export function ConsentAwareScripts() {
  const analyticsAllowed = useAnalyticsConsent();

  if (!analyticsAllowed) {
    return null;
  }

  return (
    <>
      {GA_ID && (
        <>
          <Script
            key="gtag-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <>
          <Script
            key="fb-events"
            strategy="afterInteractive"
            src="https://connect.facebook.net/en_US/fbevents.js"
          />
          <Script id="fb-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){
  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
        </>
      )}

      {TIKTOK_PIXEL_ID && (
        <>
          <Script
            key="ttq-script"
            strategy="afterInteractive"
            src={`https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${TIKTOK_PIXEL_ID}&lib=ttq`}
          />
          <Script id="ttq-init" strategy="afterInteractive">
            {`!function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  var ttq = w[t] = w[t] || [];
  ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
  ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
  for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
  ttq.instance = ttq.instance || function () { return ttq };
  ttq.load = function (e, n) { ttq.push(["load", e, n || {}]) };
  ttq.page();
}(window, document, "ttq");
ttq.load("${TIKTOK_PIXEL_ID}");
ttq.page();`}
          </Script>
        </>
      )}

      {HOTJAR_ID && HOTJAR_SV && (
        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){
  h.hj = h.hj || function(){(h.hj.q = h.hj.q || []).push(arguments)};
  h._hjSettings = {hjid:${HOTJAR_ID}, hjsv:${HOTJAR_SV}};
  a = o.getElementsByTagName("head")[0];
  r = o.createElement("script"); r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");`}
        </Script>
      )}

      <Analytics />
    </>
  );
}
