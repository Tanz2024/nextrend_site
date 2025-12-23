// src/app/dealers/data.ts

export type DealerContact = {
  label: string;
  value: string;
  href: string;
};

export type Dealer = {
  name: string;
  city: string;
  address: string[];
  contacts?: DealerContact[];

  /** used for filtering only (not displayed as chips) */
  contactTypes?: string[];

  /** display hours as stacked lines */
  hours?: string[];

  /** can be a Google Maps link OR a plain destination string */
  mapHref?: string;
};

export type DealerRegion = {
  id: string;
  title: string;
  coverage: string;
  summary: string;
  dealers: Dealer[];
};

export const dealerRegions: DealerRegion[] = [
  {
    id: "malaysia",
    title: "Malaysia",
    coverage: "Klang Valley • Petaling Jaya • Kota Kinabalu",
    summary:
      "Find authorized Nextrend dealers for K-array, Brionvega, and BE@RBRICK AUDIO across Malaysia — from curated retail to specialist system partners.",
    dealers: [
      {
        name: "Forest Furniture",
        city: "Bangsar, Kuala Lumpur",
        address: [
          "No. 265 & 267, Jalan Maarof, Bangsar",
          "59100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
          "Malaysia",
        ],
        contactTypes: ["Brionvega Reseller"],
        hours: ["Mon–Fri 10:30–19:00", "Sat 10:30–18:30", "Sun 10:30–18:30"],
        contacts: [
          { label: "Phone", value: "+60 17 887 0783", href: "tel:+60178870783" },
          {
            label: "Email",
            value: "marketing@forestfurniture.com.my",
            href: "mailto:marketing@forestfurniture.com.my",
          },
          {
            label: "Website",
            value: "forestfurniture.com.my",
            href: "https://forestfurniture.com.my/",
          },
        ],
        mapHref:
          "https://maps.google.com/?q=No.+265+%26+267,+Jalan+Maarof,+Bangsar,+59100+Kuala+Lumpur,+Wilayah+Persekutuan+Kuala+Lumpur",
      },

      {
        name: "ProAV",
        city: "Alam Damai, Kuala Lumpur",
        address: [
          "60, Jalan Damai Raya 1, Alam Damai",
          "56000 Kuala Lumpur",
          "Malaysia",
        ],
        contactTypes: ["K-array Reseller"],
        contacts: [
          { label: "Phone", value: "+603 9107 7333", href: "tel:+60391077333" },
          { label: "Email", value: "info@proav.my", href: "mailto:info@proav.my" },
          { label: "Website", value: "proav.my", href: "https://www.proav.my/" },
        ],
        mapHref:
          "https://maps.google.com/?q=60,+Jalan+Damai+Raya+1,+Alam+Damai,+56000+Kuala+Lumpur,+Malaysia",
      },

      {
        name: "Tekni Furniture",
        city: "Petaling Jaya, Selangor",
        address: [
          "20, Jln Profesor Diraja Ungku Aziz, PJS 12",
          "46200 Petaling Jaya, Selangor",
          "Malaysia",
        ],
        contactTypes: ["K-array Reseller"],
        hours: ["Mon–Sat 10:30–19:00"],
        contacts: [
          { label: "Phone", value: "+603 7931 2289", href: "tel:+60379312289" },
          { label: "Website", value: "tekni.com.my", href: "https://tekni.com.my/" },
        ],
        mapHref:
          "https://maps.google.com/?q=20,+Jln+Profesor+Diraja+Ungku+Aziz,+PJS+12,+46200+Petaling+Jaya,+Selangor,+Malaysia",
      },

      {
        name: "Radiotronic Sdn Bhd",
        city: "Kota Kinabalu, Sabah",
        address: [
          "Radiotronic HQ (Office, Logistics, Service)",
          "Lot 15, Ground Floor, Lorong Pokok Kayu Manis Block D, Damai Plaza",
          "88300 Kota Kinabalu, Sabah, Malaysia",
        ],
        contactTypes: ["K-array Reseller"],
        hours: ["Mon–Sat 08:30–17:00"],
        contacts: [
          { label: "Phone", value: "+6016-230 4399", href: "tel:+60162304399" },
          {
            label: "Email",
            value: "ivanbydeal@gmail.com",
            href: "mailto:ivanbydeal@gmail.com",
          },
          {
            label: "Website",
            value: "radiotronic.com.my",
            href: "https://www.radiotronic.com.my/",
          },
        ],
        mapHref:
          "https://maps.google.com/?q=Lot+15,+Ground+Floor,+Lorong+Pokok+Kayu+Manis+Block+D,+Damai+Plaza,+88300+Kota+Kinabalu,+Sabah,+Malaysia",
      },

      {
        name: "CROSSOVER — The Exchange TRX",
        city: "Tun Razak Exchange, Kuala Lumpur",
        address: [
          "Lot L2.66-2.68, The Exchange TRX",
          "Persiaran TRX, Tun Razak Exchange",
          "Kuala Lumpur, Malaysia",
        ],
        contactTypes: ["BE@RBRICK AUDIO Reseller"],
        hours: ["Mon–Sun 10:00–22:00"],
        contacts: [
          { label: "Phone", value: "+603 3010 3143", href: "tel:+60330103143" },
          {
            label: "Website",
            value: "crossoverconceptstore.com",
            href: "https://crossoverconceptstore.com/",
          },
        ],
        mapHref:
          "https://maps.google.com/?q=Lot%20L2.66-2.68%2C%20The%20Exchange%20TRX%2C%20Persiaran%20TRX%2C%20Tun%20Razak%20Exchange%2C%20Kuala%20Lumpur%2C%20Malaysia",
      },
    ],
  },

  {
    id: "singapore",
    title: "Singapore",
    coverage: "Bayfront • Central",
    summary:
      "Authorized BE@RBRICK AUDIO partners across Singapore — design-led retail that brings collectible audio objects into everyday spaces.",
    dealers: [
      {
        name: "METAPOD",
        city: "Sin Ming, Singapore",
        address: ["159 Sin Ming Road", "#04-02 Amtech Building", "Singapore 575625"],
        contactTypes: ["BE@RBRICK AUDIO Reseller"],
        hours: ["Mon–Fri 09:30–18:00", "Sat–Sun Closed", "Public Holidays Closed"],
        contacts: [
          { label: "Email", value: "hello@metapod.com", href: "mailto:hello@metapod.com" },
          { label: "Website", value: "metapod.com", href: "https://metapod.com/" },
        ],
        mapHref:
          "https://maps.google.com/?q=159%20Sin%20Ming%20Road%20%2304-02%20Amtech%20Building%20Singapore%20575625",
      },

      {
        name: "ActionCity",
        city: "Bayfront, Singapore",
        address: ["2 Bayfront Ave", "#B2-87", "Singapore"],
        contactTypes: ["BE@RBRICK AUDIO Reseller"],
        hours: ["Sun–Thu 10:30–22:00", "Fri–Sat 10:30–22:30"],
        contacts: [
          { label: "Phone", value: "+65 6688 7012", href: "tel:+6566887012" },
          { label: "Website", value: "actioncity.com.sg", href: "https://www.actioncity.com.sg/" },
        ],
        mapHref:
          "https://maps.google.com/?q=ActionCity%20The%20Shoppes%20at%20Marina%20Bay%20Sands%20B2-87%20Singapore",
      },

      {
        name: "Club 21",
        city: "Bayfront, Singapore",
        address: ["2 Bayfront Ave", " Singapore 018955"],
        contactTypes: ["BE@RBRICK AUDIO Reseller"],
        hours: ["Sun–Thu 10:30–22:30", "Fri–Sat 10:30–23:00"],
        contacts: [
          
          { label: "Phone", value: "+65 8121 3759", href: "tel:+6581213759" },
          { label: "Website", value: "club21.com", href: "https://club21.com/" },
        ],
        mapHref:
          "https://maps.google.com/?q=Club%2021%20The%20Shoppes%20at%20Marina%20Bay%20Sands%20Singapore",
      },
    ],
  },
];
