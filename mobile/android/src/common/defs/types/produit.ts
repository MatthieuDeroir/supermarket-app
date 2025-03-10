import { ID } from '@common/defs/types/id';

export interface Product {
  product_id: ID;
  ean: string;
  name: string;
  brand: string;
  description: string;
  picture: string;
  nutritional_information: string;
  price: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
  minimum_stock: number;
  minimum_shelf_stock: number;
  category_id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
