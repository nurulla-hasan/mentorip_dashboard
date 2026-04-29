export interface WhoWeAreStat {
  value: string;
  label: string;
}

export interface WhoWeAreValues {
  title: string;
  subtitle: string;
  stats: [WhoWeAreStat, WhoWeAreStat, WhoWeAreStat, WhoWeAreStat];
  imageFile?: File | null;
  imageAlt?: string;
}
