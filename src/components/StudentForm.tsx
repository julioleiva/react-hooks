import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { NewStudent } from "../App";

type StundentFormProps = {
  onAddStudent: (estudiante: NewStudent) => void;
};

/**
 * Componente hijo que implementa un formulario
 * Demuestra el flujo de datos hacia arriba (UDF)
 *
 * @param {StundentFormProps} props - Propiedades del componente
 */
export function StudentForm({ onAddStudent }: StundentFormProps) {
  // Estado local del formulario - estos datos  fluirán hacia arriba
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  /**
   * Maneja los cambios en el campo de nombre
   */
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  /**
   * Maneja los cambios en el campo de edad
   */
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAge(e.target.value);
  };

  /**
   * Maneja los cambios en el campo de curso
   */
  const handleCourseChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCourse(e.target.value);
  };

  /**
   * Maneja el envío del formulario y activa el flujo de datos hacia arriba
   *
   * @param {FormEvent<HTMLFormElement>} e - Evento de formulario
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validación simple
    if (!name.trim() || !age.trim() || !course.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Verificamos que la edad sea un número válido
    const edadNum = parseInt(age);
    if (isNaN(edadNum) || edadNum <= 0) {
      alert("Por favor ingresa una edad válida");
      return;
    }

    // Creamos el objeto con los datos del formulario
    const newStudent: NewStudent = {
      name,
      age: edadNum,
      course,
    };

    // AQUÍ ES DONDE OCURRE EL PATRÓN UDF:
    // Llamamos a la función que recibimos del padre, enviando los datos hacia arriba
    onAddStudent(newStudent);

    // Limpiamos el formulario después del envío
    setName("");
    setAge("");
    setCourse("");
  };

  return (
    <div className="formulario-container">
      <h2>Registrar Nuevo Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo-formulario">
          <label htmlFor="name">name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Nombre del estudiante"
          />
        </div>

        <div className="campo-formulario">
          <label htmlFor="edad">Edad:</label>
          <input
            id="edad"
            type="number"
            value={age}
            onChange={handleAgeChange}
            placeholder="Edad"
            min="1"
          />
        </div>

        <div className="campo-formulario">
          <label htmlFor="curso">Curso:</label>
          <input
            id="curso"
            type="text"
            value={course}
            onChange={handleCourseChange}
            placeholder="Nombre del curso"
          />
        </div>

        <button type="submit">Registrar Estudiante</button>
      </form>
    </div>
  );
}
