// Importación de ChangeEvent y useState desde "react" para gestionar el estado del formulario
import { ChangeEvent, useState } from "react";

// Interfaz genérica para useForm que define la forma de los valores del formulario
interface FormValues {
  [key: string]: string | number;
}

// Definición del hook useForm que toma un tipo genérico T que extiende de FormValues
export const useForm = <T extends FormValues>(initialValues: T) => {
  // Estado local para almacenar los valores del formulario
  const [values, setValues] = useState<T>(initialValues);

  // Función handleChange que actualiza los valores del formulario en respuesta a cambios en los campos de entrada
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    // Actualiza los valores del formulario manteniendo los valores anteriores y asignando el nuevo valor al campo especificado
    setValues({ ...values, [`${name}`]: value });
  };

  // Función resetForm que restablece los valores del formulario a los valores iniciales proporcionados
  const resetForm = () => {
    setValues(initialValues);
  };

  // Devuelve un objeto que contiene los valores del formulario, la función handleChange para manejar cambios en los campos de entrada y la función resetForm para restablecer el formulario
  return {
    values,
    handleChange,
    resetForm,
  };
};

