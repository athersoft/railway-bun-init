import { Hono } from "hono@4";
import { cors } from "hono/cors";
import { serve } from "bun";
import mysql from "mysql2/promise";

const app = new Hono();
app.use("/*", cors());

app.post("/api/ingrediente", async (c) => {
  const body = await c.req.json();
  return c.json({ mensaje: "Todo bien", recibido: body });
});


  const [rows]: any = await connection.execute(
    "SELECT * FROM ingredientes WHERE nombre = ?",
    [nombre]
  );

  await connection.end();

  if (rows.length > 0) {
    return c.json(rows[0]);
  } else {
    return c.json({ error: "Ingrediente no encontrado" }, 404);
  }
});
console.log("PUERTO:", process.env.PORT);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});



