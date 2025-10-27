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

// ==========================
// 1) Componente principal
// ==========================
// - Contiene el layout de la página, la tarjeta del login y el gestor de archivos.
// - Usa el estado `isLoggedIn` para cambiar entre las dos vistas.
function Login({ onLoginSuccess }) {
      // ----------------------
      // 2) Estados del formulario de login
      // ----------------------
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [remember, setRemember] = useState(false);
    
      // Estados de UI para el login
      const [errors, setErrors] = useState({ email: "", password: "" });
      const [isLoading, setIsLoading] = useState(false);
      const [status, setStatus] = useState("idle"); // idle | success | error
      const [message, setMessage] = useState("");
      const [isLoggedIn, setIsLoggedIn] = useState(false); // Nuevo estado para la navegación

        // Valida el formulario de login
  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Ingresa tu correo institucional";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Formato de correo no válido";

    if (!password) newErrors.password = "Ingresa tu contraseña";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

    // Simula el envío del formulario de login
  const handleSubmit = async (e) => {     // Cambiamos nombre a handleSubmit
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await new Promise((res) => setTimeout(res, 1200));

      const demoEmail = "demo@universidad.mx";
      const demoPass = "123456";

      if (email === demoEmail && password === demoPass) {
        setStatus("success");
        setMessage("¡Acceso concedido! Redirigiendo al panel…");
        if (remember) localStorage.setItem("rememberEmail", email);
      } else {
        setStatus("error");
        setMessage("Credenciales incorrectas. Revisar correo o contraseña.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Ocurrió un problema de red. Intentar nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirección a la vista del gestor de archivos al iniciar sesión con éxito
  useEffect(() => {
    if (status === "success") {
      // Espera un momento para que el usuario vea el mensaje de éxito
      const timer = setTimeout(() => {
        setIsLoggedIn(true);
        // Puedes limpiar los estados aquí si quieres
        setEmail("");
        setPassword("");
        setStatus("idle");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Si no ha iniciado sesión, renderiza la vista de login original
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Tarjeta de login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-semibold leading-tight">Acceso — Gobierno Electrónico</h1>
              <p className="text-white/70 text-sm">Propedéutico — Inicia sesión con tu correo institucional</p>
            </div>
          </div>

          {/* Mensajes de estado */}
          {status !== "idle" && (
            <div
              className={
                "mb-4 rounded-xl px-4 py-3 text-sm " +
                (status === "success"
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30"
                  : "bg-rose-500/15 text-rose-200 border border-rose-400/30")
              }
            >
              {message}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-white/80 mb-1">Correo electrónico</label>
              <div className={`relative flex items-center rounded-2xl border ${errors.email ? "border-rose-400/50" : "border-white/20"} bg-white/5 focus-within:border-indigo-400/60` }>
                <Mail className="h-5 w-5 text-white/60 absolute left-3" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@universidad.mx"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-white/40 outline-none rounded-2xl"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-rose-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-white/80 mb-1">Contraseña</label>
              <div className={`relative flex items-center rounded-2xl border ${errors.password ? "border-rose-400/50" : "border-white/20"} bg-white/5 focus-within:border-indigo-400/60` }>
                <Lock className="h-5 w-5 text-white/60 absolute left-3" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-transparent text-white placeholder-white/40 outline-none rounded-2xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 p-1 rounded-lg text-white/70 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-300 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Opciones */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white/80 text-sm select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-500"
                />
                Recordarme
              </label>
              <button type="button" className="text-indigo-300 hover:text-indigo-200 text-sm">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative overflow-hidden rounded-2xl bg-indigo-500/90 hover:bg-indigo-500 px-4 py-3 text-white font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verificando…
                  </>
                ) : (
                  <>Ingresar</>
                )}
              </span>
              {/* Efecto brillo */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition will-change-transform bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </button>

            {/* Separador visual */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-white/50 text-xs">o</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>

            {/* Acceso alternativo (placeholders) */}
            <button
              type="button"
              onClick={() => console.log("Conectar aquí proveedor SSO / Google / Microsoft")}
              className="w-full rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-white/90"
            >
              Continuar con Google (demo)
            </button>
          </form>

          {/* Nota de ayuda */}
          <p className="text-white/50 text-xs mt-6 leading-relaxed">
            <strong>Notas:</strong> Este formulario valida en el cliente y simula la comunicación con el servidor. 
            Para producción, conecten su API (por ejemplo, <code>fetch('/api/login')</code>) y manejen tokens (JWT), 
            control de sesiones y redirecciones seguras. Consideren usar HTTPS, manejo de errores del servidor y 
            protección contra ataques de fuerza bruta (rate-limiting, captchas) si corresponde.
          </p>
        </div>

        {/* Pie de página pequeño */}
        <p className="text-center text-white/50 text-xs mt-4">
          Tip: Intenten con <code>demo@universidad.mx</code> y contraseña <code>123456</code> para ver el flujo de éxito.
        </p>
      </motion.div>
    </div>
  );

}

export default Login;
