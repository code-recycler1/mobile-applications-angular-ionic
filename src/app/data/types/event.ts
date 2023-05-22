export interface Event {
  id: number;
  home: string;
  away?: string;
  date: string;
  type: string;
  yes?: string[];
  maybe: string[];
  no?: string[];
}
