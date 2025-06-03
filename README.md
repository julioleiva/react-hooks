# Guía de Estrategias de Testing en Frontend

En el desarrollo moderno de aplicaciones web, asegurar la calidad, funcionalidad y accesibilidad es crucial. Utilizamos diversas estrategias de testing, cada una con un propósito y alcance específico. Este documento describe tres tipos principales de pruebas que empleamos: Pruebas de Accesibilidad con Axe, Pruebas Unitarias con Vitest, y Pruebas de Integración con Testing Library y Vitest.

## Tabla Comparativa Rápida

| Característica         | Accesibilidad (Axe)                   | Unitarias (Vitest)                       | Integración (Testing Library + Vitest)     |
| :--------------------- | :------------------------------------ | :--------------------------------------- | :----------------------------------------- |
| **Objetivo Principal** | Asegurar usabilidad para todos        | Verificar unidades de código aisladas    | Verificar interacción entre componentes    |
| **Enfoque**            | Cumplimiento WCAG, ARIA, etc.         | Lógica interna de funciones/componentes  | Comportamiento del usuario, flujo de datos |
| **Alcance**            | Componentes renderizados, páginas     | Funciones, módulos, componentes aislados | Grupos de componentes, vistas parciales    |
| **Velocidad**          | Rápida a Media                        | Muy Rápida                               | Media a Lenta                              |
| **Herramientas Clave** | `axe-core`, `jest-axe`, wrappers      | Vitest                                   | `@testing-library/*`, Vitest               |
| **Confianza en...**    | Inclusividad, cumplimiento legal      | Correctitud de la lógica individual      | Correctitud de las interacciones y UI      |
| **¿Qué simula?**       | Auditoría de accesibilidad automática | Llamadas directas a código               | Interacciones del usuario con la UI        |

---

## 1. Pruebas de Accesibilidad con Axe

### ¿Qué son?

Las pruebas de accesibilidad se centran en asegurar que tu aplicación web sea usable por el mayor número de personas posible, incluyendo aquellas con discapacidades (visuales, auditivas, motoras, cognitivas, etc.). **Axe** (`axe-core`) es un motor de reglas de accesibilidad que audita automáticamente el HTML renderizado en busca de violaciones de los estándares de accesibilidad como las Web Content Accessibility Guidelines (WCAG).

### ¿Qué prueban?

- **Contraste de color:** Si el texto tiene suficiente contraste con su fondo.
- **Atributos ARIA:** Uso correcto de roles y atributos ARIA para mejorar la semántica para tecnologías de asistencia.
- **Navegación por teclado:** Si todos los elementos interactivos son accesibles y operables mediante el teclado.
- **Etiquetas de formulario:** Si los campos de entrada tienen etiquetas asociadas correctamente.
- **Texto alternativo para imágenes:** Si las imágenes tienen descripciones `alt` adecuadas.
- **Estructura semántica del HTML:** Uso correcto de encabezados, landmarks, listas, etc.
- Y muchas otras reglas definidas por WCAG AA y AAA.

### ¿Cómo se ejecutan típicamente?

Axe puede integrarse en diversos flujos de trabajo:

- **Extensiones de navegador:** Para auditorías manuales rápidas durante el desarrollo.
- **Herramientas de línea de comandos:** Para escanear sitios completos.
- **Integración con frameworks de testing (como Vitest o Jest usando `jest-axe` o similar):** Permite ejecutar comprobaciones de accesibilidad como parte de tus suites de pruebas unitarias o de integración, típicamente después de renderizar un componente o una página.

**Ejemplo conceptual con `jest-axe` (adaptable a Vitest):**

```javascript
// Dentro de un test de componente con Testing Library
import { render } from "@testing-library/react"; // o vue, svelte, etc.
import { axe, toHaveNoViolations } from "jest-axe"; // o una utilidad similar para Vitest
import MyComponent from "./MyComponent";

expect.extend(toHaveNoViolations);

it("debería no tener violaciones de accesibilidad aXe detectables automáticamente", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Beneficios:

- Ayuda a crear aplicaciones más inclusivas.
- Puede ayudar a cumplir con requisitos legales y estándares de la industria.
- Detecta problemas comunes de accesibilidad de forma temprana.

---

## 2. Pruebas Unitarias con Vitest

### ¿Qué son?

Las pruebas unitarias se enfocan en la unidad más pequeña de código testable, como una función, un método de una clase, o un componente aislado (con sus dependencias mockeadas). **Vitest** es un framework de testing moderno, rápido y compatible con la API de Jest, diseñado para proyectos que usan Vite.

### ¿Qué prueban?

- **Lógica de funciones puras:** Dado un input, ¿produce el output esperado?
- **Renderizado condicional simple de componentes:** ¿Renderiza el texto/elemento correcto bajo ciertas props (sin interacciones complejas)?
- **Manejo de estado interno simple de un componente:** ¿Cambia el estado como se espera ante una llamada a un método interno (no una interacción de usuario)?
- **Correctitud de algoritmos y cálculos.**

### ¿Cómo se ejecutan típicamente?

Se escriben archivos de prueba (ej. `miFuncion.test.ts` o `MiComponente.test.tsx`) que importan la unidad a probar, la ejecutan con diferentes entradas o estados, y usan aserciones (ej. `expect(resultado).toBe(esperado)`) para verificar el comportamiento. Las dependencias externas suelen ser "mockeadas" o "stubbed" para aislar la unidad.

**Ejemplo conceptual con Vitest para una función:**

```typescript
// utils/math.ts
export function sum(a: number, b: number): number {
  return a + b;
}

// utils/math.test.ts
import { describe, it, expect } from "vitest";
import { sum } from "./math";

describe("sum", () => {
  it("debería sumar dos números correctamente", () => {
    expect(sum(1, 2)).toBe(3);
  });

  it("debería manejar números negativos", () => {
    expect(sum(-1, -1)).toBe(-2);
  });
});
```

### Beneficios:

- **Rápidas de ejecutar:** Permiten feedback casi instantáneo.
- **Fáciles de depurar:** Si una prueba falla, el problema está localizado en una pequeña unidad.
- **Documentación viva:** Las pruebas describen cómo se espera que funcione cada unidad.
- **Facilitan la refactorización:** Permiten cambiar el código con confianza, sabiendo que las pruebas alertarán si se rompe algo.

---

## 3. Pruebas de Integración con Testing Library y Vitest

### ¿Qué son?

Las pruebas de integración verifican cómo múltiples unidades (componentes, módulos, servicios) trabajan juntas. En el contexto de frontend, esto a menudo significa probar cómo interactúan los componentes entre sí o cómo un componente responde a las interacciones del usuario y actualiza la UI. **Testing Library** (ej. `@testing-library/react`, `@testing-library/vue`, `@testing-library/dom`) es una familia de utilidades que promueve probar los componentes de la manera en que los usuarios los usan. **Vitest** se utiliza aquí como el motor o "runner" para ejecutar estas pruebas.

### ¿Qué prueban?

- **Interacción entre componentes:** ¿Un clic en un botón en el Componente A actualiza correctamente el estado o la vista en el Componente B?
- **Flujos de usuario a pequeña escala:** Rellenar un formulario y enviarlo, navegar entre vistas simples dentro de un grupo de componentes.
- **Renderizado de componentes con props reales y estado compartido (si aplica).**
- **Que la UI se actualice como el usuario esperaría tras una acción.**

### ¿Cómo se ejecutan típicamente?

Se renderiza un componente (o un árbol de componentes) y se utilizan las utilidades de Testing Library para encontrar elementos en el DOM (de forma accesible, como lo haría un usuario) y simular eventos de usuario (clics, escritura en campos, etc.). Luego, se hacen aserciones sobre el estado resultante de la UI (ej. si apareció un texto, si un elemento se deshabilitó, etc.).

**Ejemplo conceptual con Testing Library y Vitest (para un componente React):**

```typescript
// components/Counter.tsx (ejemplo simple)
import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}

// components/Counter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("debería renderizar el contador inicial en 0", () => {
    render(<Counter />);
    expect(screen.getByText("Contador: 0")).toBeInTheDocument();
  });

  it("debería incrementar el contador al hacer clic en el botón", () => {
    render(<Counter />);
    const button = screen.getByRole("button", { name: /incrementar/i });
    fireEvent.click(button);
    expect(screen.getByText("Contador: 1")).toBeInTheDocument();
  });
});
```

### Beneficios:

- **Mayor confianza:** Prueban que las partes de la aplicación funcionan juntas correctamente.
- **Pruebas más realistas:** Se enfocan en el comportamiento desde la perspectiva del usuario.
- **Menos frágiles a cambios de implementación:** Testing Library anima a seleccionar elementos de formas que no dependen de detalles internos del componente, haciendo las pruebas más robustas a refactorizaciones.

---

## Conclusión: ¿Cuándo usar cuál?

Estas estrategias de testing no son mutuamente excluyentes; son complementarias y juntas forman una sólida pirámide de testing:

- **Pruebas Unitarias (base amplia):** Para la lógica fundamental y componentes muy simples. Son rápidas y aíslan problemas.
- **Pruebas de Integración (medio):** Para flujos de usuario, interacciones entre componentes y asegurar que la UI se comporta como se espera. Proporcionan más confianza que las unitarias solas.
- **Pruebas de Accesibilidad (en todas las capas):** Deben aplicarse continuamente. Axe puede integrarse tanto en pruebas de componentes (unitarias/integración) como en pruebas E2E (End-to-End) más amplias para asegurar la inclusividad.
- _(Opcional) Pruebas E2E (cima estrecha):_ Prueban la aplicación completa desde el punto de vista del usuario, a través del navegador. Son las más lentas y costosas, pero dan la mayor confianza en el sistema global. (No cubiertas en detalle aquí, pero son el siguiente paso lógico).

Al combinar estas aproximaciones, puedes construir aplicaciones web más robustas, mantenibles e inclusivas.

```

**Puntos clave de la explicación:**

* **Axe:** Enfocado en la accesibilidad, audita el HTML renderizado contra estándares (WCAG).
* **Vitest (Unitarias):** Enfocado en unidades aisladas (funciones, componentes simples con mocks). Valida la lógica interna. Vitest es el corredor y el framework de aserción.
* **Testing Library + Vitest (Integración):** Enfocado en cómo los componentes trabajan juntos y responden a interacciones del usuario. Testing Library provee utilidades para interactuar con la UI como un usuario, y Vitest ejecuta estas pruebas.
```
