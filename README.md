# Laboratorio 11 - Componentes y Estilización con Next.js y shadcn/ui

## Descripción
Este proyecto consiste en un Dashboard de Gestión de Proyectos empresarial, desarrollado como parte del Laboratorio 11 de la asignatura Desarrollo de Aplicaciones Web Avanzado. La aplicación implementa una interfaz moderna y reactiva utilizando el stack tecnológico más reciente de React y Next.js, integrando componentes de alta calidad de shadcn/ui y gestionando la lógica de negocio mediante estado en memoria.

## Objetivo del laboratorio
Diseñar y construir interfaces de usuario profesionales, modulares y funcionales utilizando herramientas de estilización avanzadas como Tailwind CSS y componentes reutilizables basados en Radix UI a través de shadcn/ui. El enfoque principal es la correcta arquitectura de componentes, el manejo de estados complejos y la validación de formularios.

## Tecnologías utilizadas
- **Next.js 16.2.6**: Framework de React con soporte para Turbopack y App Router.
- **React 19**: Biblioteca para la construcción de interfaces de usuario.
- **TypeScript**: Superset de JavaScript para tipado estático y robustez del código.
- **Tailwind CSS 4**: Framework de utilidades CSS para un diseño rápido y personalizado.
- **shadcn/ui**: Colección de componentes de UI reutilizables y accesibles.
- **Radix UI / Base UI**: Primitivas de componentes para la base de shadcn/ui.
- **react-day-picker v10**: Biblioteca para la gestión de calendarios y selección de fechas.
- **Lucide React**: Set de iconos vectoriales consistentes.
- **Vercel**: Plataforma optimizada para el despliegue de aplicaciones Next.js.

## Funcionalidades principales
- **Dashboard Modular**: Navegación fluida mediante pestañas para diferentes secciones del sistema.
- **Resumen con Métricas Dinámicas**: Visualización en tiempo real de estadísticas como total de proyectos, tareas completadas, miembros activos y progreso promedio.
- **CRUD de Proyectos**:
  - Creación y edición de proyectos con validaciones.
  - Asignación dinámica de miembros del equipo.
  - Vista detallada de cada proyecto.
  - Eliminación segura de proyectos y sus dependencias.
- **CRUD de Equipo**:
  - Gestión completa de miembros (userId, role, name, email, position, birthdate, phone, projectId, isActive).
  - Integración de calendario para selección de fecha de nacimiento.
- **CRUD de Tareas**:
  - Gestión de tareas con campos de prioridad, estado y fecha límite.
  - **Paginación funcional**: Navegación entre grandes listas de tareas con configuración de filas por página.
- **Sistema de Feedback**:
  - **Spinner**: Indicadores de carga para simular peticiones asíncronas al backend.
  - **Alerts**: Mensajes visuales para validación de formularios y confirmación de acciones.
- **Configuración Personalizada**: Formulario para simular ajustes de la aplicación (nombre, vista inicial, paginación).
- **Tema Personalizado**: Implementación de un tema visual basado en tonos índigo/violeta mediante variables CSS de Tailwind.

## Estructura del proyecto
- `app/`: Contiene la lógica de rutas y páginas (App Router).
- `app/dashboard/`: Página principal del sistema.
- `components/`: Componentes de negocio reutilizables (Overview, Project, Team, Task, Settings).
- `components/ui/`: Componentes base de shadcn/ui altamente personalizables.
- `lib/`: Utilidades y configuraciones globales.
- `types/`: Definiciones de tipos TypeScript para todo el proyecto.
- `public/`: Recursos estáticos de la aplicación.

## Instalación
Para instalar las dependencias del proyecto, ejecute:
```bash
npm install
```

## Ejecución en desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Compilación para producción
Para generar el build optimizado de producción:
```bash
npm run build
```

## Ejecución en producción local
Para ejecutar la versión de producción localmente:
```bash
npm run start
```

## Ruta principal
Una vez iniciado el servidor, acceda a:
[http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Despliegue en Vercel
1. Subir el proyecto a un repositorio de **GitHub**.
2. En el dashboard de **Vercel**, seleccionar "New Project".
3. Importar el repositorio correspondiente.
4. Asegurarse de que el framework detectado sea **Next.js**.
5. Verificar que el comando de build sea `npm run build`.
6. Hacer clic en **Deploy**.

## Evidencias sugeridas
- **Dashboard**: Vista principal en la pestaña Resumen con métricas actualizadas.
- **Proyectos**: Listado de proyectos, formulario de creación y vista de detalles.
- **Equipo**: Tabla CRUD de miembros con validaciones y alertas.
- **Tareas**: Lista de tareas con paginación funcional y estados visuales.
- **Configuración**: Formulario de preferencias aplicado en tiempo real.
- **Calendario**: Selector de fechas integrado en los formularios de equipo y tareas.
- **Carga**: Spinner de carga visible durante las acciones de simulación.

## Autor
**Diego Meza** - Estudiante de Desarrollo de Aplicaciones Web Avanzado.
