import { ID } from '@common/defs/types/id';

export interface User {
  id: ID;
  name: string;
  email: string;
  role?: ROLE[];
  Permissions?: Permission[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Permission {
  entity: string;
  action: string;
  entityId?: ID;
}
