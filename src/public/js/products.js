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
            }" ${p.stock === 0 ? "disabled" : ""}>
              ${p.stock === 0 ? "Sin stock" : "Añadir al carrito"}
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Agregar evento a botones "Añadir al carrito"
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!token()) return showToast("Inicia sesión", "warning");
        const id = btn.dataset.id;
        try {
          await fetch(API + "/cart", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ productId: id, quantity: 1 }),
          });
          showToast("Añadido al carrito");
          updateCartCount();
        } catch (err) {
          showToast("Error al añadir al carrito", "danger");
        }
      });
    });
  } catch (err) {
    showToast("Error al cargar productos", "danger");
  }
}
