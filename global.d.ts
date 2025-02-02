// global.d.ts (ou hono.d.ts, etc.)
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}