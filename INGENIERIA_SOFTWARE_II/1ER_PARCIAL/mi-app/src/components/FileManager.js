import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Animaciones suaves
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Loader2, 
  ShieldCheck,
  FolderUp, // Icono para subir
  FileText, // Icono de archivo
  Download, // Icono de descarga
  Trash2, // Icono de borrar
  Plus, // Icono de añadir
  LogOut // Icono de cerrar sesión
} from "lucide-react"; // Iconos

function FileManager({ onLogout }) {
  // ----------------------
  // 3) Estados del gestor de archivos
  // ----------------------
  const [files, setFiles] = useState([
    { id: 1, name: "ReporteAnual.pdf", size: "1.2 MB", author:"Eric", uploadedAt: "2023-10-26" },
    { id: 2, name: "PresentacionProyecto.pptx", size: "3.5 MB",author:"Juan", uploadedAt: "2023-10-25" },
    { id: 3, name: "DocumentoImportante.docx", size: "850 KB",author:"Amelia", uploadedAt: "2023-10-24" },
  ]);
  const [uploadStatus, setUploadStatus] = useState({ status: "idle", message: "" });
  const [isUploading, setIsUploading] = useState(false);

    // Maneja la acción de cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setFiles([]); // Limpiar la lista de archivos por seguridad
    setUploadStatus({ status: "idle", message: "" });
    setRemember(true);
    // Limpiar el email recordado si es necesario
    localStorage.removeItem("rememberEmail");
  };

  // ----------------------
  // 5) Lógica de gestión de archivos
  // ----------------------
  // Simula la subida de un archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ status: "idle", message: "" });

    // Simula la carga del archivo
    setTimeout(() => {
      const newFile = {
        id: files.length + 1,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setUploadStatus({ status: "success", message: `"${file.name}" subido exitosamente.` });
      setIsUploading(false);
      e.target.value = null; // Reiniciar el input para permitir subir el mismo archivo
    }, 1500);
  };

  // Simula la descarga de un archivo
  const handleDownload = (fileName) => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Contenido de prueba para el archivo: ' + fileName);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simula el borrado de un archivo
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este archivo? (Esto es solo una simulación)")) {
      setFiles((prevFiles) => prevFiles.filter(file => file.id !== id));
      setUploadStatus({ status: "success", message: "Archivo eliminado." });
    }
  };

  // ----------------------
  // 6) Renderizado condicional
  // ----------------------
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>

        {/* Tarjeta del gestor de archivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <FolderUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-semibold leading-tight">Gestor de Archivos</h1>
                <p className="text-white/70 text-sm">Sube, descarga y gestiona tus documentos</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>

          {/* Mensaje de estado */}
          {uploadStatus.message && (
            <div
              className={`mb-4 rounded-xl px-4 py-3 text-sm border ${uploadStatus.status === "success" ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" : "bg-rose-500/15 text-rose-200 border-rose-400/30"}`}
            >
              {uploadStatus.message}
            </div>
          )}

          {/* Área de subida */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Subiendo…
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" /> Subir nuevo archivo
                  </>
                )}
              </button>
            </div>
            <p className="text-white/50 text-xs text-center md:text-left">Solo se pueden subir archivos de prueba.</p>
          </div>

          {/* Lista de archivos */}
          <div className="space-y-4">
            <h2 className="text-white text-lg font-medium">Mis Archivos</h2>
            {files.length > 0 ? (
              <ul className="space-y-2">
                {files.map((file) => (
                  <motion.li
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-6 w-6 text-indigo-400" />
                      <div className="min-w-0">
                        <span className="block text-white font-medium truncate">{file.name}</span>
                        <span className="block text-white/60 text-xs">Tamaño: {file.size} - Subido: {file.uploadedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleDownload(file.name)}
                        className="p-2 rounded-lg text-white/70 hover:bg-white/10 transition"
                        aria-label="Descargar archivo"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 rounded-lg text-white/70 hover:bg-white/10 transition"
                        aria-label="Borrar archivo"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-center py-8">Aún no hay archivos. ¡Sube el primero!</p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
  
}

export default FileManager;