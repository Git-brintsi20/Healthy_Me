export interface MythSource {
  title: string;
  authors?: string;
  publication: string;
  year: number;
  url: string;
  summary: string;
}

export interface MythData {
  question?: string;
  verdict: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE";
  explanation: string;
  keyPoints: string[];
  sources: MythSource[];
  recommendation: string;
}

export interface MythDocument extends MythData {
  mythId: string;
  askedBy: string;
  askedAt: any;
  upvotes: number;
  downvotes: number;
  views: number;
}


