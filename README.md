# Ahmed Lhaouchi Briki - Full Stack Developer Portfolio

Bienvenido al repositorio de mi portfolio personal. Este proyecto es una experiencia interactiva en 3D diseñada para mostrar mi stack tecnológico, experiencia y proyectos reales de forma inmersiva.

[🌐 **Ver Portfolio Online**](https://AhmedLB05.github.io/portfolio-ahmed)

## 🚀 Características Técnicas

Este portfolio no es solo una página de presentación, sino una demostración técnica en sí misma:

- **Framework:** Construido con **Next.js 16** (App Router) y React.
- **Renderizado 3D (WebGL):** El héroe de la página es un teclado mecánico interactivo completamente renderizado en 3D usando **Three.js** y **React Three Fiber**. Las teclas reaccionan físicamente al scroll y a la interacción del usuario.
- **Animaciones y Físicas:**
  - Sistema de sonido posicional utilizando la Web Audio API (samples de interruptores mecánicos con `detuning` dinámico).
  - Efectos de "Travelling Wave" basados en funciones trigonométricas (seno/coseno) sobre las teclas activas.
- **Temas Dinámicos:** Soporte para 4 temas estacionales (Invierno, Primavera, Verano, Otoño) que cambian variables CSS y la iluminación de la escena 3D en tiempo real.
- **Despliegue:** CI/CD automatizado con **GitHub Actions** hacia **GitHub Pages**.

## 💻 Tech Stack

El teclado 3D representa de forma interactiva mi stack principal:

- **Frontend & Mobile:** React, Next.js, Angular, Flutter, JavaScript, TypeScript
- **Backend:** Node.js, NestJS, Spring Boot (Java), GraphQL, REST APIs
- **Infraestructura & DevOps:** Docker, Kubernetes, PostgreSQL, MySQL, Redis, AWS
- **Calidad:** Jest, JUnit 5, CI/CD pipelines

## 📂 Proyectos Destacados

Puedes encontrar el código de mis proyectos principales en mi perfil de GitHub:

1. **[Ultimate FIFA App](https://github.com/AhmedLB05/Ultimate-Fifa-App):** App móvil End-to-End con AWS, Spring Boot y Flutter.
2. **[CrossFit REST API](https://github.com/AhmedLB05/CrossFit_API_Backend-Mejoras):** Backend robusto con Node.js, Express y operaciones CRUD completas.
3. **[WEB-AUDIOGUIA-AHMED](https://github.com/AhmedLB05/WEB-AUDIOGUIA-AHMED):** Panel de administración web para audioguías de museos.

## 🛠️ Desarrollo Local

Si quieres ejecutar este proyecto en tu máquina local:

```bash
# Instalar dependencias
npm install

# Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---
*Diseñado con el motor original de [Txemalon](https://github.com/Txemalon/3d-portfolio).*
