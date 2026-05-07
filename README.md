# DISAINER Mobile App 📱

> **"Diseñar es decidir. Lo demás sobra."**

Aplicación móvil de alta gama desarrollada para la marca personal **Disainer**. Una solución integral para la gestión de proyectos de diseño, branding y desarrollo web.

## 🚀 Características Principales

- **Estética High-End:** Interfaz basada en **Bento Grids**, **Glassmorphism** y **Dark Mode** premium.
- **Catálogo Inteligente:** Sistema de paquetes escalables (Start, Professional, Full Experience) para servicios de Branding, Web, UX/UI, Social Media y más.
- **Persistencia Híbrida (Cumplimiento de Rúbrica):**
  - **SQLite:** Carrito de compras con funcionamiento offline para asegurar la persistencia local.
  - **Firebase:** Autenticación de usuarios y sincronización en tiempo real (Realtime Database) del progreso de proyectos.
- **Briefing Nativo:** Integración con la cámara del dispositivo para el envío de referencias visuales.
- **Perfil Personalizado:** Gestión de datos de cliente, fotos de perfil y métodos de pago.

## 🛠️ Stack Tecnológico

- **Frontend:** React Native / Expo
- **Lenguaje:** JavaScript (ES6+)
- **Estilos:** StyleSheet modular con enfoque en diseño minimalista.
- **Base de Datos Local:** Expo SQLite.
- **Backend & Auth:** Firebase (Authentication & Realtime Database).
- **Iconografía:** Lucide React Native.

## 📂 Estructura del Proyecto

APP DISAINER

📁 .expo
📁 .idea
📁 .vscode
📁 app
📁 assets            # Imágenes, iconos y fuentes (Futura)
📁 components        # Botones, Cards, GlassView, Bento items
📁 constants         # theme.js, colors.js
📁 hooks             # Lógica de estado y persistencia
📁 node_modules
📁 scripts
📁 src               # Código fuente principal
📄 .gitignore
📄 App.js            # Punto de entrada y Navegación
📄 app.json          # Configuración de Expo y Firebase
📄 eslint.config.js
📄 expo-env.d.ts
📄 package-lock.json
📄 package.json      # Dependencias (SQLite, Firebase, Camera)
📄 README.md         # Documentación del proyecto
📄 tsconfig.json