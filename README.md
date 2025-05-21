# Patrón UDF (Upward Data Flow) en React

## ¿Qué es el patrón UDF?

El patrón **Upward Data Flow (UDF)** o "Flujo de datos hacia arriba" es un concepto fundamental en React que describe cómo los datos deben fluir desde los componentes hijos hacia los componentes padres. Es uno de los principios clave del diseño de aplicaciones React y complementa el flujo de datos unidireccional (de arriba hacia abajo) que React promueve por defecto.

### Características principales:

1. **Flujo de datos unidireccional:** En React, los datos normalmente fluyen de padres a hijos mediante props.
2. **Comunicación inversa:** UDF permite la comunicación desde componentes hijos hacia componentes padres.
3. **Centralización del estado:** Mantiene el estado principal en componentes superiores.
4. **Paso de funciones como props:** El padre proporciona callbacks que los hijos invocan para enviar datos hacia arriba.

## Cómo se implementa UDF

El patrón UDF se implementa mediante los siguientes pasos:

1. **El componente padre define funciones** que modificarán su estado interno.
2. **Estas funciones se pasan como props** a los componentes hijos.
3. **Los componentes hijos invocan estas funciones** cuando necesitan "comunicarse hacia arriba".
4. **Los datos fluyen hacia arriba** cuando el hijo llama a la función recibida del padre.

## Aplicación del patrón UDF en el código proporcionado

En el código presentado, podemos ver una clara implementación del patrón UDF a través de una aplicación de gestión de estudiantes:

### 1. Componente App (Padre)

El componente `App` es el principal contenedor de estado:

```jsx
function App() {
  const [students, setStudent] = useState<Student[]>([]);

  const addStudent = (newStudent: NewStudent): void => {
    const estudianteConId: Student = {
      ...newStudent,
      id: Date.now(),
    };
    setStudent([...students, estudianteConId]);
  };

  const removeStudent = (id: number): void => {
    setStudent(students.filter((student) => student.id !== id));
  };

  return (
    <div className="app-container">
      <StudentForm onAddStudent={addStudent} />
      <StudentList students={students} onRemoveStudent={removeStudent} />
    </div>
  );
}
```

- Definimos el estado principal (`students`)
- Creamos funciones (`addStudent` y `removeStudent`) para modificar ese estado
- Pasamos estas funciones como props a sus componentes hijos

### 2. Componente StudentForm (Hijo)

En el componente `StudentForm` implementamos un formulario que recoge datos y los envía "hacia arriba":

```jsx
export function StudentForm({ onAddStudent }: StundentFormProps) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validaciones...

    const newStudent: NewStudent = {
      name,
      age: edadNum,
      course,
    };

    // IMPLEMENTACIÓN DEL PATRÓN UDF:
    onAddStudent(newStudent); // Datos fluyendo hacia arriba

    // Limpieza del formulario
  };

  return (
    // JSX del formulario...
  );
}
```

Este componente:

- Mantiene su propio estado local (para los campos del formulario)
- Recibe la función `onAddStudent` como prop desde el componente padre
- Al enviar el formulario, llama a esa función pasando los datos del nuevo estudiante, enviando así información "hacia arriba"

### 3. Componente StudentList (Hijo)

El componente `StudentList` muestra los estudiantes y permite eliminarlos:

```jsx
export function StudentList({ students, onRemoveStudent }: StudentListProps) {
  return (
    <div className="lista-container">
      {/* ... */}
      <button
        className="boton-eliminar"
        onClick={() => {
          // Implementación de UDF: enviamos el ID hacia arriba
          onRemoveStudent(student.id);
        }}
      >
        Eliminar
      </button>
      {/* ... */}
    </div>
  );
}
```

Este componente:

- Recibe datos del padre (`students`) - flujo normal descendente
- Recibe la función `onRemoveStudent` como prop
- Al hacer clic en "Eliminar", llama a esta función pasando el ID del estudiante, implementando así el flujo de datos hacia arriba

## Beneficios del patrón UDF

1. **Centralización del estado:** Todos los estudiantes se gestionan en un solo lugar (`App`).
2. **Separación de responsabilidades:**
   - `App` gestiona el estado de la lista de estudiantes
   - `StudentForm` se encarga solo del formulario y envía datos hacia arriba
   - `StudentList` se encarga de mostrar y enviar comandos de eliminación hacia arriba
3. **Predictibilidad:** El flujo de datos es claro y unidireccional, facilitando el seguimiento del estado.
4. **Mantenibilidad:** Los componentes son más reutilizables y tienen propósitos bien definidos.
