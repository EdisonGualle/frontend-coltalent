import jsPDF from "jspdf";
import "jspdf-autotable";

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key] ?? "-", obj);

/**
 * Función genérica para exportar datos a PDF
 * @param {Array} data - Filas a exportar
 * @param {Array} columns - Columnas a incluir en el archivo
 * @param {Object} options - Opciones adicionales para la configuración del PDF
 */
export const exportToPdf = (data, columns, options = {}) => {
  const {
    filename = "Reporte.pdf",
    title = "Reporte Profesional",
    subtitle = "Detalles del Reporte",
    logo = null,
    footerText = "Reporte generado automáticamente. Información confidencial.",
    pageMargins = { top: 20, left: 15, right: 15 },
    customHeaderColor = [41, 128, 185],
    lineColor = [200, 200, 200],
  } = options;

  // Filtrar columnas exportables
  const exportableColumns = columns.filter((col) => col.exportable !== false);

  // Ordenar las columnas según el atributo `order`
  const orderedColumns = [...exportableColumns].sort((a, b) => a.order - b.order);

  const doc = new jsPDF({
    orientation: orderedColumns.length > 6 ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const generatedDate = new Date().toLocaleString();

  // Agregar logo si está definido
  if (logo) {
    const logoSize = 20;
    doc.addImage(logo, "PNG", pageMargins.left, 10, logoSize, logoSize);
  }

  // Título y subtítulo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(subtitle, pageWidth / 2, 27, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generado el: ${generatedDate}`, pageWidth / 2, 33, {
    align: "center",
  });

  // Línea debajo del encabezado
  doc.setDrawColor(...lineColor);
  doc.setLineWidth(0.5);
  doc.line(pageMargins.left, 37, pageWidth - pageMargins.right, 37);

  // Configurar columnas para la tabla
  const tableColumns = orderedColumns.map((col) => ({
    header: col.label,
    dataKey: col.id,
  }));

  // Procesar filas, incluyendo renderizadores personalizados
  const tableRows = data.map((row) =>
    orderedColumns.reduce((acc, col) => {
      if (col.render) {
        // Usar el renderizador con asText=true para texto plano
        acc[col.id] = col.render(row, true) || "-";
      } else {
        acc[col.id] = getNestedValue(row, col.id);
      }
      return acc;
    }, {})
  );

  // Configuración de la tabla
  doc.autoTable({
    startY: 45,
    margin: pageMargins,
    head: [tableColumns.map((col) => col.header)],
    body: tableRows.map((row) =>
      tableColumns.map((col) => row[col.dataKey])
    ),
    styles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: "linebreak",
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: customHeaderColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [60, 60, 60],
      fillColor: [245, 245, 245],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { halign: "center" },
      _: { halign: "left" },
    },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.1,
    didDrawPage: (data) => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      const totalPages = doc.internal.getNumberOfPages();

      // Pie de página
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...lineColor);
      doc.text(footerText, pageMargins.left, pageHeight - 10, {
        align: "left",
      });

      doc.setDrawColor(...lineColor);
      doc.line(
        pageMargins.left,
        pageHeight - 15,
        pageWidth - pageMargins.right,
        pageHeight - 15
      );

      doc.text(
        `Página ${pageNumber} de ${totalPages}`,
        pageWidth - pageMargins.right,
        pageHeight - 10,
        { align: "right" }
      );
    },
  });

  // Guardar el archivo PDF
  doc.save(filename);
};
