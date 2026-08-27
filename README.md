# 📚 Curso Interactivo de Inglés A1

## Descripción
Aplicación web interactiva para aprender inglés desde nivel principiante (A1). Incluye 5 módulos con 20 lecciones completas, ejercicios prácticos y pronunciación con audio nativo mediante síntesis de voz.

## ✨ Características Principales

### 🎯 Contenido Educativo
- **5 Módulos Progresivos**: Desde fundamentos hasta nivel avanzado A1
- **20 Lecciones Completas**: Con teoría, ejemplos y ejercicios prácticos
- **100+ Ejercicios Interactivos**: Para practicar lo aprendido
- **Pronunciación con Audio**: Síntesis de voz en inglés para cada palabra y frase

### 🎨 Diseño Moderno (Impeccable UI)
- **Modo Claro/Oscuro**: Cambia entre temas según tu preferencia
- **Diseño Responsive**: Optimizado para móvil, tablet y escritorio
- **Animaciones Fluidas**: Microinteracciones que mejoran la experiencia
- **Efectos de Confetti**: Celebración al completar lecciones
- **Sistema de Notificaciones Toast**: Feedback visual inmediato

### ♿ Accesibilidad (WCAG 2.1)
- **Navegación por Teclado**: Completa con indicadores de foco visibles
- **Atributos ARIA**: Para lectores de pantalla
- **Skip to Content**: Enlace de acceso rápido al contenido principal
- **Alto Contraste**: Cumple con estándares WCAG AA
- **Reducción de Movimiento**: Respeta preferencias del usuario
- **Progressbar con Estados**: Actualizaciones en tiempo real accesibles

### 📊 Sistema de Progreso
- **Seguimiento Local**: Guarda tu progreso en localStorage
- **Barra de Progreso Visual**: Muestra avance general del curso
- **Indicadores por Módulo**: Progreso individual de cada módulo
- **Marcadores de Completado**: Visualiza qué lecciones ya terminaste

### 🔍 Búsqueda y Navegación
- **Búsqueda en Tiempo Real**: Encuentra lecciones por nombre o tema
- **Acordeones de Módulos**: Organización clara y colapsable
- **Sidebar Responsive**: Se convierte en drawer móvil
- **Breadcrumbs**: Siempre sabes dónde estás

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript Vanilla**: Sin dependencias externas
- **Web Speech API**: Para síntesis de voz
- **Canvas API**: Para efectos de confetti
- **LocalStorage**: Persistencia de datos

## 📦 Estructura del Proyecto

```
ingles-yuli-A1/
├── index.html           # Página principal
├── app.js              # Lógica de la aplicación
├── styles.css          # Estilos globales y componentes
├── lessons-data.js     # Contenido de las lecciones
└── README.md           # Documentación
```

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primary**: Gradiente púrpura-índigo (#5850ec → #7c3aed)
- **Success**: Verde esmeralda (#10b981)
- **Warning**: Ámbar (#f59e0b)
- **Info**: Azul cielo (#0ea5e9)

### Tipografía
- **Font Principal**: Plus Jakarta Sans (Google Fonts)
- **Tamaños**: Sistema escalable con variables CSS
- **Pesos**: 300, 400, 500, 600, 700, 800

### Espaciado y Layout
- **Sistema de 8px**: Base para márgenes y padding
- **Breakpoints Responsive**:
  - Desktop: > 960px
  - Tablet: 580px - 960px
  - Mobile: < 580px

## 🔧 Instalación y Uso

### Instalación Local
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador
3. ¡Comienza a aprender!

No requiere instalación de dependencias ni servidor. Es 100% cliente-side.

### Navegadores Compatibles
- ✅ Chrome/Edge (recomendado para mejor audio)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer: No soportado

### Requisitos del Sistema
- Navegador moderno con soporte ES6+
- JavaScript habilitado
- Audio/parlantes (opcional, para pronunciación)

## 📖 Estructura del Contenido

### Módulo 1: Fundamentos
1. Saludos y Despedidas
2. Alfabeto y Deletreo
3. Números 1-100 y La Hora
4. Colores y Objetos Cotidianos

### Módulo 2: Gramática Básica
1. Pronombres Personales y Verbo "To Be"
2. Artículos y Sustantivos
3. Adjetivos Posesivos
4. Preguntas con Wh-

### Módulo 3: Vocabulario Cotidiano
1. Familia y Relaciones
2. La Casa y Muebles
3. Profesiones y Trabajos
4. Países y Nacionalidades

### Módulo 4: Comunicación
1. Presente Simple (Afirmativo)
2. Presente Simple (Negativo e Interrogativo)
3. Rutinas Diarias
4. Adverbios de Frecuencia

### Módulo 5: Avanzado A1
1. Descripciones Personales
2. Lugares en la Ciudad
3. Comida y Bebidas
4. El Clima

## 🎯 Características Técnicas

### Performance
- Carga inicial rápida (< 2s)
- Sin dependencias externas pesadas
- Optimizado para móviles

### Seguridad
- Sin recopilación de datos
- Todo el progreso es local
- Sin cookies ni tracking

### Mantenibilidad
- Código modular y comentado
- Variables CSS para fácil personalización
- Estructura clara y escalable

## 🐛 Correcciones en Esta Versión

### Bugs Corregidos
- ✅ CSS completo (se agregaron reglas responsive faltantes)
- ✅ Función `escapeHtml` mejorada para prevenir XSS
- ✅ Manejo de errores en síntesis de voz
- ✅ Estados de carga en botones de audio

### Mejoras de Accesibilidad
- ✅ Atributos `aria-expanded` en acordeones
- ✅ `aria-label` descriptivos en todos los botones
- ✅ `role` y `aria-live` en notificaciones
- ✅ `aria-busy` en estados de carga
- ✅ `aria-current` en navegación activa
- ✅ Skip to main content link
- ✅ Focus visible mejorado
- ✅ Soporte para `prefers-reduced-motion`
- ✅ Soporte para `prefers-contrast: high`

### Mejoras de UX
- ✅ Sistema de notificaciones toast
- ✅ Feedback visual en completado de lecciones
- ✅ Efectos hover mejorados con microinteracciones
- ✅ Efecto shimmer en tarjetas de módulos
- ✅ Efecto ripple en botones primarios
- ✅ Estados disabled en botones de audio
- ✅ Mensajes de error amigables

### Mejoras de Diseño
- ✅ Animaciones más fluidas
- ✅ Sombras y profundidad refinadas
- ✅ Gradientes más sutiles
- ✅ Mejor jerarquía visual
- ✅ Estilos de impresión
- ✅ Utilidades CSS adicionales

## 🤝 Contribuciones

Este es un proyecto educativo. Si encuentras bugs o tienes sugerencias:
1. Documenta el problema con capturas
2. Describe los pasos para reproducirlo
3. Sugiere una solución si es posible

## 📄 Licencia

Proyecto educativo para uso personal y académico.

## 👥 Créditos

- **Diseño UI/UX**: Implementación con Impeccable Design System
- **Contenido**: Basado en curriculum CEFR A1
- **Tipografía**: Plus Jakarta Sans (Google Fonts)
- **Iconos**: Emojis Unicode nativos

---

**Versión**: 2.0.0 (Mejorada con Impeccable)
**Última actualización**: Agosto 2026

¡Disfruta aprendiendo inglés! 🚀📚✨
