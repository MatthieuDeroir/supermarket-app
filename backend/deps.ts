// deps.ts

// === Hono ===
export { Hono } from "https://deno.land/x/hono@v3.3.2/mod.ts";
export type { Context, Handler } from "https://deno.land/x/hono@v3.3.2/mod.ts";


// === PostgreSQL (deno-postgres) ===
export { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
export type { PoolClient } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// === Deno STD libs ===
export * as log from "https://deno.land/std@0.190.0/log/mod.ts";
export { load as loadEnv } from "https://deno.land/std@0.190.0/dotenv/mod.ts";
export { parse } from "https://deno.land/std@0.190.0/flags/mod.ts";

// === Bcrypt ===
export {
    hash as bcryptHash,
    compare as bcryptCompare,
    genSalt as bcryptGenSalt,
    genSaltSync as bcryptGenSaltSync
} from "https://esm.sh/bcrypt-ts@5.0.3";


// === JWT ===
export {
    decode,
    sign,
    verify
} from "hono/jwt.ts";




