# 🎲 BoardGameClub

**BoardGameClub** es una plataforma web desarrollada con **React** y **TypeScript** diseñada para que los entusiastas de los juegos de mesa puedan gestionar su colección personal de forma eficiente.

Este proyecto constituye la **Práctica Final del módulo de Desarrollo Web Entorno Cliente**. El objetivo principal es demostrar la capacidad de crear una Single Page Application (SPA) robusta, comunicada con un backend profesional y con un sistema de seguridad basado en tokens.

### 🚀 Funcionalidades Clave

* **Autenticación Segura:** Sistema de Login y Logout utilizando **JWT (JSON Web Tokens)** con persistencia de sesión.
* **Gestión de Inventario (CRUD):** Control total sobre la entidad de juegos (Crear, Leer, Actualizar y Eliminar).
* **Navegación Inteligente:** Implementación de rutas públicas, rutas privadas (protegidas) y gestión de errores 404.
* **Interfaz Dinámica:** UI basada en componentes reutilizables, estados de carga y gestión de errores asíncronos.

### 🔐 Autenticación (`/autenticacion`)

Estos endpoints gestionan el acceso y la identidad del usuario.

| **Método** | **Endpoint**                | **Autenticación** | **Descripción**                           |
| ----------------- | --------------------------------- | ------------------------ | ------------------------------------------------ |
| **POST**    | `/autenticacion/iniciar-sesion` | No                       | Login. Devuelve un JWT y datos del usuario.      |
| **POST**    | `/autenticacion/registro`       | No                       | Crea un nuevo usuario en la base de datos.       |
| **GET**     | `/autenticacion/yo`             | **Sí (JWT)**      | Devuelve los datos del usuario del token actual. |

---

### 👥 Usuarios (`/usuarios`)

| **Método** | **Endpoint** | **Autenticación** | **Descripción**                                   |
| ----------------- | ------------------ | ------------------------ | -------------------------------------------------------- |
| **GET**     | `/usuarios`      | No                       | Lista pública de todos los usuarios (sin contraseñas). |

---

### 🎲 Juegos de Mesa (`/juegos`)

Es el núcleo de tu aplicación. Fíjate que algunos son públicos para lectura.

| **Método** | **Endpoint** | **Autenticación** | **Descripción**                         |
| ----------------- | ------------------ | ------------------------ | ---------------------------------------------- |
| **GET**     | `/juegos`        | No                       | Lista todos los juegos con la info del dueño. |
| **GET**     | `/juegos/mios`   | **Sí (JWT)**      | Lista solo los juegos creados por ti.          |
| **GET**     | `/juegos/:id`    | No                       | Detalle de un juego específico por su ID.     |
| **POST**    | `/juegos`        | **Sí (JWT)**      | Crea un nuevo juego de mesa.                   |
| **PUT**     | `/juegos/:id`    | **Sí (JWT)**      | Actualización completa de un juego.           |
| **PATCH**   | `/juegos/:id`    | **Sí (JWT)**      | Actualización parcial (solo algunos campos).  |
| **DELETE**  | `/juegos/:id`    | **Sí (JWT)**      | Elimina un juego de la base de datos.          |

---

### ⭐ Favoritos (`/favoritos`)

Gestiona la lista personal de juegos favoritos de cada usuario.

| **Método** | **Endpoint**     | **Autenticación** | **Descripción**                           |
| ----------------- | ---------------------- | ------------------------ | ------------------------------------------------ |
| **GET**     | `/favoritos`         | **Sí (JWT)**      | Lista tus favoritos (incluye la info del juego). |
| **POST**    | `/favoritos`         | **Sí (JWT)**      | Añade un juego a tu lista (enviar `gameId`).  |
| **DELETE**  | `/favoritos/:gameId` | **Sí (JWT)**      | Quita un juego de tus favoritos usando su ID.    |

---
