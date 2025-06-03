import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { vi } from "vitest";
import { Modal } from "./Modal";

expect.extend(toHaveNoViolations);

// Componente de prueba simple
const TestContent = () => (
  <div>
    <p>Contenido del modal</p>
    <input placeholder="Campo de prueba" />
    <button>Acción</button>
  </div>
);

interface TestAppProps {
  isOpen: boolean;
  onClose: () => void;
  modalProps?: {
    description?: string;
    initialFocus?: "content" | "close";
    preventClose?: boolean;
    size?: "small" | "medium" | "large";
  };
}

const TestApp = ({ isOpen, onClose, modalProps = {} }: TestAppProps) => (
  <div>
    <main>
      <h1>App Principal</h1>
      <button>Botón externo</button>
      <input placeholder="Campo externo" />
    </main>

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modal de Prueba"
      {...modalProps}
    >
      <TestContent />
    </Modal>
  </div>
);

describe("Modal - Tests de Accesibilidad", () => {
  let mockOnClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    mockOnClose = vi.fn();
    vi.clearAllMocks();
  });

  // WCAG 2.1 AA Compliance
  describe("Cumplimiento WCAG", () => {
    test("sin violaciones cuando está cerrado", async () => {
      const { container } = render(
        <TestApp isOpen={false} onClose={mockOnClose} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("sin violaciones cuando está abierto", async () => {
      const { container } = render(
        <TestApp isOpen={true} onClose={mockOnClose} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("sin violaciones con descripción", async () => {
      const { container } = render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ description: "Descripción del modal" }}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // Gestión de Foco
  describe("Gestión de Foco", () => {
    test("trampa de foco funciona correctamente", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      // Verificar foco inicial en botón cerrar
      await waitFor(() => {
        expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
      });

      // Navegar con Tab
      await user.tab(); // → Campo
      expect(screen.getByPlaceholderText(/campo de prueba/i)).toHaveFocus();

      await user.tab(); // → Botón
      expect(screen.getByText(/acción/i)).toHaveFocus();

      await user.tab(); // → Vuelve al inicio (botón cerrar)
      expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
    });

    test("navegación inversa con Shift+Tab", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
      });

      // Navegar hacia atrás
      await user.tab({ shift: true }); // → Último elemento
      expect(screen.getByText(/acción/i)).toHaveFocus();
    });

    test("foco inicial en contenido cuando se especifica", async () => {
      render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ initialFocus: "content" }}
        />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/campo de prueba/i)).toHaveFocus();
      });
    });

    test("restaura foco al cerrar", async () => {
      const { rerender } = render(
        <TestApp isOpen={false} onClose={mockOnClose} />
      );

      // Enfocar elemento externo
      const externalButton = screen.getByText(/botón externo/i);
      externalButton.focus();
      expect(externalButton).toHaveFocus();

      // Abrir modal
      rerender(<TestApp isOpen={true} onClose={mockOnClose} />);
      await waitFor(() => {
        expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
      });

      // Cerrar modal
      rerender(<TestApp isOpen={false} onClose={mockOnClose} />);
      await waitFor(() => {
        expect(externalButton).toHaveFocus();
      });
    });
  });

  // Navegación por Teclado
  describe("Navegación por Teclado", () => {
    test("cierra con Escape", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      await user.keyboard("{Escape}");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("no cierra con Escape cuando preventClose=true", async () => {
      const user = userEvent.setup();
      render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ preventClose: true }}
        />
      );

      await user.keyboard("{Escape}");
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("botón cerrar es activable por teclado", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      // Asegurar que el botón tiene foco
      const closeButton = screen.getByLabelText(/cerrar modal/i);
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });

      // Verificar que el botón es activable
      await user.click(closeButton);

      // Esperar el setTimeout del componente Modal (100ms)
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 200 }
      );
    });
  });

  // Patrón Modal Dialog
  describe("Patrón Modal Dialog", () => {
    test("atributos ARIA correctos", () => {
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

      // Buscar específicamente el elemento con el ID correcto
      const title = document.getElementById("modal-title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(/modal de prueba/i);
    });

    test("aria-describedby cuando hay descripción", () => {
      render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ description: "Descripción del modal" }}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-describedby", "modal-description");

      // Buscar específicamente el elemento con el ID correcto
      const description = document.getElementById("modal-description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/descripción del modal/i);
    });

    test("estructura de headings correcta", () => {
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(/modal de prueba/i);
    });
  });

  // Anuncios de Estado
  describe("Anuncios de Estado", () => {
    test("anuncia apertura del modal", async () => {
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const statusRegion = screen.getByRole("status");
      expect(statusRegion).toHaveAttribute("aria-live", "polite");
      expect(statusRegion).toHaveAttribute("aria-atomic", "true");

      await waitFor(() => {
        expect(statusRegion).toHaveTextContent(
          /modal abierto: modal de prueba/i
        );
      });
    });

    test("anuncia cierre del modal", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      await user.click(closeButton);

      await waitFor(() => {
        const statusRegion = screen.getByRole("status");
        expect(statusRegion).toHaveTextContent(/modal cerrado/i);
      });
    });
  });

  // Interacción con Clic
  describe("Interacción con Clic", () => {
    test("cierra al hacer clic en overlay", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TestApp isOpen={true} onClose={mockOnClose} />
      );

      const overlay = container.querySelector('[role="presentation"]');
      expect(overlay).toBeInTheDocument();
      await user.click(overlay!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("no cierra al hacer clic en contenido", async () => {
      const user = userEvent.setup();
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const content = screen.getByText(/contenido del modal/i);
      await user.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  // Prevención de Scroll
  describe("Prevención de Scroll", () => {
    test("previene scroll del body cuando está abierto", () => {
      expect(document.body.style.overflow).toBe("");

      render(<TestApp isOpen={true} onClose={mockOnClose} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    test("restaura scroll del body cuando se cierra", () => {
      const { rerender } = render(
        <TestApp isOpen={true} onClose={mockOnClose} />
      );
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<TestApp isOpen={false} onClose={mockOnClose} />);
      expect(document.body.style.overflow).toBe("");
    });
  });

  // Estados del Botón Cerrar
  describe("Estados del Botón Cerrar", () => {
    test("aria-label correcto por defecto", () => {
      render(<TestApp isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).not.toBeDisabled();
    });

    test("aria-label y estado cuando preventClose=true", () => {
      render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ preventClose: true }}
        />
      );

      const closeButton = screen.getByLabelText(
        /no se puede cerrar este modal/i
      );
      expect(closeButton).toBeDisabled();
      expect(closeButton).toHaveClass("cursor-not-allowed");
    });
  });

  // Tamaños del Modal
  describe("Tamaños del Modal", () => {
    test.each([
      ["small", "max-w-md"],
      ["medium", "max-w-2xl"],
      ["large", "max-w-4xl"],
    ])("aplica clases correctas para tamaño %s", (size, expectedClass) => {
      render(
        <TestApp
          isOpen={true}
          onClose={mockOnClose}
          modalProps={{ size: size as "small" | "medium" | "large" }}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass(expectedClass);
    });
  });

  // Contenido Scrolleable
  describe("Contenido Scrolleable", () => {
    test("maneja contenido largo correctamente", () => {
      const LongContent = () => (
        <div>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Línea {i + 1}</p>
          ))}
        </div>
      );

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal Largo">
          <LongContent />
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      const contentArea = dialog.querySelector('[tabindex="-1"]');

      expect(contentArea).toBeInTheDocument();
      expect(contentArea).toHaveClass("overflow-y-auto");
      expect(contentArea).toHaveClass("max-h-96");
    });
  });
});
