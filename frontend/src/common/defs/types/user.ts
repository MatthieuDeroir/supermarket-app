import { ID } from '@common/defs/types/id';

// modules/users/user.model.ts
export interface User {
  user_id: ID;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  role_id: number;
}

// export interface User {
//   id: ID;
//   name: string;
//   email: string;
//   role?: ROLE[];
//   Permissions?: Permission[];
//   avatarUrl?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export enum ROLE {
//   ADMIN = 'admin',
//   USER = 'user',
// }

// export interface Permission {
//   entity: string;
//   action: string;
//   entityId?: ID;
// }
