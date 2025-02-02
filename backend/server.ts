import { Hono } from 'hono';
import { cors } from 'hono/cors';
import db from './config/database.ts'; // Fichier de connexion
import routes from './modules/routes.ts';
import { config } from './deps.ts';
import getEnv from './utils/getEnv.ts';


config();

const app = new Hono();

app.use(
  '/*',
  cors({
    origin: getEnv('FRONT_URL'),
    maxAge: 600,
    credentials: true,
  })
);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.get('/', (c) => c.json({ message: 'dab' }));

// Connexion DB
await db.connect();

// Monte toutes les routes
app.route('/', routes);

Deno.serve({ port: 4000 }, app.fetch);
