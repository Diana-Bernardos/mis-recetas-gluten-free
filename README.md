# 🥞 Mis Recetas Sin Gluten

![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Node](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933)
![SQLite](https://img.shields.io/badge/database-SQLite-003B57)

Bienvenid@ a **Mis Recetas Sin Gluten**, una aplicación web moderna Full-Stack diseñada para gestionar, buscar y organizar tus recetas favoritas.

## ✨ Características

- **Gestión de Recetas**: Crea, guarda y visualiza tus propias recetas.
- **Buscador Global**: Integración con **TheMealDB** para buscar recetas en internet sin salir de la app.
- **Lista de la Compra**: Añade ingredientes y táchalos a medida que los compras.
- **Asistente Virtual**: Un chat inteligente (local) que te ayuda a gestionar tu lista y te sugiere menús.
- **Diseño Moderno**: Interfaz "Glassmorphism" con colores pastel y completamente responsiva.

## 🚀 Instalación y Ejecución

Este proyecto utiliza **Node.js** para el servidor y **React** para la web.

### Prerrequisitos
- Tener [Node.js](https://nodejs.org/) instalado.

### Opción Rápida (PowerShell)
Simplemente ejecuta el script automático incluido en la raíz:

```powershell
.\start_project.ps1
```

Esto abrirá automáticamente el servidor y el cliente en ventanas separadas.

### Ejecución Manual

Si prefieres hacerlo paso a paso:

1. **Iniciar el Servidor (Backend)**
   ```bash
   cd server
   npm install  # Solo la primera vez
   npm start
   ```
   *El servidor correrá en http://localhost:3000*

2. **Iniciar el Cliente (Frontend)**
   ```bash
   cd client
   npm install  # Solo la primera vez
   npm run dev
   ```
   *La web estará disponible en http://localhost:5173*

## 🛠️ Tecnologías

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, Axios.
- **Backend**: Express.js, Better-SQLite3.
- **Datos**: SQLite (Base de datos local en archivo).

## 📝 Notas sobre Deployment (GitHub Pages)

Este proyecto es una aplicación **Full Stack** con base de datos real. Por lo tanto, **NO** se puede desplegar en servidores estáticos como GitHub Pages. Requiere un servidor Node.js para funcionar (como Render, Railway o un VPS).

---
Desarrollado con ❤️ por Diana.
