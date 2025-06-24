import { Hono } from "hono@4";
import { cors } from "hono/cors";
import { serve } from "bun";
import mysql from "mysql2/promise";

const app = new Hono();
app.use("/*", cors());

// Ruta de prueba
app.get("/", (c) => c.text("API funcionando"));

// Ruta para consultar un ingrediente por su nombre
app.post("/api/ingrediente", async (c) => {
  const body = await c.req.json();
  const nombre = body.nombre;

  if (!nombre) {
    return c.json({ error: "Falta el parámetro 'nombre'" }, 400);
  }

  try {
    const connection = await mysql.createConnection({
      host: "switchback.proxy.rlwy.net",
      user: "root",
      password: "wOBsxvHGHTYEelUkVODnQNQFLMUJXAIe",
      database: "railway",
      port: 44995,
    });

    const [rows]: any = await connection.execute(
      "SELECT * FROM ingredientes WHERE nombre = ?",
      [nombre]
    );

    await connection.end();

    if (rows.length > 0) {
      return c.json(rows[0]); // Devuelve el primer ingrediente que coincida
    } else {
      return c.json({ error: "Ingrediente no encontrado" }, 404);
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Error de conexión o consulta" }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});

