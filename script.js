// ======================== CARRITO GLOBAL ========================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
carrito = carrito.map(item => item.cantidad ? item : { ...item, cantidad: 1 });
localStorage.setItem("carrito", JSON.stringify(carrito));

const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const contadorCarrito = document.getElementById("contador");
const carritoPanel = document.getElementById("carrito-panel");
const buscador = document.getElementById("buscador");
const sinResultadosDiv = document.getElementById("sin-resultados");

function actualizarCarrito() {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((p, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${p.nombre} (x${p.cantidad}) - $${p.precio * p.cantidad} <button onclick="eliminarProducto(${i})">❌</button>`;
        listaCarrito.appendChild(li);
        total += p.precio * p.cantidad;
    });
    if (totalElemento) totalElemento.textContent = total;
    if (contadorCarrito) contadorCarrito.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

window.agregarCarrito = function(arg1, arg2, arg3) {
    let nombre, precio;
    if (arg1 && typeof arg1 === 'object' && arg1.target) {
        nombre = arg2;
        precio = arg3;
    } else {
        nombre = arg1;
        precio = arg2;
    }
    if (typeof precio !== 'number' || isNaN(precio)) return;

    const existente = carrito.find(p => p.nombre === nombre);
    existente ? existente.cantidad++ : carrito.push({ nombre: String(nombre), precio: Number(precio), cantidad: 1 });
    actualizarCarrito();
    if (contadorCarrito) {
        contadorCarrito.classList.add("pulse");
        setTimeout(() => contadorCarrito.classList.remove("pulse"), 400);
    }

    // Feedback visual mejorado
    let btn = null;
    if (arg1 && typeof arg1 === 'object' && arg1.target && arg1.target.tagName === 'BUTTON') {
        btn = arg1.target;
    } else {
        btn = document.activeElement;
        if (btn && btn.tagName !== 'BUTTON') btn = null;
    }

    if (btn) {
        const originalText = btn.innerText;
        const originalBg = btn.style.backgroundColor || getComputedStyle(btn).backgroundColor;
        btn.innerText = "✓ Agregado";
        btn.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = originalBg;
        }, 1000);
    }
};

window.eliminarProducto = function(index) { carrito.splice(index, 1); actualizarCarrito(); };
window.vaciarCarrito = function() { carrito = []; actualizarCarrito(); };

// ======================== PANEL CARRITO ========================
if (carritoPanel) {
    window.toggleCarrito = () => carritoPanel.style.display = carritoPanel.style.display === "block" ? "none" : "block";
    document.getElementById("cerrar-carrito")?.addEventListener("click", () => carritoPanel.style.display = "none");
}

// ======================== PEDIDO WHATSAPP ========================
window.realizarPedido = function() {
    if (!carrito.length) return alert("Carrito vacío");
    const metodo = document.getElementById("metodoPago")?.value || "No especificado";
    let mensaje = "Hola! Quiero este pedido:%0A%0A";
    carrito.forEach(p => mensaje += `${p.nombre} (x${p.cantidad}) - $${p.precio * p.cantidad}%0A`);
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    mensaje += `%0ATotal: $${total}%0AMétodo: ${metodo}`;
    window.open(`https://wa.me/5493364106337?text=${mensaje}`, "_blank");
};

// ======================== GENERAR CARDS DINÁMICAS ========================
function crearCard(prod) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", prod.id);
    card.innerHTML = `
        ${prod.badge ? `<span class="badge">${prod.badge}</span>` : ''}
        <img src="${prod.imagen}" alt="${prod.nombre}" onclick="verImagen('${prod.imagen}')" loading="lazy">
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio}</p>
        <button onclick="agregarCarrito(event, '${prod.nombre.replace(/'/g, "\\'")}', ${prod.precio})">Agregar</button>
        <a href="producto.html?producto=${prod.id}" class="ver-detalle">Ver detalle</a>
    `;
    return card;
}

function renderizarProductos() {
    const pulserasSec = document.getElementById("pulseras");
    const collaresSec = document.getElementById("collares");
    document.querySelectorAll('.skeleton-card').forEach(s => s.remove());

    productos.forEach(p => {
        const card = crearCard(p);
        if (p.categoria === "pulseras" && pulserasSec) pulserasSec.appendChild(card);
        else if (p.categoria === "collares" && collaresSec) collaresSec.appendChild(card);
    });
    observarCards();
}

// ======================== INTERSECCIÓN PARA SCROLL ========================
function observarCards() {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

// ======================== BUSCADOR ========================
if (buscador) {
    buscador.addEventListener("keyup", () => {
        const texto = buscador.value.toLowerCase().trim();
        mostrarCategoria('todos');
        let coincidencias = false;
        document.querySelectorAll(".card").forEach(card => {
            const nombre = card.querySelector("h3")?.innerText.toLowerCase() || "";
            card.style.display = nombre.includes(texto) ? "block" : "none";
            if (nombre.includes(texto)) coincidencias = true;
        });
        if (sinResultadosDiv) sinResultadosDiv.style.display = coincidencias ? "none" : "block";
    });
}

// ======================== VISOR IMAGEN ========================
window.verImagen = src => {
    document.getElementById("visor-imagen").style.display = "flex";
    document.getElementById("imagen-grande").src = src;
};
window.cerrarImagen = () => document.getElementById("visor-imagen").style.display = "none";
document.getElementById("cerrar-visor")?.addEventListener("click", window.cerrarImagen);

// ======================== MENÚS DESPLEGABLES ========================
window.toggleProductos = e => {
    e.stopPropagation();
    document.getElementById("submenu-productos").classList.toggle("show");
    document.getElementById("submenu-contacto").classList.remove("show");
};
window.toggleContacto = e => {
    e.stopPropagation();
    document.getElementById("submenu-contacto").classList.toggle("show");
    document.getElementById("submenu-productos").classList.remove("show");
};
document.addEventListener("click", () => {
    document.querySelectorAll(".submenu.show, .submenu-contacto.show").forEach(el => el.classList.remove("show"));
});

// ======================== FILTRAR POR CATEGORÍA ========================
window.mostrarCategoria = cat => {
    const pul = document.getElementById("pulseras");
    const col = document.getElementById("collares");
    const per = document.getElementById("personalizadas");
    [pul, col, per].forEach(s => s && (s.style.display = "none"));
    if (cat === "todos") {
        if (pul) pul.style.display = "grid";
        if (col) col.style.display = "grid";
        if (per) per.style.display = "block";
    } else if (cat === "pulseras" && pul) pul.style.display = "grid";
    else if (cat === "collares" && col) col.style.display = "grid";
    else if (cat === "personalizadas" && per) per.style.display = "block";
    if (carritoPanel) carritoPanel.style.display = "none";
};

// ======================== BOTÓN VOLVER ARRIBA ========================
const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) backToTop?.classList.add("visible");
    else backToTop?.classList.remove("visible");
});
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ======================== MODO OSCURO ========================
const darkToggle = document.getElementById("dark-mode-toggle");
const body = document.body;
if (localStorage.getItem("darkMode") === "true") body.classList.add("dark");
darkToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("darkMode", body.classList.contains("dark"));
});

// ======================== INICIALIZACIÓN ========================
renderizarProductos();
actualizarCarrito();
mostrarCategoria("todos");