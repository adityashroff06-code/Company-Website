export const SITE = {
  name: "Product Armor Packaging Pvt Ltd",
  shortName: "Product Armor",
  domain: "https://productarmor.com",
  tagline: "Controlled Variables, Specified Outcomes",
  description:
    "Product Armor Packaging Pvt Ltd manufactures ISO 9001:2015 certified pharmaceutical-grade HDPE bottles, child-resistant (CR) caps and continuous thread (CT) caps for regulated markets across India, USA, Europe, the Middle East and Asia.",
  founded: "2018",
} as const;

export const CONTACT = {
  phone: "+91 90592 74553",
  email: "mail@productarmor.com",
  address:
    "Survey No. 157, Nallavally Village & Mandal, Gummadidala, Telangana 502313, India",
  whatsapp: "+919059274553",
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
      { href: "/quality", label: "Quality & Certifications" },
      { href: "/case-studies", label: "Case Studies" },
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
