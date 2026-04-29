import {
  LayoutDashboard,
  Users,
  Layers,
  ShieldAlert,
  FileText,
  LifeBuoy,
  PlusCircle,
  Settings,
  Building2,
  Globe,
  MapPin,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { ElementType } from "react";

export interface MenuItem {
  icon: ElementType;
  label: string;
  href: string;
  badge?: string;
  expandable?: boolean;
  children?: { label: string; href: string; icon?: ElementType }[];
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    title: "Main Dashboard",
    items: [{ icon: LayoutDashboard, label: "Overview", href: "/" }],
  },
  {
    title: "Content & Insights",
    items: [
      {
        icon: FileText,
        label: "Legal Insights",
        href: "/insights",
        expandable: true,
        children: [
          { label: "Management", href: "/insights", icon: Settings },
          { label: "Add New Post", href: "/insights/new", icon: PlusCircle },
        ],
      },
      { icon: Layers, label: "Insights Categories", href: "/categories" },
      { icon: ImageIcon, label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "CRM & Resources",
    items: [
      {
        icon: Users,
        label: "Our Clients",
        href: "/clients",
        expandable: true,
        children: [
          { label: "Management", href: "/clients", icon: Settings },
          { label: "Clientele", href: "/clients/clientele", icon: Building2 },
          {
            label: "Jurisdictions",
            href: "/clients/jurisdictions",
            icon: Globe,
          },
          { label: "We Serve", href: "/clients/we-serve", icon: Users },
        ],
      },
      { icon: Users, label: "Team & Lawyers", href: "/team" },
    ],
  },
  {
    title: "Firm Presentation",
    items: [
      { label: "Who We Are", href: "/about-us/who-we-are", icon: Info },
      {
        icon: LifeBuoy,
        label: "Support Desk",
        href: "/support",
        expandable: true,
        children: [
          { label: "Overview", href: "/support", icon: Settings },
          {
            label: "Contact Locations",
            href: "/support/contact-locations",
            icon: MapPin,
          },
        ],
      },
    ],
  },
  {
    title: "Security & Access",
    items: [
      { icon: ShieldAlert, label: "Roles & Permissions", href: "/roles" },
    ],
  },
];
