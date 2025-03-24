const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const morgan = require("morgan");

// config morgan con tiny
//app.use(morgan("tiny"));

// Habilitar CORS para evitar problemas de acceso entre frontend y backend
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Servir el frontend desde la carpeta "dist"
app.use(express.static("dist"));

let persons = [
  {
    name: "Ada Lovelace",
    tel: "39-44-5323523",
    id: 1,
  },
  {
    name: "Dan Abramov",
    tel: "12-43-234345",
    id: 2,
  },
  {
    name: "Mary Poppendieck",
    tel: "39-23-6423122",
    id: 3,
  },
];

// ruta /
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// rut api/persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//ruta info

app.get("/info", (request, response) => {
  const options = {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long",
  };

  const now = new Date().toLocaleString("en-US", options);

  response.send(`<h2>Phone book has info for ${persons.length} people</h2>
                   <p>${now}</p>`);
});

// mostrar por id
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = persons.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// delete por http. id 4 deleted
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// post
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.tel) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const nameExists = persons.some(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );
  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    name: body.name,
    tel: body.tel,
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

// Servir el frontend en caso de rutas desconocidas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Definir puerto para Render u otro servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
