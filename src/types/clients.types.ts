
export interface Client {
  _id: string;
  name: string;
  websiteUrl: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteleStat {
  value: string;
  label: string;
}

export interface ClienteleValues {
  title: string;
  subtitle: string;
  stats: [ClienteleStat, ClienteleStat, ClienteleStat, ClienteleStat];
}

export interface JurisdictionsValues {
  title: string;
  subtitle: string;
  countries: string[];
}

export interface ClienteleApiData {
  _id?: string;
  title?: string;
  subtitle?: string;
  stat1Title?: string;
  stat1Value?: string;
  stat2Title?: string;
  stat2Value?: string;
  stat3Title?: string;
  stat3Value?: string;
  stat4Title?: string;
  stat4Value?: string;
  stat4Label?: string; // Sometimes label/title naming varies
}

export interface ClientelePayload {
  title: string;
  subtitle: string;
  stat1Title: string;
  stat1Value: string;
  stat2Title: string;
  stat2Value: string;
  stat3Title: string;
  stat3Value: string;
  stat4Title: string;
  stat4Value: string;
}

// --- We Serve ---

export interface WeServeCard {
  title: string;
  description: string;
  iconName: string;
}

export interface WeServeValues {
  title: string;
  subtitle: string;
  cards: WeServeCard[];
}

export interface WeServeApiData {
  _id?: string;
  title?: string;
  subtitle?: string;
  
  card1Title?: string;
  card1Description?: string;
  card1IconName?: string;
  
  card2Title?: string;
  card2Description?: string;
  card2IconName?: string;
  
  card3Title?: string;
  card3Description?: string;
  card3IconName?: string;
  
  card4Title?: string;
  card4Description?: string;
  card4IconName?: string;
  
  card5Title?: string;
  card5Description?: string;
  card5IconName?: string;
  
  card6Title?: string;
  card6Description?: string;
  card6IconName?: string;
  
  card7Title?: string;
  card7Description?: string;
  card7IconName?: string;
  
  card8Title?: string;
  card8Description?: string;
  card8IconName?: string;

  createdAt?: string;
  updatedAt?: string;
}
