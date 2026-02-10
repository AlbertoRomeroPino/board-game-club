# Board Game Club - Practica Final React

**Autor:** Alberto Romero Pino  
**Asignatura:** Desarrollo Web en Entornos Cliente  
**Fecha:** Febrero 2026

---

## Descripcion del Proyecto

Board Game Club es una aplicacion web desarrollada con React que permite a los usuarios gestionar su coleccion personal de juegos de mesa. Los usuarios pueden registrarse, iniciar sesion, agregar juegos a su coleccion, ver detalles, editar, eliminar y marcar juegos como favoritos.

---

## Estructura del Proyecto (Archivos Creados)

```
src/
├── auth/
│   ├── authContext.tsx
│   └── authStorage.ts
├── components/
│   ├── ButtonBackInicio.tsx
│   ├── JuegoCard.tsx
│   ├── JuegosForm.tsx
│   ├── ProtectedRoute.tsx
│   ├── RegisterForm.tsx
│   └── Seccion.tsx
├── context/
│   └── FavoritosContext.tsx
├── layout/
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx
├── pages/
│   ├── FavoritosPage.tsx
│   ├── InicioPage.tsx
│   ├── JuegoDetalles.tsx
│   ├── JuegosPage.tsx
│   ├── LoginPage.tsx
│   ├── MisJuegos.tsx
│   ├── NotFoundPage.tsx
│   ├── PerfilPage.tsx
│   └── RegisterPage.tsx
├── services/
│   ├── auth.ts
│   ├── authService.ts
│   ├── favoritoService.ts
│   ├── http.ts
│   └── juegosService.ts
├── styles/
│   ├── auth.css
│   ├── index.css
│   ├── inicio.css
│   ├── juegos.css
│   ├── layout.css
│   ├── notfound.css
│   └── variables.css
└── types/
    ├── BoardGame.ts
    ├── Favorite.ts
    └── User.ts
```

---

## Instalacion y Ejecucion

### Requisitos Previos

- Node.js (version 18 o superior)
- npm o yarn
- Docker y Docker Compose (para el backend)

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear archivo `.env` en la raiz:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Iniciar el backend

```bash
docker-compose up -d
```

### Iniciar el frontend

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`

---

## Tecnologias Utilizadas

| Tecnologia   | Version | Proposito                  |
| ------------ | ------- | -------------------------- |
| React        | 18.x    | Biblioteca principal de UI |
| TypeScript   | 5.x     | Tipado estatico            |
| Vite         | 6.x     | Build tool y dev server    |
| React Router | 6.x     | Enrutamiento SPA           |
| Axios        | 1.x     | Cliente HTTP               |

---

## Usuario de Prueba

El backend incluye un usuario precargado para testing:

| Campo    | Valor         |
| -------- | ------------- |
| Email    | test@test.com |
| Password | 123456        |

---

## Checklist de Requisitos Minimos

### Requisitos Funcionales

- [x] Pagina publica de inicio o presentacion
- [x] Pagina publica de login para obtener el JWT
- [x] Almacenamiento del JWT de forma adecuada
- [x] Rutas protegidas (impedir acceso sin autenticacion)
- [x] Redireccion correcta al login cuando sea necesario
- [x] Pagina 404 para rutas inexistentes
- [x] Listado de elementos de la entidad (GET)
- [x] Consulta de detalles de un elemento (GET)
- [x] Alta de un nuevo elemento (POST)
- [x] Edicion de un elemento existente (PUT)
- [x] Eliminacion de elementos (DELETE)
- [x] Gestion visible de errores de la API
- [x] Estados de carga (loading)
- [x] Estados vacios (cuando no hay datos)

### Requisitos Tecnicos

- [x] React + TypeScript
- [x] React Router con rutas publicas
- [x] React Router con rutas privadas
- [x] React Router con ruta comodin (*) para 404
- [x] Uso de useState
- [x] Uso de useEffect
- [x] Manejo de eventos onClick
- [x] Manejo de eventos onSubmit
- [x] Manejo de eventos onChange
- [x] Comunicacion asincrona con async/await
- [x] Separacion de logica de API en servicios
- [x] Consumo de API REST mediante Axios

### Diseno e Interfaz

- [x] Componentes reutilizables (Layout, Paginas, UI)
- [x] Feedback visual al usuario (mensajes de error, estados de carga)
- [x] Interfaz clara y consistente

---

## Verificacion de Requisitos

---

### 1. Pagina publica de inicio o presentacion

**Requisito:** La aplicacion debe incluir una pagina publica de inicio accesible sin autenticacion.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | InicioPage                      |
| Archivo     | pages/InicioPage.tsx            |
| Ruta        | /inicio                         |
| Proteccion  | Ninguna (publica)               |

```tsx
// App.tsx - Ruta publica
<Route path="/inicio" element={<InicioPage />} />
```

---

### 2. Pagina publica de login para obtener el JWT

**Requisito:** Pagina de login que permita al usuario autenticarse y obtener un token JWT.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | LoginPage                       |
| Archivo     | pages/LoginPage.tsx             |
| Ruta        | /iniciar-sesion                 |
| Servicio    | authService.login()             |

```tsx
// LoginPage.tsx - Formulario de login
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const session = await authService.login({
      email: email.trim(),
      password,
    });
    login(session);
    navigate("/juegos", { replace: true });
  } catch {
    setError("Datos incorrectos o API no disponible");
  } finally {
    setLoading(false);
  }
}
```

---

### 3. Almacenamiento del JWT de forma adecuada

**Requisito:** El token JWT debe almacenarse de forma persistente para mantener la sesion.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | authStorage                     |
| Archivo     | auth/authStorage.ts             |
| Metodo      | localStorage                    |
| Clave       | board_game_club_auth            |

```typescript
// authStorage.ts
const STORAGE_KEY = "board_game_club_auth";

export const authStorage = {
  get(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  set(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getToken(): string | null {
    const session = this.get();
    return session?.token ?? null;
  }
};
```

---

### 4. Rutas protegidas

**Requisito:** Impedir el acceso a paginas privadas sin autenticacion y redirigir al login cuando sea necesario.

| Aspecto     | Detalles                              |
| ----------- | ------------------------------------- |
| Componente  | ProtectedRoute, GuestRoute            |
| Archivo     | components/ProtectedRoute.tsx         |
| Metodo      | Navigate + Outlet de React Router     |
| Rutas       | /juegos, /mis-juegos, /favoritos, /perfil |

```tsx
// ProtectedRoute.tsx
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/juegos" replace />;
  }

  return <Outlet />;
}
```

```tsx
// App.tsx - Rutas protegidas
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/juegos" element={<JuegosPage />} />
    <Route path="/mis-juegos" element={<MisJuegos />} />
    <Route path="/mis-juegos/:id" element={<JuegoDetalles />} />
    <Route path="/favoritos" element={<FavoritosPage />} />
    <Route path="/perfil" element={<PerfilPage />} />
  </Route>
</Route>
```

---

### 5. Pagina 404 para rutas inexistentes

**Requisito:** Mostrar una pagina de error cuando se acceda a una ruta que no existe.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | NotFoundPage                    |
| Archivo     | pages/NotFoundPage.tsx          |
| Ruta        | * (comodin)                     |
| Estilo      | Tematica D&D (pifia critica)    |

```tsx
// App.tsx - Ruta comodin 404
<Route path="*" element={<NotFoundPage />} />
```

```tsx
// NotFoundPage.tsx
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="dice-container">
          <div className="d20">
            <span className="dice-number">1</span>
          </div>
        </div>
        <h1 className="notfound-title">Pifia Critica!</h1>
        <p className="notfound-code">Error 404</p>
        <p className="notfound-message">
          Has sacado un <strong>1 natural</strong> en tu tirada de Navegacion.
        </p>
      </div>
    </div>
  );
};
```

---

### 6. Listado de elementos de la entidad (GET)

**Requisito:** Obtener y mostrar una lista de todos los elementos de la entidad.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegosPage, MisJuegos           |
| Archivo     | pages/JuegosPage.tsx            |
| Servicio    | juegosService.getAll()          |
| Endpoint    | GET /juegos                     |

```tsx
// JuegosPage.tsx
useEffect(() => {
  juegosService
    .getAll()
    .then((listaJuegos) => setJuegos(listaJuegos))
    .catch((respuestaErronea) => {
      setError(respuestaErronea.message);
    })
    .finally(() => setCargando(false));
}, []);
```

```tsx
// juegosService.ts
getAll(): Promise<BoardGame[]> {
  return http.get<BoardGame[]>(API_URL).then((response) => response.data);
},
```

---

### 7. Consulta de detalles de un elemento (GET)

**Requisito:** Obtener y mostrar los detalles de un elemento especifico por su ID.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegoDetalles                   |
| Archivo     | pages/JuegoDetalles.tsx         |
| Servicio    | juegosService.get(id)           |
| Endpoint    | GET /juegos/:id                 |
| Ruta        | /mis-juegos/:id                 |

```tsx
// JuegoDetalles.tsx
useEffect(() => {
  if (id) {
    juegosService
      .get(Number(id))
      .then((data) => setJuego(data))
      .catch((err) => {
        console.error("Error al cargar el juego:", err);
        setError("No se pudo cargar el juego");
      });
  }
}, [id]);
```

```tsx
// juegosService.ts
get(id: number): Promise<BoardGame> {
  return http
    .get<BoardGame>(`${API_URL}/${id}`)
    .then((response) => response.data);
},
```

---

### 8. Alta de un nuevo elemento (POST)

**Requisito:** Permitir crear un nuevo elemento de la entidad.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | MisJuegos + JuegosForm          |
| Archivo     | pages/MisJuegos.tsx             |
| Servicio    | juegosService.create()          |
| Endpoint    | POST /juegos                    |

```tsx
// MisJuegos.tsx
const handleAgregarJuego = (nuevoJuego: CreateBoardGame) => {
  setIsLoading(true);
  juegosService
    .create(nuevoJuego as BoardGame)
    .then((juegoCreado) => {
      setMisJuegos((prev) => [...prev, juegoCreado]);
      setMostrarFormulario(false);
    })
    .catch((err) => {
      console.error("Error al crear el juego:", err);
      setError("No se pudo crear el juego");
    })
    .finally(() => setIsLoading(false));
};
```

```tsx
// juegosService.ts
create(NewGame: BoardGame): Promise<BoardGame> {
  return http
    .post<BoardGame>(API_URL, NewGame)
    .then((response) => response.data);
},
```

---

### 9. Edicion de un elemento existente (PUT)

**Requisito:** Permitir modificar un elemento existente de la entidad.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegoDetalles + JuegosForm      |
| Archivo     | pages/JuegoDetalles.tsx         |
| Servicio    | juegosService.update()          |
| Endpoint    | PUT /juegos/:id                 |

```tsx
// JuegoDetalles.tsx
const handleSubmit = (juegoActualizado: CreateBoardGame) => {
  if (!id || !juego) return;
  setIsLoading(true);
  const juegoCompleto: BoardGame = {
    ...juegoActualizado,
    id: juego.id,
    userId: juego.userId,
    createdAt: juego.createdAt,
  };
  juegosService
    .update(juegoCompleto)
    .then((actualizado) => {
      setJuego(actualizado);
      setModoEdicion(false);
    })
    .catch((err) => {
      setError("No se pudo actualizar el juego");
    })
    .finally(() => setIsLoading(false));
};
```

---

### 10. Eliminacion de elementos (DELETE)

**Requisito:** Permitir eliminar un elemento de la entidad.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegoDetalles                   |
| Archivo     | pages/JuegoDetalles.tsx         |
| Servicio    | juegosService.delete()          |
| Endpoint    | DELETE /juegos/:id              |

```tsx
// JuegoDetalles.tsx
const handleDelete = () => {
  if (!id || !juego) return;
  if (!window.confirm(`Estas seguro de que quieres eliminar "${juego.title}"?`))
    return;

  setIsLoading(true);
  juegosService
    .delete(Number(id))
    .then(() => {
      navigate("/mis-juegos");
    })
    .catch((err) => {
      setError("No se pudo eliminar el juego");
    })
    .finally(() => setIsLoading(false));
};
```

---

### 11. Gestion visible de errores de la API

**Requisito:** Mostrar mensajes de error al usuario cuando ocurran fallos en la comunicacion con la API.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegosPage, MisJuegos, JuegoDetalles |
| Archivo     | pages/JuegosPage.tsx            |
| Estado      | error (useState)                |
| Clase CSS   | .juegos-error, .error-message   |

```tsx
// JuegosPage.tsx
const [error, setError] = useState("");

if (error) {
  return (
    <div className="juegos-page">
      <p className="juegos-error">Error: {error}</p>
    </div>
  );
}
```

```tsx
// MisJuegos.tsx
{error && <p className="error-message">{error}</p>}
```

---

### 12. Estados de carga (loading)

**Requisito:** Mostrar indicadores de carga mientras se obtienen datos de la API.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegosPage, MisJuegos, FavoritosPage |
| Archivo     | pages/JuegosPage.tsx            |
| Estado      | cargando, isLoading (useState)  |
| Mensaje     | "Cargando juegos..."            |

```tsx
// JuegosPage.tsx
const [cargando, setCargando] = useState(true);

if (cargando) {
  return (
    <div className="juegos-page">
      <p className="juegos-loading">Cargando juegos...</p>
    </div>
  );
}
```

```tsx
// MisJuegos.tsx
if (cargandoInicial) {
  return (
    <div className="juegos-page">
      <p>Cargando tus juegos...</p>
    </div>
  );
}
```

---

### 13. Estados vacios (cuando no hay datos)

**Requisito:** Mostrar un mensaje apropiado cuando no existan elementos para mostrar.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegosPage, MisJuegos, FavoritosPage |
| Archivo     | pages/JuegosPage.tsx            |
| Condicion   | array.length === 0              |
| Clase CSS   | .juegos-empty, .empty-state     |

```tsx
// JuegosPage.tsx
if (juegos.length === 0) {
  return (
    <div className="juegos-page">
      <p className="juegos-empty">No hay juegos disponibles</p>
    </div>
  );
}
```

```tsx
// MisJuegos.tsx
{misJuegos.length === 0 ? (
  <p className="empty-state">No tienes juegos aun. Anade tu primer juego!</p>
) : (
  <div className="juegos-grid">
    {misJuegos.map((juego) => (
      <JuegoCard key={juego.id} juego={juego} clickable />
    ))}
  </div>
)}
```

---

### 14. Uso de React Router (rutas publicas, privadas, comodin)

**Requisito:** Implementar enrutamiento con rutas publicas, privadas y ruta comodin para 404.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | App                             |
| Archivo     | App.tsx                         |
| Libreria    | react-router-dom                |
| Elementos   | Routes, Route, Navigate, Outlet |

```tsx
// App.tsx
function App() {
  return (
    <Routes>
      {/* Ruta publica */}
      <Route path="/inicio" element={<InicioPage />} />

      {/* Rutas de autenticacion (solo no autenticados) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Rutas protegidas (solo autenticados) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/juegos" element={<JuegosPage />} />
          <Route path="/mis-juegos" element={<MisJuegos />} />
          <Route path="/mis-juegos/:id" element={<JuegoDetalles />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Route>

      {/* Redireccion por defecto y 404 */}
      <Route index element={<Navigate to="/inicio" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

---

### 15. Uso de hooks (useState, useEffect)

**Requisito:** Utilizar hooks de React para gestionar estado y efectos secundarios.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Hooks       | useState, useEffect, useCallback, useMemo, useContext |
| Archivos    | Todos los componentes           |

```tsx
// JuegosPage.tsx - useState y useEffect
const [juegos, setJuegos] = useState<BoardGame[]>([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  juegosService
    .getAll()
    .then((listaJuegos) => setJuegos(listaJuegos))
    .catch((err) => setError(err.message))
    .finally(() => setCargando(false));
}, []);
```

```tsx
// FavoritosContext.tsx - useCallback y useMemo
const isFavorite = useCallback(
  (gameId: number) => favoriteIds.has(gameId),
  [favoriteIds]
);

const value = useMemo<FavoritosContextValue>(
  () => ({ favoriteIds, isLoading, isFavorite, toggleFavorite }),
  [favoriteIds, isLoading, isFavorite, toggleFavorite]
);
```

---

### 16. Manejo explicito de eventos (onClick, onSubmit, onChange)

**Requisito:** Gestionar eventos del usuario de forma explicita.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Eventos     | onClick, onSubmit, onChange     |
| Archivos    | JuegosForm.tsx, LoginPage.tsx, JuegoCard.tsx |

```tsx
// JuegosForm.tsx - onChange
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "number" ? Number(value) : value,
  }));
};
```

```tsx
// JuegosForm.tsx - onSubmit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
};

<form onSubmit={handleSubmit} className="juegos-form">
```

```tsx
// JuegoCard.tsx - onClick
const handleClick = () => {
  if (clickable) {
    navigate(`/mis-juegos/${juego.id}`);
  }
};

<div onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default' }}>
```

---

### 17. Separacion de la logica de acceso a la API en servicios

**Requisito:** Aislar la logica de comunicacion con la API en modulos de servicio separados.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Servicios   | juegosService, authService, favoritoService |
| Archivo     | services/juegosService.ts       |
| HTTP Client | Axios (http.ts)                 |

```typescript
// juegosService.ts
import { http } from "./http";
import type { BoardGame } from "../types/BoardGame";

const API_URL = "/juegos";

export const juegosService = {
  get(id: number): Promise<BoardGame> {
    return http.get<BoardGame>(`${API_URL}/${id}`).then((res) => res.data);
  },
  getAll(): Promise<BoardGame[]> {
    return http.get<BoardGame[]>(API_URL).then((res) => res.data);
  },
  create(game: BoardGame): Promise<BoardGame> {
    return http.post<BoardGame>(API_URL, game).then((res) => res.data);
  },
  update(game: BoardGame): Promise<BoardGame> {
    return http.put<BoardGame>(`${API_URL}/${game.id}`, game).then((res) => res.data);
  },
  delete(id: number): Promise<void> {
    return http.delete(`${API_URL}/${id}`).then(() => {});
  },
};
```

---

### 18. Consumo de la API REST mediante Axios

**Requisito:** Utilizar Axios para la comunicacion con el backend, incluyendo interceptores para JWT.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | http                            |
| Archivo     | services/http.ts                |
| Libreria    | axios                           |
| Interceptor | Authorization header con JWT    |

```typescript
// http.ts
import axios from "axios";
import { authStorage } from "../auth/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const http = axios.create({ baseURL: API_BASE_URL });

// Interceptor para añadir token JWT a las peticiones
http.interceptors.request.use((config) => {
  const session = authStorage.get();
  if (session?.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor para manejar errores 401
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      authStorage.clear();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);
```

---

### 19. Diseno basado en componentes reutilizables

**Requisito:** Crear componentes reutilizables para layouts, paginas y elementos de UI.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Layouts     | AppLayout, AuthLayout           |
| Componentes | JuegoCard, JuegosForm, Seccion  |
| Archivo     | components/JuegoCard.tsx        |

```tsx
// JuegoCard.tsx - Componente reutilizable con props
interface JuegoCardProps {
  juego: BoardGame;
  clickable?: boolean;
  showFavoriteButton?: boolean;
}

const JuegoCard = ({ 
  juego, 
  clickable = false, 
  showFavoriteButton = true 
}: JuegoCardProps) => {
  // ...
};
```

| Componente  | Uso en archivos                 |
| ----------- | ------------------------------- |
| JuegoCard   | JuegosPage, MisJuegos, FavoritosPage |
| JuegosForm  | MisJuegos, JuegoDetalles        |
| AppLayout   | App.tsx (rutas protegidas)      |
| AuthLayout  | App.tsx (rutas autenticacion)   |

---

### 20. Formularios controlados

**Requisito:** Implementar formularios con inputs controlados mediante estado de React.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Componente  | JuegosForm                      |
| Archivo     | components/JuegosForm.tsx       |
| Estado      | formData (useState)             |
| Campos      | title, description, imageUrl, minPlayers, maxPlayers, playTime, category, rating |

```tsx
// JuegosForm.tsx
const [formData, setFormData] = useState<CreateBoardGame>({
  title: initialData?.title ?? "",
  description: initialData?.description ?? "",
  imageUrl: initialData?.imageUrl ?? "",
  minPlayers: initialData?.minPlayers ?? 2,
  maxPlayers: initialData?.maxPlayers ?? 4,
  playTime: initialData?.playTime ?? 30,
  category: initialData?.category ?? [],
  rating: initialData?.rating ?? 0,
});

<input
  type="text"
  id="title"
  name="title"
  value={formData.title}
  onChange={handleChange}
  required
/>
```

---

### 21. Interfaces TypeScript

**Requisito:** Definir tipos e interfaces para los datos de la aplicacion.

| Aspecto     | Detalles                        |
| ----------- | ------------------------------- |
| Archivos    | types/BoardGame.ts, types/User.ts, types/Favorite.ts |
| Interfaces  | BoardGame, User, Favorite       |

```typescript
// types/BoardGame.ts
export interface BoardGame {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  category: string[];
  rating: number;
  userId: number;
  createdAt: string;
}

export type CreateBoardGame = Omit<BoardGame, "id" | "userId" | "createdAt">;
```

```typescript
// types/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
```

---

## Resumen de Cumplimiento

| Requisito                                      | Estado  |
| ---------------------------------------------- | ------- |
| Pagina publica de inicio                       | CUMPLE  |
| Pagina de login                                | CUMPLE  |
| Almacenamiento JWT                             | CUMPLE  |
| Rutas protegidas                               | CUMPLE  |
| Pagina 404                                     | CUMPLE  |
| Listado de elementos (GET)                     | CUMPLE  |
| Detalles de elemento (GET)                     | CUMPLE  |
| Alta de elemento (POST)                        | CUMPLE  |
| Edicion de elemento (PUT)                      | CUMPLE  |
| Eliminacion de elemento (DELETE)               | CUMPLE  |
| Gestion visible de errores                     | CUMPLE  |
| Estados de carga                               | CUMPLE  |
| Estados vacios                                 | CUMPLE  |
| React Router (publicas/privadas/comodin)       | CUMPLE  |
| Uso de hooks                                   | CUMPLE  |
| Manejo de eventos                              | CUMPLE  |
| Servicios separados                            | CUMPLE  |
| Axios con interceptores                        | CUMPLE  |
| Componentes reutilizables                      | CUMPLE  |
| Formularios controlados                        | CUMPLE  |
| Interfaces TypeScript                          | CUMPLE  |

---
