import "./style.css";

let cart = {};

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    const cartItems = document.getElementById("cart-items"); // Contenedor donde se listan los productos del carrito
    const postres = document.getElementById("postres"); // Contenedor donde se muestran los productos
    const counterCart = document.getElementById("counter-cart"); // Texto que muestra la cantidad total de productos en el carrito
    const emptyMessage = document.getElementById("empty-message"); // Mensaje de "carrito vacío"
    const emptyImage = document.getElementById("empty-cart-image"); // Imagen que se muestra cuando el carrito está vacío

    data.forEach((postre) => {
      const newDiv = document.createElement("DIV"); // Crea un div para el postre
      newDiv.classList.add("postre"); // Le añade clase para estilos

      // Rellena el contenido del postre (imagen, nombre, precio, botón "Add to Cart")
      newDiv.innerHTML = `<img class="rounded-lg w-60" src="${
        postre.image.desktop
      }" alt="${postre.name}">
        <div class="flex justify-center">
          <button class="add-cart bg-white border border-solid cursor-pointer flex gap-2 
          px-4 py-2 rounded-4xl text-red-800 max-[420px]:mr-15">
            <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart">
            Add to Cart
          </button>
        </div>
        <div class="mt-5">
          <h2 class="text-xm text-rose-900">${postre.category}</h2>
          <h3 class="text-lg text-rose-950 font-bold">${postre.name}</h3>
          <p class="font-medium text-xl text-red-500">$${postre.price.toFixed(
            2
          )}</p>
        </div>`;

      postres.appendChild(newDiv); // Agrega el postre al contenedor principal

      const button = newDiv.querySelector(".add-cart");
      button.addEventListener("click", () => {
        // Si el producto ya está en el carrito, aumenta su cantidad
        if (cart[postre.name]) {
          cart[postre.name].quantity += 1;
        } else {
          // Si no, lo agrega con cantidad 1
          cart[postre.name] = { ...postre, quantity: 1 };
        }

        updateCartDisplay(); // Actualiza el carrito en pantalla
      });
    });

    function updateCartDisplay() {
      cartItems.innerHTML = ""; // Limpia el contenido actual del carrito

      const itemsArray = Object.values(cart); // Convierte el objeto en array
      const totalQuantity = itemsArray.reduce(
        (acc, item) => acc + item.quantity,
        0
      ); // Suma total de productos

      counterCart.innerText = `Your Cart (${totalQuantity})`; // Muestra la cantidad de ítems en el texto

      // Si el carrito está vacío, muestra el mensaje y la imagen de "vacío"
      if (totalQuantity === 0) {
        emptyImage.style.display = "block";
        emptyMessage.style.display = "block";
        return;
      } else {
        // Si hay productos, oculta los mensajes
        emptyImage.style.display = "none";
        emptyMessage.style.display = "none";
      }

      itemsArray.forEach((item) => {
        const itemDiv = document.createElement("DIV"); // Crea contenedor para el producto
        itemDiv.classList.add(
          "flex",
          "justify-between",
          "items-center",
          "text-sm",
          "text-rose-900",
          "border-b",
          "py-1"
        );

        // Muestra el nombre, cantidad y total por ese producto
        itemDiv.innerHTML = `
          <span>${item.name} (x${item.quantity})</span>
          <div class="flex items-center gap-2">
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-name="${item.name}">
              <img class="cursor-pointer" src="assets/images/icon-remove-item.svg" alt="Remove Icon" class="w-4 h-4">
            </button>
          </div>
        `;

        cartItems.appendChild(itemDiv); // Lo agrega al carrito
      });

      // Asignar eventos a botones de quitar
      const removeButtons = cartItems.querySelectorAll(".remove-item");
      removeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const name = e.currentTarget.getAttribute("data-name");
          if (cart[name]) {
            cart[name].quantity -= 1;
            if (cart[name].quantity === 0) {
              delete cart[name]; // Elimina el producto si su cantidad es 0
            }
            updateCartDisplay(); // Vuelve a mostrar el carrito actualizado
          }
        });
      });

      if (itemsArray.length > 0) {
        const totalAmount = itemsArray.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        const totalDiv = document.createElement("DIV");
        totalDiv.classList.add(
          "flex",
          "justify-between",
          "font-bold",
          "text-rose-950",
          "pt-3",
          "text-base",
          "border-t",
          "mt-2"
        );
        totalDiv.innerHTML = `
        <span>Order Total:</span>
        <span>$${totalAmount.toFixed(2)}</span>`;
        cartItems.appendChild(totalDiv); // Muestra total del carrito

        // Crea el botón de enviar pedido
        const submitBtn = document.createElement("BUTTON");
        submitBtn.innerText = "Submit Order";
        submitBtn.classList.add(
          "mt-4",
          "bg-rose-700",
          "text-white",
          "w-full",
          "py-2",
          "rounded-lg",
          "hover:bg-rose-800",
          "transition",
          "cursor-pointer"
        );

        // Evento al hacer clic en el botón
        submitBtn.addEventListener("click", () => {
          alert("Thank you! Your order has been submitted."); // Mensaje de confirmación
          cart = {}; // Vacía el carrito
          updateCartDisplay(); // Actualiza la vista del carrito
        });

        cartItems.appendChild(submitBtn); // Agrega el botón al DOM
      }
    }
  })
  .catch((error) => console.error("Error cargando la información", error));
