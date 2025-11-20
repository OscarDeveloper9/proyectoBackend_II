// === CARRITO ===
async function updateCartCount() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/cart", { headers: headers() });
    const cart = await res.json();
    const count = cart.items.reduce((a, i) => a + i.quantity, 0);
    document.getElementById("cartCount").textContent = count;
  } catch (err) {}
}

async function loadCart() {
  if (!token()) return;
  try {
    const res = await fetch(API + "/cart", { headers: headers() });
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

    // Evento eliminar producto
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          await fetch(API + "/cart", {
            method: "DELETE",
            headers: headers(),
            body: JSON.stringify({ productId: id }),
          });
          showToast("Producto eliminado");
          loadCart();
          updateCartCount();
        } catch (err) {
          showToast("Error al eliminar", "danger");
        }
      });
    });
  } catch (err) {
    showToast("Error al cargar el carrito", "danger");
  }
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(API + "/tickets/purchase", {
      method: "POST",
      headers: headers(),
    });
    const data = await res.json();
    showToast(
      `Compra ${
        data.status === "completed" ? "completada" : "parcial"
      }! Ticket: ${data.ticket.code}`
    );
    updateCartCount();
    showSection("home");
  } catch (err) {
    showToast("Error en compra", "danger");
  }
});
