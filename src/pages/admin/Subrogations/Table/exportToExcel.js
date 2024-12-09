import * as XLSX from 'xlsx';

// Función para obtener valores de objetos con soporte para claves anidadas
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
};

// Eliminar caracteres no permitidos y limitar a 31 caracteres
const sanitizeName = (name) => {
  return name.replace(/[/\\?*:<>|"]/g, '').substring(0, 31);
};

/**
 * Función genérica para exportar datos a Excel
 * @param {Array} data - Filas a exportar
 * @param {Array} columns - Columnas a incluir en el archivo
 * @param {Object} options - Opciones adicionales (nombre de archivo, hoja, etc.)
 */
export const exportToExcel = (data, columns, options = {}) => {
  let { filename = 'datos_exportados.xlsx', sheetName = 'Hoja1' } = options;

  // Sanitizar nombres
  filename = sanitizeName(filename);
  sheetName = sanitizeName(sheetName);

  // Asegurar que el nombre tenga la extensión .xlsx
  if (!filename.endsWith('.xlsx')) {
    filename = `${filename}.xlsx`;
  }

  // Filtrar columnas exportables
  const exportableColumns = columns.filter((col) => col.exportable);

  // Añadir encabezados personalizados para columnas exportables
  const headers = exportableColumns.map((col) => col.label);

  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Convertir datos con manejo de celdas vacías y renderizadores personalizados
  const processedData = data.map((row) =>
    exportableColumns.map((col) => {
      if (col.render) {
        // Evaluar el renderizador con `asText = true` para obtener texto plano
        return col.render(row, true) || "";
      } else {
        const value = getNestedValue(row, col.id);
        return value !== undefined && value !== null ? value : "";
      }
    })
  );

  XLSX.utils.sheet_add_json(worksheet, processedData, { skipHeader: true, origin: 'A2' });

  // Ajustar el ancho de las columnas
  const columnWidths = exportableColumns.map((col) => ({
    wch: Math.max(
      col.label.length,
      ...data.map((row) => {
        if (col.render) {
          // Obtener longitud del texto plano generado por el renderizador
          const text = col.render(row, true) || "";
          return text.length;
        }
        const value = getNestedValue(row, col.id);
        return value?.toString()?.length || 4;
      })
    ),
  }));
  worksheet['!cols'] = columnWidths;

  // Crear y descargar el archivo Excel
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename, { bookType: 'xlsx', type: 'binary' });
};
