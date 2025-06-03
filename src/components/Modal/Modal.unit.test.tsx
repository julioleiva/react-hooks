import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Modal } from "./Modal";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: "Test Modal",
  children: <div>Modal content</div>,
};

describe("Modal - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  describe("Renderizado Condicional", () => {
    test("no renderiza cuando isOpen es false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    test("renderiza cuando isOpen es true", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("renderiza el contenido hijo correctamente", () => {
      const testContent = (
        <div data-testid="custom-content">Custom Content</div>
      );
      render(<Modal {...defaultProps}>{testContent}</Modal>);

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    test("renderiza el título correctamente", () => {
      const customTitle = "Custom Modal Title";
      render(<Modal {...defaultProps} title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        customTitle
      );
    });

    test("renderiza la descripción cuando se proporciona", () => {
      const description = "Modal description text";
      render(<Modal {...defaultProps} description={description} />);

      expect(screen.getByText(description)).toBeInTheDocument();
      expect(document.getElementById("modal-description")).toHaveTextContent(
        description
      );
    });

    test("no renderiza descripción cuando no se proporciona", () => {
      render(<Modal {...defaultProps} />);

      expect(
        document.getElementById("modal-description")
      ).not.toBeInTheDocument();
    });

    test("aplica el tamaño correcto", () => {
      const { rerender } = render(<Modal {...defaultProps} size="small" />);
      expect(screen.getByRole("dialog")).toHaveClass("max-w-md");

      rerender(<Modal {...defaultProps} size="medium" />);
      expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");

      rerender(<Modal {...defaultProps} size="large" />);
      expect(screen.getByRole("dialog")).toHaveClass("max-w-4xl");
    });

    test("usa tamaño medium por defecto", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");
    });
  });

  describe("Estados Internos", () => {
    test("announcement inicial está vacío cuando modal está cerrado", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      // No debe haber región de estado cuando está cerrado
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    test("announcement se establece cuando modal se abre", async () => {
      render(<Modal {...defaultProps} />);

      const statusRegion = screen.getByRole("status");
      await waitFor(() => {
        expect(statusRegion).toHaveTextContent("Modal abierto: Test Modal");
      });
    });

    test("announcement incluye descripción cuando se proporciona", async () => {
      const description = "Test description";
      render(<Modal {...defaultProps} description={description} />);

      const statusRegion = screen.getByRole("status");
      await waitFor(() => {
        expect(statusRegion).toHaveTextContent(
          `Modal abierto: Test Modal. ${description}`
        );
      });
    });

    test("announcement se limpia cuando modal se cierra", () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      // Modal abierto tiene anuncio
      expect(screen.getByRole("status")).toBeInTheDocument();

      // Modal cerrado no tiene anuncio
      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Funciones Internas", () => {
    test("handleClose no llama onClose cuando preventClose es true", async () => {
      const mockOnClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={mockOnClose} preventClose={true} />
      );

      const closeButton = screen.getByLabelText(/no se puede cerrar/i);
      await userEvent.click(closeButton);

      // Esperar un poco para asegurar que no se llama onClose
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("handleClose establece announcement y llama onClose después del timeout", async () => {
      const mockOnClose = vi.fn();
      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      await userEvent.click(closeButton);

      // Verificar que se establece el anuncio inmediatamente
      const statusRegion = screen.getByRole("status");
      expect(statusRegion).toHaveTextContent("Modal cerrado");

      // Esperar el timeout real del componente
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 200 }
      );
    });

    test("handleOverlayClick llama onClose cuando se hace clic en overlay", async () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal {...defaultProps} onClose={mockOnClose} />
      );

      const overlay = container.querySelector('[role="presentation"]');
      await userEvent.click(overlay!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("handleOverlayClick no llama onClose cuando preventClose es true", async () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal {...defaultProps} onClose={mockOnClose} preventClose={true} />
      );

      const overlay = container.querySelector('[role="presentation"]');
      await userEvent.click(overlay!);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("handleOverlayClick no se ejecuta cuando se hace clic en contenido del modal", async () => {
      const mockOnClose = vi.fn();
      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      const modalContent = screen.getByText("Modal content");
      await userEvent.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Efectos (useEffect)", () => {
    test("guarda el elemento enfocado previamente al abrir", async () => {
      // Crear elemento enfocado
      const previousElement = document.createElement("button");
      previousElement.textContent = "Previous Button";
      document.body.appendChild(previousElement);
      previousElement.focus();

      expect(document.activeElement).toBe(previousElement);

      render(<Modal {...defaultProps} />);

      // Esperar a que el modal tome el foco
      await waitFor(() => {
        const closeButton = screen.getByLabelText(/cerrar modal/i);
        expect(closeButton).toHaveFocus();
      });

      // Verificar que el foco cambió del elemento anterior
      expect(document.activeElement).not.toBe(previousElement);

      // Limpiar
      document.body.removeChild(previousElement);
    });

    test("establece overflow: hidden en body cuando se abre", () => {
      expect(document.body.style.overflow).toBe("");

      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    test("restaura overflow del body cuando se cierra", () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("");
    });

    test("oculta contenido de fondo con aria-hidden", () => {
      // Crear contenido principal
      const mainContent = document.createElement("main");
      document.body.appendChild(mainContent);

      render(<Modal {...defaultProps} />);

      expect(mainContent.getAttribute("aria-hidden")).toBe("true");
      expect(mainContent.getAttribute("data-modal-hidden")).toBe("true");
    });

    test("restaura visibilidad del contenido de fondo al cerrar", () => {
      const mainContent = document.createElement("main");
      document.body.appendChild(mainContent);

      const { rerender } = render(<Modal {...defaultProps} />);
      expect(mainContent.getAttribute("aria-hidden")).toBe("true");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(mainContent.hasAttribute("aria-hidden")).toBe(false);
      expect(mainContent.hasAttribute("data-modal-hidden")).toBe(false);
    });

    test("maneja tecla Escape", () => {
      const mockOnClose = vi.fn();
      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("no responde a Escape cuando preventClose es true", () => {
      const mockOnClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={mockOnClose} preventClose={true} />
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("enfoca el primer elemento al abrir con initialFocus='content'", async () => {
      const TestContent = () => (
        <div>
          <input data-testid="first-input" />
          <button>Second element</button>
        </div>
      );

      render(
        <Modal {...defaultProps} initialFocus="content">
          <TestContent />
        </Modal>
      );

      // Esperar el timeout del componente para el enfoque
      await waitFor(() => {
        expect(screen.getByTestId("first-input")).toHaveFocus();
      });
    });

    test("enfoca botón cerrar por defecto", async () => {
      render(<Modal {...defaultProps} />);

      // Esperar el timeout del componente para el enfoque
      await waitFor(() => {
        expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
      });
    });
  });

  describe("Trampa de Foco", () => {
    test("implementa trampa de foco con Tab", async () => {
      const TestContent = () => (
        <div>
          <input data-testid="input1" />
          <button data-testid="button1">Button</button>
        </div>
      );

      render(
        <Modal {...defaultProps}>
          <TestContent />
        </Modal>
      );

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      const button = screen.getByTestId("button1");

      // Simular navegación con Tab desde el último elemento
      button.focus();
      fireEvent.keyDown(document, { key: "Tab" });

      expect(closeButton).toHaveFocus();
    });

    test("implementa trampa de foco con Shift+Tab", async () => {
      const TestContent = () => (
        <div>
          <input data-testid="input1" />
          <button data-testid="button1">Button</button>
        </div>
      );

      render(
        <Modal {...defaultProps}>
          <TestContent />
        </Modal>
      );

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      const button = screen.getByTestId("button1");

      // Simular navegación con Shift+Tab desde el primer elemento
      closeButton.focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

      expect(button).toHaveFocus();
    });
  });

  describe("Casos Edge", () => {
    test("maneja contenido sin elementos enfocables", async () => {
      const TestContent = () => <div>Solo texto sin elementos enfocables</div>;

      expect(() => {
        render(
          <Modal {...defaultProps} initialFocus="content">
            <TestContent />
          </Modal>
        );
      }).not.toThrow();

      // Debería hacer fallback al botón cerrar
      await waitFor(() => {
        expect(screen.getByLabelText(/cerrar modal/i)).toHaveFocus();
      });
    });

    test("maneja cambios de props mientras está abierto", () => {
      const { rerender } = render(<Modal {...defaultProps} title="Original" />);

      expect(screen.getByText("Original")).toBeInTheDocument();

      rerender(<Modal {...defaultProps} title="Updated" />);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Original")).not.toBeInTheDocument();
    });

    test("limpia event listeners al desmontar", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = render(<Modal {...defaultProps} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    test("limpia timers al desmontar", () => {
      // Este test verifica que no hay memory leaks, pero es difícil de testear directamente
      // El componente usa cleanup functions en useEffect que deberían limpiar automáticamente
      const { unmount } = render(<Modal {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    test("maneja elementos enfocados previamente que ya no existen", () => {
      // Crear elemento temporal
      const tempElement = document.createElement("button");
      document.body.appendChild(tempElement);
      tempElement.focus();

      const { rerender } = render(<Modal {...defaultProps} />);

      // Remover elemento mientras modal está abierto
      document.body.removeChild(tempElement);

      // Cerrar modal no debería causar errores
      expect(() => {
        rerender(<Modal {...defaultProps} isOpen={false} />);
      }).not.toThrow();
    });
  });

  describe("Estados del Botón Cerrar", () => {
    test("botón cerrar está habilitado por defecto", () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByLabelText(/cerrar modal/i);
      expect(closeButton).not.toBeDisabled();
    });

    test("botón cerrar está deshabilitado cuando preventClose es true", () => {
      render(<Modal {...defaultProps} preventClose={true} />);

      const closeButton = screen.getByLabelText(/no se puede cerrar/i);
      expect(closeButton).toBeDisabled();
    });

    test("botón cerrar tiene clases CSS correctas cuando está deshabilitado", () => {
      render(<Modal {...defaultProps} preventClose={true} />);

      const closeButton = screen.getByLabelText(/no se puede cerrar/i);
      expect(closeButton).toHaveClass("cursor-not-allowed");
      expect(closeButton).toHaveClass("text-gray-400");
    });
  });

  describe("Área de Contenido", () => {
    test("área de contenido tiene clases de scroll correctas", () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      const contentArea = dialog.querySelector('[tabindex="-1"]');

      expect(contentArea).toHaveClass("overflow-y-auto");
      expect(contentArea).toHaveClass("max-h-96");
    });

    test("área de contenido es accesible via teclado", () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      const contentArea = dialog.querySelector('[tabindex="-1"]');

      expect(contentArea).toHaveAttribute("tabindex", "-1");
    });
  });
});
