// src/public/js/auth.js

const API = "http://localhost:3000/api";

// === UTILIDADES ===
const token = () => localStorage.getItem("token");
const showToast = (msg, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.querySelector(".toast-container").appendChild(toast);
  new bootstrap.Toast(toast).show();
};

// === AUTH ===
let isLogin = true;

document.getElementById("toggleAuthMode").addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  document.getElementById("authModalTitle").textContent = isLogin
    ? "Iniciar Sesión"
    : "Registrarse";
  document.getElementById("authSubmit").textContent = isLogin
    ? "Entrar"
    : "Crear cuenta";
  document.getElementById("toggleAuthMode").textContent = isLogin
    ? "¿No tienes cuenta? Regístrate"
    : "¿Ya tienes cuenta? Inicia sesión";
  document.getElementById("passwordField").style.display = "block";
});

document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  // Ajustar endpoint según login o register
  const endpoint = isLogin ? "/users/login" : "/users/register";
  const body = isLogin
    ? { email, password }
    : { username: email.split("@")[0], email, password, role: "user" };

  try {
    const res = await fetch(API + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // No Authorization
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error en el servidor");

    // Guardar token en login o register
    if (data.token) localStorage.setItem("token", data.token);

    showToast(isLogin ? "¡Bienvenido!" : "Cuenta creada");
    bootstrap.Modal.getInstance(document.getElementById("authModal")).hide();
    loadUser();
  } catch (err) {
    showToast(err.message, "danger");
  }
});

// === LOGOUT ===
document.getElementById("logoutLink").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

// === OLVIDÉ CONTRASEÑA ===
document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
  e.preventDefault();
  bootstrap.Modal.getInstance(document.getElementById("authModal")).hide();
  new bootstrap.Modal(document.getElementById("resetModal")).show();
});

document.getElementById("sendResetBtn").addEventListener("click", async () => {
  const email = document.getElementById("resetEmail").value;
  try {
    const res = await fetch(API + "/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error en servidor");
    showToast("Enlace enviado a tu email");
    bootstrap.Modal.getInstance(document.getElementById("resetModal")).hide();
  } catch (err) {
    showToast(err.message, "danger");
  }
});

// === CARGAR USUARIO ===
async function loadUser() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/users/current", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    if (!res.ok) throw new Error("No autorizado");
    const user = await res.json();

    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userMenu").style.display = "block";
    document.getElementById("authLinks").style.display = "none";

    if (user.role === "admin")
      document.getElementById("adminLink").style.display = "block";

    updateCartCount();
  } catch (err) {
    localStorage.removeItem("token");
  }
}

// === PERFIL USUARIO ===
async function loadUserProfile() {
  try {
    const res = await fetch(API + "/users/current", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    if (!res.ok) throw new Error("No autorizado");
    const user = await res.json();

    document.getElementById("profileId").textContent = user.id;
    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileRole").textContent = user.role;

    showSection("profileSection");
  } catch (err) {
    showToast("No se pudo cargar el perfil", "danger");
  }
}
