import jsPDF from "jspdf";
import "jspdf-autotable";

// Función para obtener valores de objetos con soporte para claves anidadas
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
};

// Eliminar caracteres no permitidos del nombre del archivo
const sanitizeName = (name) => {
  return name.replace(/[/\\?*:<>|"]/g, '').substring(0, 31);
};

/**
 * Función genérica para exportar datos a PDF
 * @param {Array} data - Filas a exportar
 * @param {Array} columns - Columnas a incluir en el archivo
 * @param {Object} options - Opciones adicionales (nombre de archivo, título, etc.)
 */
export const exportToPdf = (data, columns, options = {}) => {
  const { filename = 'datos_exportados.pdf', title = 'Datos Exportados' } = options;

  // Crear una nueva instancia de jsPDF
  const doc = new jsPDF();

  // Añadir el título
  doc.text(title, 14, 20);

  // Crear una estructura para las columnas y filas
  const tableColumns = columns.map((col) => col.label);
  const tableRows = data.map((row) =>
    columns.map((col) => {
      const value = getNestedValue(row, col.id);
      return value !== undefined && value !== null ? value : ""; // Mantener vacío si no hay datos
    })
  );

  // Generar la tabla usando autoTable
  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10 },
  });

  // Guardar el archivo con el nombre especificado
  const sanitizedFilename = sanitizeName(filename);
  doc.save(sanitizedFilename);
};
