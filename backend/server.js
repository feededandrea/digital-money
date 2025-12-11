const { PrismaClient } = require('@prisma/client');

require('dotenv').config();
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Para habilitar logs, puedes ajustar a tus necesidades
  // enableTracing: false, // Eliminar esta línea
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*', // Permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite estos métodos
  allowedHeaders: ['Content-Type', 'Authorization'] // Permite estos encabezados
}));
app.use(express.json());

// Configura la conexión con PostgreSQL
const client = new Client({
  host: process.env.POSTGRES_HOST || 'postgres-db', // Cambié 'localhost' por 'postgres-db'
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'digital_money',
});

// Conectar con la base de datos
client.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch(err => console.error('Error al conectar a la base de datos', err));

// Endpoint para obtener usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios', err);
    res.status(500).send('Error al obtener usuarios');
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, contrasena, cuit, telefono } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos: nombre, email o contrasena' });
  }

  try {
    // Insertar el nuevo usuario en la base de datos
    const result = await client.query(
      `INSERT INTO usuarios (nombre, email, contrasena, cuit, telefono) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, email, fecha_creacion, cuit, telefono`,
      [nombre, email, contrasena, cuit, telefono] // Pasa los valores de los campos recibidos
    );

    // Enviar la respuesta con el nuevo usuario creado
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear usuario', err);
    res.status(500).send('Error al crear usuario');
  }
});

app.get("/api/verificar-usuario", async (req, res) => {
  const { email } = req.query;

  const result = await client.query("SELECT 1 FROM usuarios WHERE email = $1", [email]);
  res.json({ existe: result.rowCount > 0 });
});

app.post("/api/login", async (req, res) => {
  const { email, contrasena } = req.body;

  const result = await client.query(
    "SELECT id, nombre, email FROM usuarios WHERE email = $1 AND contrasena = $2",
    [email, contrasena]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  // Generar JWT
  const user = result.rows[0];
  const token = jwt.sign({ id: user.id, nombre: user.nombre }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Opcional: establece la duración del token
  });

  res.json({ Token: token, UserId: user.id });
});



app.post("/api/verificarTokenUsuario", async (req, res) => {
  const { userId, token } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Faltan parámetros." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(process.env.JWT_SECRET);
    console.log("Decoded ID:", decoded.id);
    console.log("UserId recibido:", userId);

    if (decoded.id !== Number(userId)) {
      return res.status(403).json({
        error: "Token no válido para este usuario.",
        detalle: `Token ID: ${decoded.id}, userId recibido: ${userId}`,
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        nombre: true,
        email: true,
        contrasena: true,
        telefono: true,
        cuit: true,
        fecha_creacion: true
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res.json({ user: usuario });

  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
});

app.get('/api/tarjetas', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Falta token de autorización." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await client.query(
      'SELECT * FROM tarjetas WHERE "usuarioId" = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener tarjetas del usuario:", err);
    res.status(500).json({ error: "Error al obtener tarjetas del usuario." });
  }
});

app.post('/api/tarjetas', async (req, res) => {
  const { numero, titular, vencimiento, cvv, usuarioId } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!numero || !titular || !vencimiento || !cvv || !usuarioId ) {
    return res.status(400).json({ error: 'Faltan datos: numero, titular, vencimiento, cvv o usuarioId' });
  }

  try {
    // Insertar la tarjeta en la base de datos usando Prisma
    const nuevaTarjeta = await prisma.tarjeta.create({
      data: {
        numero,
        titular,
        vencimiento: new Date(vencimiento), // Convierte el string de fecha en objeto Date
        cvv,
        usuarioId, // El ID del usuario relacionado
      },
    });

    // Responder con la tarjeta creada
    res.status(201).json(nuevaTarjeta);
  } catch (err) {
    console.error('Error al crear tarjeta', err);
    res.status(500).send('Error al crear tarjeta');
  }
});

app.get('/api/actividades', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM actividades');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener actividades', err);
    res.status(500).send('Error al obtener actividades');
  }
});

app.get('/api/actividades/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await client.query(
      'SELECT * FROM actividades WHERE "usuarioId" = $1 ORDER BY fecha DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener actividades del usuario', err);
    res.status(500).send('Error al obtener actividades del usuario');
  }
});

app.post('/api/actividades', async (req, res) => {
  const { descripcion, importe, fecha, usuarioId, usuarioTransferenciaId, tipoActividad } = req.body;

  // validacion
  if (!descripcion || !importe || !fecha || !usuarioId || !tipoActividad) {
    return res.status(400).json({ error: 'Faltan datos: descripcion, importe, fecha, usuarioId o tipoActividad' });
  }

  // no viene usuarioTransferenciaId y es TARJETA,  es cuenta propia
  const transferenciaIdFinal =
    usuarioTransferenciaId ?? (tipoActividad === "TARJETA" ? usuarioId : null);

  if (!transferenciaIdFinal) {
    return res.status(400).json({ error: 'Faltan datos: usuarioTransferenciaId no definido y no es tipo TARJETA' });
  }

  try {
    const nuevaActividad = await prisma.actividad.create({
      data: {
        descripcion,
        importe: parseFloat(importe),
        fecha: new Date(fecha),
        usuarioId,
        usuarioTransferenciaId: transferenciaIdFinal,
        tipoActividad,
      },
    });

    res.status(201).json(nuevaActividad);
  } catch (err) {
    console.error('Error al crear actividad', err);
    res.status(500).send('Error al crear actividad');
  }
});

app.get('/api/usuarios-recientes/:id', async (req, res) => {
  const usuarioId = parseInt(req.params.id);

  try {
    const result = await client.query(
      `
      SELECT DISTINCT ON (u.id)
        u.id,
        u.nombre,
        u.email,
        u.fecha_creacion,
        a.fecha,
        a.descripcion,
        a.importe,
        CASE
          WHEN a."usuarioTransferenciaId" = $1 THEN 'receptor'
          WHEN a."usuarioId" = $1 THEN 'emisor'
          ELSE 'desconocido'
        END AS rol
      FROM actividades a
      JOIN usuarios u 
        ON (u.id = a."usuarioId" AND a."usuarioTransferenciaId" = $1)
        OR (u.id = a."usuarioTransferenciaId" AND a."usuarioId" = $1)
      WHERE u.id != $1
      ORDER BY u.id, a.fecha DESC;
      `,
      [usuarioId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios recientes', err);
    res.status(500).send('Error al obtener usuarios recientes');
  }
});

app.get('/api/saldo/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const actividades = await prisma.actividad.findMany({
      where: {
        OR: [
          { usuarioId: userId },
          { usuarioTransferenciaId: userId }
        ]
      },
      select: {
        importe: true,
        usuarioId: true,
        usuarioTransferenciaId: true
      }
    });

    let saldo = 0;

    for (const act of actividades) {
      if (act.usuarioTransferenciaId === userId) {
        saldo += parseFloat(act.importe); //  ingreso
      } else if (act.usuarioId === userId) {
        saldo -= parseFloat(act.importe); // egreso
      }
    }

    res.json({ saldo });
  } catch (err) {
    console.error('Error al calcular saldo', err);
    res.status(500).json({ error: 'Error al calcular saldo' });
  }
});

app.post('/api/tarjetas/confirmar', async (req, res) => {
  const { numero, titular, vencimiento, cvv, importe, usuarioId } = req.body;

  if (!numero || !titular || !vencimiento || !cvv || !importe || !usuarioId) {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

  try {
    const tarjeta = await prisma.tarjeta.findFirst({
      where: {
        numero,
        titular,
        vencimiento: new Date(vencimiento),
        cvv
      }
    });

    if (!tarjeta) {
      return res.status(404).json({ error: 'Tarjeta no encontrada o datos incorrectos' });
    }

    if (parseFloat(tarjeta.saldoDisponible) < parseFloat(importe)) {
      return res.status(400).json({ error: 'Saldo insuficiente en la tarjeta' });
    }

    // Crear una actividad de ingreso
    const actividad = await prisma.actividad.create({
      data: {
        descripcion: "Ingreso de dinero desde tarjeta",
        importe: parseFloat(importe),
        fecha: new Date(),
        usuario: {
          connect: { id: usuarioId }  
        },
        tipoActividad: "TARJETA", 
        usuarioTransferencia: { 
          connect: { id: 1 }
        }
      }
    });

    // Debitar el saldo de la tarjeta
    await prisma.tarjeta.update({
      where: { id: tarjeta.id },
      data: {
        saldoDisponible: {
          decrement: parseFloat(importe)
        }
      }
    });

    res.status(200).json({ mensaje: 'Recarga realizada exitosamente', actividad });
  } catch (err) {
    console.error('Error al confirmar tarjeta', err);
    res.status(500).json({ error: 'Error al confirmar tarjeta' });
  }
});

// Iniciar el servidor
const PORT = 4000; // Asegúrate que coincida con docker-compose
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

