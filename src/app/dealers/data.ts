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
  contactTypes?: string[];
  tier?: string;
  hours?: string;
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
    coverage: "Klang Valley • Petaling Jaya",
    summary:
      "Brionvega reseller network and system partners across the Klang Valley.",
    dealers: [
      {
        name: "Forest Furniture — Brionvega Reseller",
        city: "Bangsar, Kuala Lumpur",
        address: [
          "No. 265 & 267, Jalan Maarof, Bangsar",
          "59100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
          "Malaysia",
        ],
        tier: "Authorized Reseller",
        contactTypes: ["Brionvega Reseller"],
        hours: "Mon–Fri 10:30–19:00 · Sat 10:30–18:30 · Sun 10:30–18:30",
        contacts: [
          {
            label: "Phone",
            value: "+60 17 887 0783",
            href: "tel:+60178870783",
          },
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
        name: "ProAV — Sound System Reseller",
        city: "Alam Damai, Kuala Lumpur",
        address: [
          "60, Jalan Damai Raya 1, Alam Damai",
          "56000 Kuala Lumpur",
          "Malaysia",
        ],
        tier: "Integration Partner",
        contactTypes: ["Sound System Reseller"],
        contacts: [
          { label: "Phone", value: "+603 9107 7333", href: "tel:+60391077333" },
          { label: "Email", value: "info@proav.my", href: "mailto:info@proav.my" },
          { label: "Website", value: "proav.my", href: "https://www.proav.my/" },
        ],
        mapHref:
          "https://maps.google.com/?q=60,+Jalan+Damai+Raya+1,+Alam+Damai,+56000+Kuala+Lumpur,+Malaysia",
      },
      {
        name: "Tekni Furniture — Sound System Reseller",
        city: "Petaling Jaya, Selangor",
        address: [
          "20, Jln Profesor Diraja Ungku Aziz, PJS 12",
          "46200 Petaling Jaya, Selangor",
          "Malaysia",
        ],
        tier: "Retail Partner",
        contactTypes: ["Sound System Reseller"],
        hours: "Mon–Sat 10:30–19:00",
        contacts: [
          { label: "Phone", value: "+603 7931 2289", href: "tel:+60379312289" },
          { label: "Website", value: "tekni.com.my", href: "https://tekni.com.my/" },
        ],
        mapHref:
          "https://maps.google.com/?q=20,+Jln+Profesor+Diraja+Ungku+Aziz,+PJS+12,+46200+Petaling+Jaya,+Selangor,+Malaysia",
      },

     
{
  name: "Radiotronic Sdn Bhd — Sound System Reseller",
  city: "Kota Kinabalu, Sabah",
  address: [
    "Radiotronic HQ (Office, Logistics, Service)",
    "Lot 15, Ground Floor, Lorong Pokok Kayu Manis Block D, Damai Plaza",
    "88300 Kota Kinabalu, Sabah, Malaysia",
  ],
  tier: "Sound System Reseller",
  contactTypes: ["Sound System Reseller"],
  hours: "Mon–Sat 08:30–17:00",
  contacts: [
    {
      label: "Phone",
      value: "+6016-230 4399",
      href: "tel:+60162304399",
    },
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
}
,

    ],
  },
];
