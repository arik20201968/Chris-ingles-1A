# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [2.0.0] - 2026-08-26

### 🎨 Mejoras de Diseño (Impeccable)

#### Efectos Visuales Añadidos
- ✨ **Efecto Ripple** en botones primarios con overlay animado
- ✨ **Efecto Shimmer** en tarjetas de módulos al hacer hover
- ✨ **Microinteracciones** mejoradas en todos los botones con pseudo-elementos
- ✨ **Animaciones de entrada** refinadas con fadeIn suave
- ✨ **Gradientes sutiles** con mejor definición de colores

#### Componentes Nuevos
- 🔔 **Sistema de Notificaciones Toast** con 3 variantes (success, warning, info)
- 🎯 **Estados de foco visible** mejorados para navegación por teclado
- 🎨 **Sombras refinadas** con mejor profundidad y jerarquía visual

### ♿ Mejoras de Accesibilidad

#### Atributos ARIA Implementados
- `aria-expanded` en botones de acordeón de módulos
- `aria-label` descriptivos en todos los botones interactivos
- `aria-current="page"` en lección activa
- `aria-busy` en estados de carga de audio
- `aria-live="polite"` en notificaciones y progreso
- `role="progressbar"` con `aria-valuenow` dinámico
- `role="alert"` en notificaciones toast

#### Navegación por Teclado
- 🔗 **Skip to main content** link para saltar navegación
- ⌨️ **Focus visible** con outline de 3px en color brand
- 🎹 Estados de foco en todos los elementos interactivos

#### Soporte de Preferencias del Usuario
- 🎬 `prefers-reduced-motion`: Deshabilita animaciones si el usuario lo prefiere
- 🌗 `prefers-contrast: high`: Aumenta contraste de textos automáticamente
- 🖨️ Estilos de impresión optimizados para lecciones

### 🐛 Bugs Corregidos

#### CSS
- ✅ Completado de reglas responsive faltantes en media queries
- ✅ Corregido overflow en tarjetas de módulos
- ✅ Añadidos breakpoints adicionales para tablets pequeñas

#### JavaScript
- ✅ Función `escapeHtml` reescrita usando DOM API (más segura)
- ✅ Manejo de errores mejorado en `speakText()`
- ✅ Try-catch en síntesis de voz para capturar excepciones
- ✅ Validación de tipo en `escapeHtml` para prevenir crashes
- ✅ Estados disabled en botones de audio durante reproducción

#### HTML
- ✅ Añadidos atributos semánticos faltantes
- ✅ Mejorada estructura con roles ARIA
- ✅ Skip link añadido al inicio del body

### 🚀 Nuevas Funcionalidades

#### Sistema de Notificaciones
```javascript
showNotification(message, type)
// type: 'success' | 'warning' | 'info'
```
- Animación de entrada suave desde abajo
- Auto-desaparece después de 4 segundos
- Posicionamiento centrado responsive
- Accesible con `role="alert"`

#### Feedback Mejorado
- 🎉 Notificación al completar lección
- ⚠️ Notificación si el navegador no soporta audio
- ✅ Notificación al activar/desactivar audio
- 📢 Mensajes de error amigables en síntesis de voz

### 📚 Documentación

#### Archivos Nuevos
- `CHANGELOG.md`: Este archivo
- `README.md`: Completamente reescrito con detalles técnicos

#### README Actualizado
- Sección de características ampliada
- Documentación de sistema de diseño
- Lista completa de correcciones
- Guía de instalación y uso
- Requisitos del sistema
- Créditos y versión

### 🎯 Mejoras de UX

#### Interacciones
- Botones con estados disabled claros
- Spinner de carga en botones de audio
- Mejor feedback visual en hover
- Transiciones más suaves
- Animaciones con spring easing

#### Visual
- Jerarquía mejorada con tamaños de fuente ajustados
- Espaciado más consistente
- Colores más vibrantes en modo oscuro
- Sombras con glow en elementos brand

### 🔧 Mejoras Técnicas

#### Performance
- Animaciones optimizadas con `will-change` implícito
- Transiciones con hardware acceleration
- Uso eficiente de pseudo-elementos

#### Código
- Comentarios mejorados en funciones críticas
- Separación clara de responsabilidades
- Manejo robusto de errores
- Validaciones de entrada

#### CSS
- Variables CSS mejor organizadas
- Sistema de utilidades añadido
- Media queries consolidadas
- Mejor especificidad

### 📦 Archivos Modificados

```
index.html          # Atributos ARIA y skip link
app.js              # Notificaciones y mejoras de accesibilidad
styles.css          # Efectos visuales y accesibilidad
README.md           # Completamente reescrito
CHANGELOG.md        # Nuevo archivo
```

---

## [1.0.0] - Versión Inicial

### Características
- 5 módulos con 20 lecciones
- Sistema de progreso con localStorage
- Modo claro/oscuro
- Diseño responsive
- Síntesis de voz Web Speech API
- Efectos de confetti
- Búsqueda de lecciones
- Navegación con sidebar

---

## Leyenda

- ✨ Nueva característica
- 🐛 Corrección de bug
- ♿ Mejora de accesibilidad
- 🎨 Mejora visual
- 📚 Documentación
- 🔧 Mejora técnica
- 🚀 Nueva funcionalidad
- ⚡ Mejora de performance
