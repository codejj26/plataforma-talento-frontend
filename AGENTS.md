# AGENTS.md — Plataforma de Talento Estudiantil (Frontend)

Guía de convenciones para agentes y desarrolladores que trabajen en este repositorio.

## Stack

- **Framework:** Angular 19 (standalone components, signals, control flow `@if/@for`)
- **Estilos:** Tailwind CSS v4 (vía PostCSS, sin `tailwind.config.js` — el tema vive en `src/styles.css` con `@theme`)
- **Auth:** Keycloak (flujo Authorization Code + PKCE), envuelto en `AuthService`
- **Estado:** Signals de Angular (`signal()` / `input()`), sin NgRx ni librerías externas
- **API:** `ApiService` agrupa todas las llamadas HTTP hacia el backend .NET

## Estructura de carpetas

```
src/
├── app/
│   ├── core/                    # Infraestructura transversal
│   │   ├── services/            #   AuthService, ApiService (y tipos DTO)
│   │   ├── guards/              #   roleGuard
│   │   ├── interceptors/        #   authInterceptor (Bearer token)
│   │   └── providers/           #   provideKeycloakInit
│   ├── layout/                  # Componentes de layout (navbar, footer)
│   │   ├── navbar/
│   │   └── footer/
│   ├── shared/
│   │   └── components/          # Componentes globales reutilizables
│   │       ├── button/ badge/ card/ input/ campo/ alert/
│   │       ├── icon/ spinner/ empty-state/ page-header/ metric-card/
│   │       └── index.ts         # Barrel de exportación
│   └── pages/                   # Una carpeta por ruta (lazy loaded)
│       ├── inicio/ ofertas/ perfil/ portafolio/
│       └── prototipos/ postulaciones/ reportes/
├── environments/                # environment.ts / environment.production.ts
└── styles.css                   # Tema Tailwind (colores brand, tipografías)
```

## Reglas obligatorias

### Componentes

1. **Archivos separados:** cada componente tiene `.ts`, `.html` y `.css` propios (nada de templates/estilos inline en el decorador).
2. **Standalone:** todos los componentes son `standalone: true` y se importan donde se usan.
3. **Selector por convención:** `app-<nombre>`; atributos directivos como `appButton` solo para extensiones de elementos nativos (`button[appButton]`, `input[appInput]`).
4. **Señales para el estado:** usar `input()` para entradas y `signal()` para estado interno; nunca `@Input()` decorator.
5. **Nada de lógica de negocio en el template:** las condiciones complejas y los mapeos (ej. color de badge por estado) van en el `.ts`.

### Estilos

6. **Tailwind en el template:** las clases utilitarias van en el HTML.
7. **CSS por componente solo para:** `:host`, estados hover/active, animaciones y lo que no se pueda expresar con utilidades.
8. **Tema:** usar siempre la paleta `brand` (azul institucional) definida en `src/styles.css`. Prohibido colores hardcodeados en componentes.
9. **Clases globales reutilizables** (definidas en `styles.css`): `contenedor`, `etiqueta`, `etiqueta-{verde|ambar|roja|azul|gris}`, `shadow-card`, `shadow-card-hover`.

### Reutilización

10. **Antes de crear un componente, revisar `shared/components`.** Si algo se usa en 2+ páginas (botón, tarjeta, badge, alert, icono, campo de formulario), debe ser un componente compartido.
11. **Nuevos componentes compartidos** van en `shared/components/<nombre>/` con sus 3 archivos y se exportan en `index.ts`.
12. **Usar componentes compartidos siempre que existan:** `app-button`, `app-card`, `app-badge`, `app-alert`, `app-icon`, `app-campo` + `appInput`, `app-empty-state`, `app-page-header`, `app-metric-card`, `app-spinner`.

### Core y páginas

13. **Core no importa desde pages/shared** (salvo tipos); las páginas importan desde `core` (barrel `core/index.ts`) o rutas directas a `core/services/...`.
14. **Páginas lazy-load** vía `loadComponent` en `app.routes.ts`, con `roleGuard` y `data.roles` para protegerlas.
15. **Idioma:** todo el contenido de UI está en español; nombres de métodos y variables en español.

### Calidad

16. **Verificar con build** antes de terminar: `npm run build` (o `ng build`).
17. **No dejar archivos muertos:** al reubicar/eliminar un archivo, actualizar imports y borrar el original.
18. **Comentarios JSDoc** solo para explicar el "porqué" (contratos de API, flujos de auth); no comentar lo obvio.
