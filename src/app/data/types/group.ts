export interface Group {
  id: number;
  name: string;
  code: string;
  ownerId: number;
  memberIds: number[];
}
