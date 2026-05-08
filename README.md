# DISAINER Mobile App 📱

> **"Diseñar es decidir. Lo demás sobra."**

Aplicación móvil de alta gama desarrollada para la marca personal **Disainer**. Una solución integral para la contratación y gestión de servicios de diseño gráfico, branding, desarrollo web, UX/UI, social media y asesorías.

---

## 🚀 Características Principales

- **Estética High-End:** Interfaz basada en **Bento Grids**, **Glassmorphism** y **Dark Mode** premium.
- **Autenticación Real:** Registro e inicio de sesión con email/contraseña via Firebase Authentication. Soporte para Google Sign-In (en desarrollo).
- **Catálogo Inteligente:** Sistema de paquetes escalables (Start, Professional, Full Experience) para servicios de Branding, Web, UX/UI, Social Media y más.
- **Carrito con Persistencia Offline:** El carrito usa **SQLite local** — los items se conservan aunque no haya internet.
- **Mis Proyectos:** Una vez realizada una compra, los proyectos quedan registrados con estado, fecha de compra y entrega estimada.
- **Mensajería Interna:** Sistema de mensajes con indicador de no leído, apertura automática y vigencia de una semana.
- **Notificaciones:** Panel de notificaciones con badge, lectura y limpieza automática.
- **Briefing Nativo:** Integración con la **cámara del dispositivo** para foto de perfil y envío de referencias visuales.
- **Métodos de Pago:** Gestión de tarjetas de crédito, débito y Mercado Pago desde el perfil.
- **Configuración Completa:** Privacidad y seguridad, historial de facturación con comprobantes, centro de ayuda con FAQ y WhatsApp, términos y condiciones, modo oscuro/claro.
- **WhatsApp Flotante:** Botón de contacto directo en el Home.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| React Native / Expo SDK 54 | Framework principal |
| JavaScript ES6+ | Lenguaje |
| Firebase Authentication | Login con email y Google |
| Firebase Realtime Database | Proyectos, mensajes, notificaciones, perfil |
| Expo SQLite | Persistencia local del carrito (offline) |
| Redux Toolkit (RTK) | Manejo de estado global |
| RTK Query | Conexión con Firebase para datos |
| React Navigation v6 | Navegación (Stack + Bottom Tabs) |
| Expo Camera / ImagePicker | Cámara y galería |
| Expo Auth Session | Google OAuth |
| Lucide React Native | Iconografía |
| Expo Blur | Efectos glassmorphism |
| StyleSheet modular | Estilos por componente |

---

## 📂 Estructura del Proyecto

```
APP DISAINER/
├── src/
│   ├── api/              # Servicios y endpoints
│   ├── components/       # Componentes reutilizables (Botones, Cards, BentoGrid)
│   ├── config/
│   │   └── firebase.js   # Inicialización de Firebase
│   ├── constants/
│   │   └── theme.js      # Colores, tipografía, espaciado
│   ├── context/
│   │   ├── CartContext.js         # Carrito con SQLite
│   │   ├── ThemeContext.js        # Dark/Light mode
│   │   └── NotificationContext.js # Notificaciones en tiempo real
│   ├── database/
│   │   └── db.js         # Inicialización de SQLite y tabla cart
│   ├── hooks/
│   │   └── useCart.js    # Hook del carrito
│   ├── navigation/
│   │   └── TabNavigator.js # Bottom Tab Navigator
│   └── screens/
│       ├── OnboardingScreen.js
│       ├── LoginScreen.js
│       ├── SignupScreen.js
│       ├── HomeScreen.js
│       ├── CatalogScreen.js
│       ├── CartScreen.js
│       ├── ProjectsScreen.js
│       ├── MessagesScreen.js
│       ├── ChatDetailScreen.js
│       ├── ProfileScreen.js
│       ├── SettingsScreen.js
│       ├── PrivacySettingsScreen.js
│       ├── BillingHistoryScreen.js
│       ├── HelpCenterScreen.js
│       ├── TermsScreen.js
│       ├── BriefScreen.js
│       └── SplashScreen.js
├── assets/               # Imágenes, íconos, fuentes
├── App.js                # Punto de entrada, Stack Navigator, Auth listener
├── app.json              # Configuración Expo
├── app.config.js         # Variables de entorno (.env)
└── package.json          # Dependencias
```

---

## 🗄️ Persistencia de Datos

### SQLite (Local / Offline)
El carrito de compras usa **Expo SQLite** para persistencia local. Los datos se almacenan en el dispositivo y funcionan sin conexión a internet.

```js
// src/database/db.js
CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY NOT NULL,
  serviceId TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL
)
```

Operaciones implementadas: `INSERT`, `UPDATE`, `DELETE`, `SELECT` — todas asíncronas con la API moderna de `expo-sqlite`.

### Firebase Realtime Database (Cloud / Sincronización)
Estructura de datos en Firebase:

```
/users/{uid}          → Perfil del usuario
/orders/{uid}         → Proyectos y compras
/messages/{uid}       → Mensajes internos
/notifications/{uid}  → Notificaciones del sistema
```

---

## 🔐 Autenticación

- **Email/Contraseña:** Registro y login funcionando con Firebase Authentication.
- **Google Sign-In:** Implementado con `expo-auth-session`. En proceso de configuración final de OAuth en Google Cloud Console.

### ⚠️ Para ingresar a la app como evaluador:
1. Tocá **"Crear una Cuenta"** en la pantalla de inicio
2. Ingresá un email y contraseña (mínimo 6 caracteres)
3. Accedés a la app completa

---

## 📱 Device Features

### Cámara y Galería
Implementado con `expo-image-picker` en:
- **Signup:** Foto de perfil al crear cuenta
- **Perfil:** Cambio de foto de perfil
- **Brief:** Envío de referencias visuales para proyectos

Permisos solicitados en runtime según plataforma (iOS/Android).

---

## 🧭 Navegación

La app usa **React Navigation v6** con dos tipos de navegadores:

- **Stack Navigator** (App.js): Maneja el flujo de autenticación y pantallas secundarias
- **Bottom Tab Navigator** (TabNavigator.js): Home, Catálogo, Brief, Carrito

Flujo de navegación:
```
SplashScreen
    ↓
OnboardingScreen → LoginScreen / SignupScreen
    ↓ (autenticado)
TabNavigator (Home / Catálogo / Brief / Carrito)
    ↓ (desde Home)
Projects / Messages / Profile / Settings / ChatDetail
    ↓ (desde Settings)
PrivacySettings / BillingHistory / HelpCenter / Terms
```

---

## 🔄 Manejo de Estado

- **useState / useEffect:** Estado local en cada pantalla
- **Context API:** CartContext, ThemeContext, NotificationContext
- **Redux Toolkit (RTK):** Estado global de la aplicación
- **RTK Query:** Consultas a Firebase para datos del catálogo y proyectos

---

## ⚙️ Instalación y Puesta en Marcha

### Requisitos
- Node.js 18+
- Expo CLI
- Expo Go en el celular (iOS o Android)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/COBRAd23/DISAINER-APP.git
cd DISAINER-APP

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env en la raíz con las variables de Firebase
# (ver .env.example para referencia)

# 4. Iniciar el proyecto
npx expo start --clear

# 5. Escanear el QR con Expo Go o presionar 'a' para Android
```

### Variables de entorno (.env)
```
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

---

## 📦 Dependencias Principales

```json
"expo": "~54.0.0",
"react-native": "0.76.7",
"firebase": "^12.0.0",
"expo-sqlite": "~15.1.2",
"expo-auth-session": "~6.0.3",
"expo-image-picker": "~16.0.6",
"expo-blur": "~14.0.3",
"@react-navigation/native": "^7.0.14",
"@react-navigation/bottom-tabs": "^7.2.0",
"@react-navigation/native-stack": "^7.2.0",
"@reduxjs/toolkit": "^2.5.0",
"lucide-react-native": "^0.475.0"
```

---

## 👨‍💻 Autor

**Agustín González** — Cobra Design Estudio  
Proyecto Final — Desarrollo de Aplicaciones Móviles  
Mayo 2026

---

> Disainer © 2026 — Todos los derechos reservados.