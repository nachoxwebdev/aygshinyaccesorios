// ======================== CARRITO GLOBAL ========================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos DOM
const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const contadorCarrito = document.getElementById("contador");
const carritoPanel = document.getElementById("carrito-panel");
const buscador = document.getElementById("buscador");
const productosCards = document.querySelectorAll(".card");
const sinResultadosDiv = document.getElementById("sin-resultados");

// ======================== FUNCIONES CARRITO ========================
function actualizarCarrito() {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="eliminarProducto(${index})">❌</button>
        `;
        listaCarrito.appendChild(li);
        total += producto.precio;
    });
    if (totalElemento) totalElemento.textContent = total;
    if (contadorCarrito) contadorCarrito.textContent = carrito.length;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// 🔧 FUNCIÓN INTELIGENTE: acepta ambos estilos de llamada
window.agregarCarrito = function(arg1, arg2, arg3) {
    let nombre, precio;
    
    // Caso 1: llamado con (event, nombre, precio)
    if (arg1 && typeof arg1 === 'object' && arg1.target) {
        // arg1 es el evento
        nombre = arg2;
        precio = arg3;
    } 
    // Caso 2: llamado con (nombre, precio) directamente
    else {
        nombre = arg1;
        precio = arg2;
    }
    
    // Validar que precio sea un número
    if (typeof precio !== 'number' || isNaN(precio)) {
        console.error("Precio inválido:", precio);
        alert("Error: el precio del producto no es válido");
        return;
    }
    
    carrito.push({ nombre: String(nombre), precio: Number(precio) });
    actualizarCarrito();
    
    // Feedback visual (intenta obtener el botón clickeado)
    let btn = null;
    if (arg1 && arg1.target) {
        btn = arg1.target;
    } else {
        // Si no hay evento, busca el botón activo (fallback)
        btn = window.event ? window.event.target : null;
    }
    
    if (btn && btn.tagName === 'BUTTON') {
        const originalText = btn.innerText;
        btn.innerText = "✓ Agregado";
        btn.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "black";
        }, 1000);
    } else {
        // Si no se pudo obtener el botón, al menos avisar
        alert(`✅ ${nombre} agregado al carrito`);
    }
};

window.eliminarProducto = function(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
};

window.vaciarCarrito = function() {
    carrito = [];
    actualizarCarrito();
};

// ======================== PANEL CARRITO ========================
window.toggleCarrito = function() {
    if (!carritoPanel) return;
    carritoPanel.style.display = carritoPanel.style.display === "block" ? "none" : "block";
};

const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener("click", () => {
        if (carritoPanel) carritoPanel.style.display = "none";
    });
}

// ======================== PEDIDO POR WHATSAPP ========================
window.realizarPedido = function() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    const metodoSelect = document.getElementById("metodoPago");
    let metodo = metodoSelect ? metodoSelect.value : "No especificado";
    let mensaje = "Hola! Quiero realizar el siguiente pedido:%0A%0A";
    carrito.forEach(p => {
        // Asegurar que precio sea número
        const precioValido = typeof p.precio === 'number' ? p.precio : 0;
        mensaje += `${p.nombre} - $${precioValido}%0A`;
    });
    const total = carrito.reduce((acc, p) => acc + (typeof p.precio === 'number' ? p.precio : 0), 0);
    mensaje += `%0ATotal: $${total}%0AMétodo de pago: ${metodo}%0A%0A¡Gracias!`;
    window.open(`https://wa.me/5493364106337?text=${mensaje}`, "_blank");
};

// ======================== BUSCADOR ========================
if (buscador) {
    buscador.addEventListener("keyup", () => {
        const texto = buscador.value.toLowerCase().trim();
        let hayCoincidencias = false;
        productosCards.forEach(card => {
            const nombre = card.querySelector("h3")?.innerText.toLowerCase() || "";
            if (nombre.includes(texto)) {
                card.style.display = "block";
                hayCoincidencias = true;
            } else {
                card.style.display = "none";
            }
        });
        if (sinResultadosDiv) {
            sinResultadosDiv.style.display = hayCoincidencias ? "none" : "block";
        }
    });
}

// ======================== VISOR DE IMÁGENES ========================
window.verImagen = function(src) {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");
    if (visor && imagenGrande) {
        visor.style.display = "flex";
        imagenGrande.src = src;
    }
};

window.cerrarImagen = function() {
    const visor = document.getElementById("visor-imagen");
    if (visor) visor.style.display = "none";
};

const cerrarVisor = document.getElementById("cerrar-visor");
if (cerrarVisor) {
    cerrarVisor.addEventListener("click", cerrarImagen);
}

// ======================== MENÚS DESPLEGABLES ========================
window.toggleProductos = function(e) {
    e.stopPropagation();
    const submenuProductos = document.getElementById("submenu-productos");
    const submenuContacto = document.getElementById("submenu-contacto");
    if (submenuProductos) submenuProductos.classList.toggle("show");
    if (submenuContacto) submenuContacto.classList.remove("show");
};

window.toggleContacto = function(e) {
    e.stopPropagation();
    const submenuProductos = document.getElementById("submenu-productos");
    const submenuContacto = document.getElementById("submenu-contacto");
    if (submenuContacto) submenuContacto.classList.toggle("show");
    if (submenuProductos) submenuProductos.classList.remove("show");
};

document.addEventListener("click", () => {
    const subP = document.getElementById("submenu-productos");
    const subC = document.getElementById("submenu-contacto");
    if (subP) subP.classList.remove("show");
    if (subC) subC.classList.remove("show");
});

// ======================== FILTRAR POR CATEGORÍA ========================
window.mostrarCategoria = function(categoria) {
    const pulseras = document.getElementById("pulseras");
    const collares = document.getElementById("collares");
    const personalizadas = document.getElementById("personalizadas");

    if (pulseras) pulseras.style.display = "none";
    if (collares) collares.style.display = "none";
    if (personalizadas) personalizadas.style.display = "none";

    if (categoria === "todos") {
        if (pulseras) pulseras.style.display = "grid";
        if (collares) collares.style.display = "grid";
        if (personalizadas) personalizadas.style.display = "block";
    } else if (categoria === "pulseras") {
        if (pulseras) pulseras.style.display = "grid";
    } else if (categoria === "collares") {
        if (collares) collares.style.display = "grid";
    } else if (categoria === "personalizadas") {
        if (personalizadas) personalizadas.style.display = "block";
    }

    if (carritoPanel) carritoPanel.style.display = "none";
};

// ======================== INICIALIZACIÓN ========================
actualizarCarrito();
mostrarCategoria("todos");