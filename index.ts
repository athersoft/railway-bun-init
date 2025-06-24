import { Hono } from "hono@4";
import { cors } from "hono/cors";
import { serve } from "bun";
import mysql from "mysql2/promise";

const app = new Hono();
app.use("/*", cors()); // Permitir solicitudes CORS (desde GameMaker)

// Ruta GET simple
app.get("/", (c) => c.text("API corriendo correctamente"));

// Ruta POST para consulta
app.post("/api/consultar", async (c) => {
  const body = await c.req.json();
  const usuario = body.usuario;

  if (!usuario) {
    return c.json({ error: "Falta el parámetro 'usuario'" }, 400);
  }

  try {
    // Conexión a tu base de datos Railway
    const connection = await mysql.createConnection({
      host: "switchback.proxy.rlwy.net",
      user: "root",
      password: "wOBsxvHGHTYEelUkVODnQNQFLMUJXAIe",
      database: "railway",
      port: 44995,
    });

    // Consulta parametrizada
    const [rows]: any = await connection.execute(
      "SELECT * FROM jugadores WHERE nombre = ?",
      [usuario]
    );

    await connection.end();

    if (rows.length > 0) {
      return c.json(rows[0]); // Retorna los datos del jugador
    } else {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Error de conexión o consulta" }, 500);
  }
});

// Iniciar servidor
serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});
