import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FaFilePdf, FaFileImage, FaTimes } from 'react-icons/fa';

const FileViewer = ({ filename }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (event.target.id === 'modal-background') {
      setIsModalOpen(false);
    }
  };

  if (!filename) return null;

  const fileUrl = `${import.meta.env.VITE_WEB_BASE_URL}/show/${filename}`;
  const fileExtension = filename.split('.').pop().toLowerCase();

  const isPdf = fileExtension === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const renderIcon = () => {
    if (isPdf) return <FaFilePdf className="text-red-500  text-base  hover:text-red-700" />;
    if (isImage) return <FaFileImage className="text-blue-500 text-base hover:text-blue-700" />;
    return null;
  };

  const renderPdfPreview = () => (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <Viewer
        fileUrl={fileUrl}
        plugins={[defaultLayoutPluginInstance]}
        onDocumentLoadError={(error) => {
          console.error('Error loading PDF:', error);
          setPdfError(error.message);
        }}
      />
    </Worker>
  );

  const renderImagePreview = () => (
    <div className="w-full h-full flex justify-center items-center">
      <img
        src={fileUrl}
        alt="Preview"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );

  return (
    <>
      <span onClick={handleOpen} className="cursor-pointer">
        {renderIcon()}
      </span>
      {isModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClickOutside}
        >
          <div className="relative bg-white p-6 rounded-lg max-w-3xl max-h-[90vh] h-[90vh] w-full flex flex-col">
            <FaTimes 
              onClick={handleClose} 
              className="absolute top-1 right-2 cursor-pointer text-lg text-gray-600"
            />
            <div className="flex-grow h-full overflow-hidden">
              {pdfError ? (
                <p>Error al cargar el PDF: {pdfError}</p>
              ) : (
                isPdf ? renderPdfPreview() : renderImagePreview()
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileViewer;
