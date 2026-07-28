export const SITE = {
  name: "Product Armor Packaging Pvt Ltd",
  shortName: "Product Armor",
  domain: "https://productarmor.com",
  tagline: "Controlled Variables, Specified Outcomes",
  description:
    "Product Armor Packaging Pvt Ltd manufactures ISO 9001:2015 & ISO 15378 certified, ISO Class 8 cleanroom-manufactured pharmaceutical-grade HDPE bottles, child-resistant (CR) caps and continuous thread (CT) caps for regulated markets across India, USA, Europe, the Middle East and Asia.",
  founded: "2020",
} as const;

export const CONTACT = {
  phone: "+91-9154992473",
  email: "mail@productarmor.com",
  address:
    "Survey No. 157, Nallavally Village & Mandal, Gummadidala, Telangana 502313, India",
  whatsapp: "+919154992473",
} as const;

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/company/product-armor",
  mapLink: "https://maps.app.goo.gl/xMArFcAfSQvnqVdS7",
  mapEmbed:
    "https://www.google.com/maps?q=Survey%20No.%20157%2C%20Nallavally%2C%20Gummadidala%2C%20Telangana%20502313&output=embed",
} as const;

export type NavItem = { href: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const MEGA_NAV: NavGroup[] = [
  {
    label: "Solutions",
    items: [
      { href: "/products", label: "Products" },
      { href: "/industries", label: "Industries" },
      { href: "/applications", label: "Applications" },
      { href: "/technology", label: "Technology" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/about", label: "About Us" },
      { href: "/management-team", label: "Management Team" },
      { href: "/quality", label: "Quality & Certifications" },
      { href: "/career", label: "Careers" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/downloads", label: "Downloads" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
];
