const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// Middleware para configurar CORS manualmente
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite cualquier origen
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Responde a preflight requests
  }
  next();
});

// Ruta para reenviar al webhook de Zapier
app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch("https://hooks.zapier.com/hooks/catch/20333592/2ma86ek/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to forward request to Zapier" });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
