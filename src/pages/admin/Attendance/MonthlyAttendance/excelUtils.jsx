import * as XLSX from 'xlsx';

export const exportToExcel = (data, columns) => {
  const worksheet = XLSX.utils.json_to_sheet([]);

  // Añadir encabezados personalizados para todas las columnas
  const headers = columns.map(col => col.label);
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Convertir datos a formato adecuado
  const formattedData = data.map(row => columns.map(col => row[col.id]));
  XLSX.utils.sheet_add_json(worksheet, formattedData, { skipHeader: true, origin: 'A2' });

  // Ajustar el ancho de las columnas
  const columnWidths = columns.map(col => ({
    wch: Math.max(col.label.length, ...data.map(row => row[col.id]?.toString().length || 0))
  }));
  worksheet['!cols'] = columnWidths;

  // Crea un nuevo libro de trabajo y añade la hoja de cálculo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');

  // Generar y descargar el archivo Excel
  XLSX.writeFile(workbook, 'attendance_data.xlsx');
};
