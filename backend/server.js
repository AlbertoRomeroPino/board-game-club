import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jsonServer from "json-server";

const PORT = process.env.PORT ?? 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

const app = express();
app.use(cors());
app.use(express.json());

// Reutilizamos UN solo router/db
const router = jsonServer.router("db.json");
const db = router.db;

// --- helpers ---
function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });

  const token = header.slice("Bearer ".length);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware opcional de auth (no falla si no hay token)
function authOptional(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length);
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Token inválido, ignorar
    }
  }
  next();
}

const userIdFromReq = (req) => Number(req.user?.sub);

// Helper para obtener datos públicos de un usuario
function getPublicUser(userId) {
  const user = db.get("users").find({ id: Number(userId) }).value();
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

// --- auth endpoints ---
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "email y password son obligatorios" });
  }

  const user = db.get("users").find({ email }).value();
  if (!user?.passwordHash) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: "name, email y password son obligatorios" });
  }

  const exists = db.get("users").find({ email }).value();
  if (exists) return res.status(409).json({ message: "Email ya registrado" });

  const passwordHash = await bcrypt.hash(password, 10);

  const users = db.get("users");
  const nextId = (users.maxBy("id").value()?.id ?? 0) + 1;

  const newUser = {
    id: nextId,
    email,
    name,
    passwordHash
  };

  users.push(newUser).write();

  return res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
});

app.get("/auth/me", authRequired, (req, res) => {
  return res.json({
    id: req.user.sub,
    email: req.user.email,
    name: req.user.name
  });
});

// --- BOARD GAMES endpoints ---
// GET /games - obtener todos los juegos con info del usuario (público)
app.get("/games", (req, res) => {
  const games = db.get("games").value();
  
  // Incluir datos del usuario que subió cada juego
  const gamesWithUser = games.map(game => ({
    ...game,
    user: getPublicUser(game.userId)
  }));
  
  return res.json(gamesWithUser);
});

// GET /games/mine - obtener juegos del usuario autenticado
app.get("/games/mine", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const games = db.get("games").filter({ userId }).value();
  return res.json(games);
});

// GET /games/:id - obtener un juego por id con info del usuario (público)
app.get("/games/:id", (req, res) => {
  const id = Number(req.params.id);
  const game = db.get("games").find({ id }).value();
  
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  
  return res.json({
    ...game,
    user: getPublicUser(game.userId)
  });
});

// POST /games - crear un juego (requiere autenticación)
app.post("/games", authRequired, (req, res) => {
  const { title, description, imageUrl, minPlayers, maxPlayers, playTime, category, rating } = req.body ?? {};

  if (!title?.trim()) {
    return res.status(400).json({ message: "title es obligatorio" });
  }

  const games = db.get("games");
  const nextId = (games.maxBy("id").value()?.id ?? 0) + 1;
  const userId = userIdFromReq(req);

  const newGame = {
    id: nextId,
    title: title.trim(),
    description: description?.trim() ?? "",
    imageUrl: imageUrl?.trim() ?? "",
    minPlayers: Number(minPlayers) || 1,
    maxPlayers: Number(maxPlayers) || 4,
    playTime: Number(playTime) || 30,
    category: Array.isArray(category) ? category : [],
    rating: Number(rating) || 0,
    userId,
    createdAt: new Date().toISOString()
  };

  games.push(newGame).write();
  return res.status(201).json({
    ...newGame,
    user: getPublicUser(userId)
  });
});

// PUT /games/:id - actualizar un juego completo (requiere autenticación)
app.put("/games/:id", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const game = db.get("games").find({ id }).value();

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  const { title, description, imageUrl, minPlayers, maxPlayers, playTime, category, rating } = req.body ?? {};

  if (!title?.trim()) {
    return res.status(400).json({ message: "title es obligatorio" });
  }

  const updated = {
    ...game,
    title: title.trim(),
    description: description?.trim() ?? "",
    imageUrl: imageUrl?.trim() ?? "",
    minPlayers: Number(minPlayers) || 1,
    maxPlayers: Number(maxPlayers) || 4,
    playTime: Number(playTime) || 30,
    category: Array.isArray(category) ? category : [],
    rating: Number(rating) || 0
  };

  db.get("games").find({ id }).assign(updated).write();
  return res.json(updated);
});

// PATCH /games/:id - actualizar parcialmente un juego (requiere autenticación)
app.patch("/games/:id", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const game = db.get("games").find({ id }).value();

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  const patch = {};
  
  if (req.body?.title !== undefined) {
    const t = String(req.body.title).trim();
    if (!t) return res.status(400).json({ message: "title no puede estar vacío" });
    patch.title = t;
  }
  if (req.body?.description !== undefined) patch.description = String(req.body.description).trim();
  if (req.body?.imageUrl !== undefined) patch.imageUrl = String(req.body.imageUrl).trim();
  if (req.body?.minPlayers !== undefined) patch.minPlayers = Number(req.body.minPlayers);
  if (req.body?.maxPlayers !== undefined) patch.maxPlayers = Number(req.body.maxPlayers);
  if (req.body?.playTime !== undefined) patch.playTime = Number(req.body.playTime);
  if (req.body?.category !== undefined) patch.category = Array.isArray(req.body.category) ? req.body.category : [];
  if (req.body?.rating !== undefined) patch.rating = Number(req.body.rating);

  const updated = db.get("games").find({ id }).assign(patch).write();
  return res.json(updated);
});

// DELETE /games/:id - eliminar un juego (requiere autenticación)
app.delete("/games/:id", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const game = db.get("games").find({ id }).value();

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  db.get("games").remove({ id }).write();
  return res.status(204).send();
});

// --- FAVORITES endpoints (juegos favoritos del usuario) ---
// GET /favorites - obtener favoritos del usuario autenticado
app.get("/favorites", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const favorites = db.get("favorites").filter({ userId }).value();
  
  // Incluir datos del juego en cada favorito
  const favoritesWithGames = favorites.map(fav => {
    const game = db.get("games").find({ id: fav.gameId }).value();
    return { ...fav, game };
  });
  
  return res.json(favoritesWithGames);
});

// POST /favorites - añadir un juego a favoritos
app.post("/favorites", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const { gameId } = req.body ?? {};

  if (!gameId) {
    return res.status(400).json({ message: "gameId es obligatorio" });
  }

  const game = db.get("games").find({ id: Number(gameId) }).value();
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  // Verificar si ya existe en favoritos
  const exists = db.get("favorites").find({ userId, gameId: Number(gameId) }).value();
  if (exists) {
    return res.status(409).json({ message: "El juego ya está en favoritos" });
  }

  const favorites = db.get("favorites");
  const nextId = (favorites.maxBy("id").value()?.id ?? 0) + 1;

  const newFavorite = {
    id: nextId,
    userId,
    gameId: Number(gameId),
    addedAt: new Date().toISOString()
  };

  favorites.push(newFavorite).write();
  return res.status(201).json({ ...newFavorite, game });
});

// DELETE /favorites/:gameId - eliminar un juego de favoritos
app.delete("/favorites/:gameId", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const gameId = Number(req.params.gameId);

  const favorite = db.get("favorites").find({ userId, gameId }).value();
  if (!favorite) {
    return res.status(404).json({ message: "Favorito no encontrado" });
  }

  db.get("favorites").remove({ userId, gameId }).write();
  return res.status(204).send();
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`🎲 Board Game Club API running on http://localhost:${PORT}`);
});
