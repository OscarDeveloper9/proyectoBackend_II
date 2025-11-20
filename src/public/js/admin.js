// === ADMIN PRODUCTOS ===
async function loadAdminProducts() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/products", { headers: headers() });
    const products = await res.json();
    const list = document.getElementById("adminProductsList");
    list.innerHTML = products
      .map(
        (p) => `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between">
          <div>
            <h5>${p.name}</h5>
            <p>$${p.price} | Stock: ${p.stock}</p>
          </div>
          <div>
            <button class="btn btn-warning btn-sm edit-product" data-id="${p._id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-product" data-id="${p._id}">Eliminar</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Eventos editar
    document.querySelectorAll(".edit-product").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const product = products.find((p) => p._id === id);
        document.getElementById("productId").value = product._id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productDesc").value = product.description;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;
        new bootstrap.Modal(document.getElementById("productModal")).show();
      });
    });

    // Eventos eliminar
    document.querySelectorAll(".delete-product").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este producto?")) return;
        const id = btn.dataset.id;
        try {
          await fetch(API + `/products/${id}`, {
            method: "DELETE",
            headers: headers(),
          });
          showToast("Producto eliminado");
          loadAdminProducts();
        } catch (err) {
          showToast("Error al eliminar", "danger");
        }
      });
    });
  } catch (err) {
    showToast("Error al cargar productos", "danger");
  }
}

// Crear / Editar producto
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDesc").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);

  const method = id ? "PUT" : "POST";
  const url = API + "/products" + (id ? `/${id}` : "");

  try {
    const res = await fetch(url, {
      method,
      headers: headers(),
      body: JSON.stringify({ name, description, price, stock }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error");
    showToast(id ? "Producto actualizado" : "Producto creado");
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    loadAdminProducts();
  } catch (err) {
    showToast(err.message, "danger");
  }
});

// Botón "Nuevo Producto"
document.getElementById("newProductBtn").addEventListener("click", () => {
  document.getElementById("productId").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("productDesc").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productStock").value = "";
  new bootstrap.Modal(document.getElementById("productModal")).show();
});
