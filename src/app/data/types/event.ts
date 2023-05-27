export interface Event {
  id?: number;
  home?: string;
  away?: string;
  address?: string;
  type: string;
  date: string;
    yes?: string[];
    maybe: string[];
    no?: string[];
}
