require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const morgan = require("morgan");

const Person = require("./models/person");

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
  Person.find({}).then((persons) => {
    console.log(persons); // 🔍 Verifica qué datos está obteniendo desde MongoDB
    response.json(persons);
  });
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
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: "Person not found" });
    }
  });
});

// delete por http. id 4 deleted
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) =>
      response.status(500).json({ error: "Error deleting person" })
    );
});

// post
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
app.post("/api/persons", (request, response) => {
  const { name, phone } = request.body;

  if (!name || !phone) {
    return response.status(400).json({ error: "Name and phone are required" });
  }

  const person = new Person({ name, phone });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Servir el frontend en caso de rutas desconocidas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Definir puerto para Render u otro servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
