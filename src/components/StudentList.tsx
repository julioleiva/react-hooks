import type { Student } from "../App";

interface StudentListProps {
  students: Student[];
  onRemoveStudent: (id: number) => void;
}

/**
 * @param {StudentListProps} props - Propiedades del componente
 */
export function StudentList({ students, onRemoveStudent }: StudentListProps) {
  return (
    <div className="lista-container">
      <h2>Lista de Estudiantes</h2>

      {students.length === 0 ? (
        <p>No hay estudiantes registrados.</p>
      ) : (
        <table className="tabla-estudiantes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Curso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.course}</td>
                <td>
                  <button
                    className="boton-eliminar"
                    onClick={() => {
                      // Implementación de UDF: enviamos el ID hacia arriba
                      onRemoveStudent(student.id);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
