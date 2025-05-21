import { useState } from "react";
import { StudentForm } from "./components/StudentForm";
import { StudentList } from "./components/StudentList";
import "./App.css";

/**
 * Interfaz que define la estructura de un estudiante
 */
export type Student = {
  id: number;
  name: string;
  age: number;
  course: string;
};

export type NewStudent = {
  name: string;
  age: number;
  course: string;
};

/**
 * Flujo PATRÓN UDF (Upward Data Flow):
 * 1. App (padre) mantiene el estado de los estudiantes
 * 2. FormularioEstudiante (hijo) recibe una función para añadir estudiantes
 * 3. Cuando el usuario envía el formulario, los datos fluyen HACIA ARRIBA desde
 *    el FormularioEstudiante hasta App mediante la función pasada como prop
 */
function App() {
  const [students, setStudent] = useState<Student[]>([]);

  /**
   * Esta función será pasada al componente hijo FormularioEstudiante
   * Permitirá que los datos fluyan hacia arriba (UDF - Upward Data Flow)
   *
   * @param {NewStudent} newStudent - Datos del estudiante enviados desde el componente hijo
   */
  const addStudent = (newStudent: NewStudent): void => {
    const estudianteConId: Student = {
      ...newStudent,
      id: Date.now(),
    };

    // Actualizamos el estado en el componente padre con los datos que vienen del hijo
    setStudent([...students, estudianteConId]);

    // Los datos han fluido de abajo hacia arriba (UDF)
    console.log("Datos recibidos desde el componente hijo:", newStudent);
  };

  /**
   * Esta función también implementa UDF - será pasada a StudentList
   * para eliminar un estudiante
   *
   * @param {number} id - ID del estudiante a eliminar
   */
  const removeStudent = (id: number): void => {
    setStudent(students.filter((student) => student.id !== id));
  };

  return (
    <div className="app-container">
      {/* 
        Pasamos la función addStudent como prop al componente hijo
        para que los datos fluyan desde el hijo hacia el padre.
      */}
      <StudentForm onAddStudent={addStudent} />

      {/*
        Los datos fluyen de padre a hijo (estudiantes),
        pero también fluyen de hijo a padre mediante la función removeStudent.
      */}
      <StudentList students={students} onRemoveStudent={removeStudent} />
    </div>
  );
}

export default App;
