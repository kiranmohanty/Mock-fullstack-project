export interface Item {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface GridResponse {
  items: Item[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
