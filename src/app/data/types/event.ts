import {Timestamp} from '@angular/fire/firestore';

export interface Event {
  id?: string;
  home?: string;
  away?: string;
  address?: string;
  type: string;
  date: Timestamp;
  yes?: string[];
  maybe: string[];
  no?: string[];
}
