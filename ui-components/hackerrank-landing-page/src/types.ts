export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface FeatureCard {
  title: string;
  subtitle: string;
  bullets: string[];
  buttonText: string;
  tag: string;
  badgeType: 'developer' | 'business';
}

export interface TabItem {
  id: string;
  title: string;
  description: string;
  subtext: string;
}
