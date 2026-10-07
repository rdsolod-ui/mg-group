export const site = {
  url: "https://marketing.parkskazka.ru/mg-group/",
  name: "MG Group",
  title: "MG Group | هندسة وتشغيل مدن الملاهي | Amusement Park Engineering",
  description:
    "هندسة وتركيب وتشغيل مدن الملاهي في روسيا وعُمان. MG Group: amusement park engineering, installation and operations, backed by 10 engineers and 54 mechanics.",
  socialTitle: "MG Group | نبني مدن الملاهي ونشغّلها | We build parks. We keep them running.",
  image: "social/mg-group-og-v2.jpg",
  imageAlt:
    "MG Group — نبني مدن الملاهي. ونشغّلها. We build parks. We keep them running. Generated concept illustration of an amusement park with an observation wheel.",
} as const;

const orgId = `${site.url}#organization`;
const websiteId = `${site.url}#website`;
const imageId = `${site.url}#primaryimage`;
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      alternateName: "مجموعة إم جي",
      url: site.url,
      description: site.description,
      logo: { "@type": "ImageObject", url: `${site.url}icons/logo-512.png`, width: 512, height: 512 },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Осенняя улица, 23",
        addressLocality: "Москва",
        addressCountry: "RU",
      },
      areaServed: [
        { "@type": "Country", name: "Russia" },
        { "@type": "Country", name: "Oman" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        name: "Khalid — Oman contact",
        contactType: "business enquiries",
        telephone: "+96896100010",
        url: "https://wa.me/96896100010",
        areaServed: "OM",
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: site.name,
      url: site.url,
      inLanguage: ["ar", "en"],
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}#webpage`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: ["ar", "en"],
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
      primaryImageOfPage: { "@id": imageId },
    },
    {
      "@type": "ImageObject",
      "@id": imageId,
      contentUrl: `${site.url}${site.image}`,
      url: `${site.url}${site.image}`,
      width: 1200,
      height: 630,
      caption: site.imageAlt,
      description: "Generated concept illustration, not a photograph of a completed MG Group project.",
    },
    ...[
      ["development", "Amusement park development", "lifecycle"],
      ["engineering", "Attraction engineering and installation", "engineering"],
      ["commissioning", "Amusement park commissioning and launch", "lifecycle"],
      ["operations", "Technical maintenance and park operations", "specialists"],
    ].map(([id, name, fragment]) => ({
      "@type": "Service",
      "@id": `${site.url}#service-${id}`,
      name,
      serviceType: name,
      url: `${site.url}#${fragment}`,
      provider: { "@id": orgId },
      areaServed: ["Russia", "Oman"],
    })),
  ],
};
