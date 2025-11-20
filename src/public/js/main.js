// main.js
const API = "http://localhost:3000/api";
const token = () => localStorage.getItem("token");
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

// === TOASTS ===
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

// === SECCIONES ===
const showSection = (id) => {
  document
    .querySelectorAll("#mainContent > div")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "block";
};

// === NAVEGACIÓN ===
document.getElementById("homeLink").addEventListener("click", (e) => {
  e.preventDefault();
  showSection("home");
});
document.getElementById("productsLink").addEventListener("click", (e) => {
  e.preventDefault();
  showSection("productsSection");
  loadProducts();
});
document.getElementById("cartLink").addEventListener("click", (e) => {
  e.preventDefault();
  showSection("cartSection");
  loadCart();
});
document.getElementById("profileLink").addEventListener("click", async (e) => {
  e.preventDefault();
  await loadUserProfile();
});
document.getElementById("adminLink").addEventListener("click", (e) => {
  e.preventDefault();
  showSection("adminSection");
  loadAdminProducts();
});
document.getElementById("goToProducts").addEventListener("click", () => {
  showSection("productsSection");
  loadProducts();
});

// === CARGAR USUARIO ===
async function loadUser() {
  if (!token()) return;

  try {
    const res = await fetch(API + "/users/current", { headers: headers() });
    if (!res.ok) throw new Error("No autorizado");

    const user = await res.json();
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userMenu").style.display = "block";
    document.getElementById("authLinks").style.display = "none";

    if (user.role === "admin")
      document.getElementById("adminLink").style.display = "block";

    updateCartCount();
  } catch {
    localStorage.removeItem("token");
  }
}

// === PRODUCTOS ===
async function loadProducts() {
  try {
    const res = await fetch(API + "/products");
    const products = await res.json();
    const list = document.getElementById("productsList");
    list.innerHTML = products
      .map(
        (p) => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 card-product">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text flex-grow-1">${
              p.description || "Sin descripción"
            }</p>
            <p class="card-text"><strong>$${p.price}</strong> | Stock: ${
          p.stock
        }</p>
            <button class="btn btn-primary mt-auto add-to-cart" data-id="${
              p._id
            }" ${p.stock === 0 ? "disabled" : ""}>${
          p.stock === 0 ? "Sin stock" : "Añadir al carrito"
        }</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!token()) return showToast("Inicia sesión", "warning");
        const id = btn.dataset.id;
        try {
          await fetch(API + "/carts", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ productId: id, quantity: 1 }),
          });
          showToast("Añadido al carrito");
          updateCartCount();
        } catch {
          showToast("Error al añadir al carrito", "danger");
        }
      });
    });
  } catch {
    showToast("Error al cargar productos", "danger");
  }
}

// === CARRITO ===
async function updateCartCount() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/carts", { headers: headers() });
    const cart = await res.json();
    const count = cart.items.reduce((a, i) => a + i.quantity, 0);
    document.getElementById("cartCount").textContent = count;
  } catch {}
}

async function loadCart() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/carts", { headers: headers() });
    const cart = await res.json();
    const items = document.getElementById("cartItems");
    let total = 0;
    items.innerHTML = cart.items
      .map((i) => {
        total += i.product.price * i.quantity;
        return `
        <div class="card mb-2">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6>${i.product.name}</h6>
              <small>$${i.product.price} x ${i.quantity}</small>
            </div>
            <button class="btn btn-sm btn-danger remove-item" data-id="${i.product._id}">X</button>
          </div>
        </div>
      `;
      })
      .join("");
    document.getElementById("cartTotal").textContent = total.toFixed(2);

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          await fetch(API + "/carts", {
            method: "DELETE",
            headers: headers(),
            body: JSON.stringify({ productId: id }),
          });
          showToast("Producto eliminado");
          loadCart();
          updateCartCount();
        } catch {
          showToast("Error al eliminar", "danger");
        }
      });
    });
  } catch {
    showToast("Error al cargar el carrito", "danger");
  }
}

// === PERFIL USUARIO ===
async function loadUserProfile() {
  try {
    const res = await fetch(API + "/users/current", { headers: headers() });
    if (!res.ok) throw new Error("No autorizado");

    const user = await res.json();
    document.getElementById("profileId").textContent = user.id;
    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileRole").textContent = user.role;
    showSection("profileSection");
  } catch {
    showToast("No se pudo cargar el perfil", "danger");
  }
}

// === INICIALIZAR ===
if (token()) loadUser();
showSection("home");
