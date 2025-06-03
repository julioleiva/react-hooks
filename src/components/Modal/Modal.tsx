import React, { useRef, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  preventClose?: boolean;
  description?: string;
  initialFocus?: "close" | "content";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  preventClose = false,
  description,
  initialFocus = "close",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Guardar el elemento que tenía el foco antes de abrir el modal
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Estado para anuncios de lectores de pantalla
  const [announcement, setAnnouncement] = useState<string>("");

  // Configurar trampa de foco y listeners cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      // Guardar referencia al elemento actualmente enfocado
      previouslyFocused.current = document.activeElement as HTMLElement;

      // Prevenir scroll del body y ocultar contenido de fondo
      document.body.style.overflow = "hidden";

      // Ocultar contenido de fondo para lectores de pantalla
      const mainContent = document.querySelector(
        "main, #root, [data-reactroot]"
      );
      if (mainContent && !mainContent.hasAttribute("aria-hidden")) {
        mainContent.setAttribute("aria-hidden", "true");
        mainContent.setAttribute("data-modal-hidden", "true");
      }

      // Anunciar apertura del modal
      setAnnouncement(
        `Modal abierto: ${title}${description ? `. ${description}` : ""}`
      );

      // Enfocar elemento inicial
      const focusTimer = setTimeout(() => {
        if (initialFocus === "content" && contentRef.current) {
          // Buscar primer elemento enfocable en contenido
          const firstFocusable = contentRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            closeButtonRef.current?.focus();
          }
        } else {
          closeButtonRef.current?.focus();
        }
      }, 100);

      // Configurar la trampa de foco
      const handleKeyDown = (e: KeyboardEvent) => {
        // Cerrar con Escape
        if (e.key === "Escape" && !preventClose) {
          e.preventDefault();
          onClose();
          return;
        }

        // Trampa de foco solo cuando el modal está abierto
        if (e.key === "Tab" && modalRef.current) {
          const focusableElements =
            modalRef.current.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
            );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          // Si presionan Shift+Tab en el primer elemento, ir al último
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
          // Si presionan Tab en el último elemento, ir al primero
          else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      // Añadir listener de eventos
      document.addEventListener("keydown", handleKeyDown);

      // Cleanup
      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";

        // Restaurar visibilidad del contenido de fondo
        const hiddenContent = document.querySelector(
          '[data-modal-hidden="true"]'
        );
        if (hiddenContent) {
          hiddenContent.removeAttribute("aria-hidden");
          hiddenContent.removeAttribute("data-modal-hidden");
        }
      };
    }
  }, [isOpen, onClose, preventClose, title, description, initialFocus]);

  // Restaurar el foco cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      // Limpiar anuncio
      setAnnouncement("");

      // Restaurar foco con un pequeño delay para evitar problemas de timing
      const restoreTimer = setTimeout(() => {
        if (previouslyFocused.current) {
          previouslyFocused.current.focus();
        }
      }, 100);

      return () => clearTimeout(restoreTimer);
    }
  }, [isOpen]);

  // Manejar clic en overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !preventClose) {
      onClose();
    }
  };

  // Manejar cierre
  const handleClose = () => {
    if (!preventClose) {
      setAnnouncement("Modal cerrado");
      setTimeout(() => onClose(), 100);
    }
  };

  if (!isOpen) return null;

  // Configurar clases de tamaño
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
  };

  return (
    <>
      {/* Región live para anuncios */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {announcement}
      </div>

      {/* Overlay del modal - SIN aria-hidden */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={handleOverlayClick}
        role="presentation"
      >
        {/* Contenedor del modal */}
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-2xl transform transition-all duration-200 scale-100`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby={description ? "modal-description" : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1 pr-4">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 leading-tight"
              >
                {title}
              </h2>
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {description}
                </p>
              )}
            </div>

            {/* Botón de cerrar */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              disabled={preventClose}
              aria-label={
                preventClose ? "No se puede cerrar este modal" : "Cerrar modal"
              }
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                preventClose
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-blue-500 active:scale-95"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenido del modal */}
          <div
            ref={contentRef}
            className="p-6 max-h-96 overflow-y-auto focus:outline-none"
            tabIndex={-1}
          >
            {children}
          </div>

          {/* Indicador visual de modal activo */}
          <div
            className="absolute -inset-1 rounded-lg border-2 border-blue-500 opacity-0 pointer-events-none transition-opacity duration-200"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
};

export default Modal;
