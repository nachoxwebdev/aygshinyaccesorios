// Base de datos de productos
const productosDB = {
    "pulsera-azul": {
        nombre: "Pulsera Cristal Azul",
        precio: 3000,
        imagen: "imagenes/pulsera-cristal-azul.PNG",
        descripcion: "Hermosa pulsera de cristales azules, ideal para cualquier ocasión. Hecha a mano con materiales de calidad.",
        whatsapp: "Pulsera Cristal Azul"
    },
    "pulsera-negra": {
        nombre: "Pulsera Piedras Negras",
        precio: 3000,
        imagen: "imagenes/pulsera-piedras-negras.PNG",
        descripcion: "Pulsera de piedras negras, estilo minimalista y elegante.",
        whatsapp: "Pulsera Piedras Negras"
    },
    "pulsera-3-estrellas": {
        nombre: "Pulsera 3 Estrellas",
        precio: 3000,
        imagen: "imagenes/pulsera-3-estrellas.png",
        descripcion: "Pulsera con tres estrellas brillantes, muy femenina.",
        whatsapp: "Pulsera 3 Estrellas"
    },
    "pulsera-celeste": {
        nombre: "Pulsera Piedras Celestes",
        precio: 3000,
        imagen: "imagenes/pulsera-celeste-blanca.PNG",
        descripcion: "Combinación de celeste y blanco, suave y delicada.",
        whatsapp: "Pulsera Celeste Blanca"
    },
    "pulsera-violeta": {
        nombre: "Pulsera Perla y Cristales Violetas",
        precio: 3000,
        imagen: "imagenes/pulsera-perla-violeta.png",
        descripcion: "Perlas y cristales violetas, un toque de distinción.",
        whatsapp: "Pulsera Perla y Violeta"
    },
    "combo-corazon": {
        nombre: "Combo 2 pulseras medio corazón",
        precio: 5000,
        imagen: "imagenes/combo-2-pulseras-corazon.PNG",
        descripcion: "Dos pulseras que forman un corazón cuando se juntan. Perfecto para compartir.",
        whatsapp: "Combo 2 pulseras corazón"
    },
    "collar-margarita": {
        nombre: "Collar Margarita Dorado y Perla",
        precio: 4000,
        imagen: "imagenes/collar-flor.jpeg",
        descripcion: "Collar con dije de margarita dorada y perla blanca.",
        whatsapp: "Collar Margarita Dorado"
    },
    "collar-ostras": {
        nombre: "Collar negro con Ostras",
        precio: 4000,
        imagen: "imagenes/collar-de-ostras.png",
        descripcion: "Collar negro con dije de ostra brillante.",
        whatsapp: "Collar de Ostras"
    },
    "collar-margarita-negro": {
        nombre: "Collar Margarita Negro y Perla",
        precio: 4000,
        imagen: "imagenes/collar-margarita-negro-blanco.PNG",
        descripcion: "Versión en negro y blanco de la margarita con perla.",
        whatsapp: "Collar Margarita Negro"
    },
    "collar-violeta": {
        nombre: "Collar Flor Violeta",
        precio: 4000,
        imagen: "imagenes/collar-flor-violeta-perla.PNG",
        descripcion: "Flor violeta con perla central, muy romántico.",
        whatsapp: "Collar Flor Violeta"
    }
};

// Obtener el producto de la URL
const params = new URLSearchParams(window.location.search);
const productoId = params.get("producto");
const producto = productosDB[productoId];

if (producto) {
    const nombreElem = document.getElementById("nombre-producto");
    const precioElem = document.getElementById("precio-producto");
    const imagenElem = document.getElementById("imagen-producto");
    const descElem = document.getElementById("descripcion-producto");
    const whatsappLink = document.getElementById("whatsapp");

    if (nombreElem) nombreElem.textContent = producto.nombre;
    if (precioElem) precioElem.textContent = `$${producto.precio}`;
    if (imagenElem) imagenElem.src = producto.imagen;
    if (descElem) descElem.textContent = producto.descripcion;
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/5493364106337?text=Hola%2C%20quiero%20comprar%20${encodeURIComponent(producto.whatsapp)}`;
    }
} else {
    const detalleSection = document.querySelector(".producto-detalle");
    if (detalleSection) {
        detalleSection.innerHTML = "<p style='text-align:center;padding:40px'>❌ Producto no encontrado</p>";
    }
}

// Agregar al carrito desde producto.html
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonAgregar = document.getElementById("agregar-carrito-producto");
if (botonAgregar && producto) {
    botonAgregar.addEventListener("click", () => {
        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio
        });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`✅ ${producto.nombre} agregado al carrito`);
        
        // Feedback visual en el botón
        const originalText = botonAgregar.innerText;
        botonAgregar.innerText = "✓ Agregado";
        botonAgregar.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            botonAgregar.innerText = originalText;
            botonAgregar.style.backgroundColor = "black";
        }, 1000);
    });
}