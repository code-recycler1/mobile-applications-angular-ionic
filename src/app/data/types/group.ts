export interface Group {
  id?: string;
  name: string;
  street: string;
  city: string;
  code: string;
  ownerId: string;
  memberIds?: string[];
}
