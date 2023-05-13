export interface Group {
  _id: number;
  name: string;
  code: string;
  ownerId: number;
  memberIds: number[];
}
