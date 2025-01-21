// modules/roles/role.model.ts
export interface Role {
    [key: string]: unknown; // <= index signature
    roleId: number;
    name: string;
}
