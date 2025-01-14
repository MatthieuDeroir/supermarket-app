import { Hono } from "./deps.ts";
import UserRoutes from "./modules/users/user.routes.ts";
import AddressesRoutes from "./modules/addresses/address.routes.ts";


const app = new Hono();

app.get("/v1", (c) => c.text("Hello Deno!"));
app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/users", UserRoutes);
app.route("/addresses", AddressesRoutes);

Deno.serve({ port: 4000 }, app.fetch);
