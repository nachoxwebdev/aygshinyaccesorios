// Obtener el producto de la URL
const params = new URLSearchParams(window.location.search);
const productoId = params.get("producto");
const producto = productos.find(p => p.id === productoId);

if (producto) {
    const nombreElem = document.getElementById("nombre-producto");
    const precioElem = document.getElementById("precio-producto");
    const imagenElem = document.getElementById("imagen-producto");
    const descElem = document.getElementById("descripcion-producto");
    const whatsappLink = document.getElementById("whatsapp");

    if (nombreElem) nombreElem.textContent = producto.nombre;
    if (precioElem) precioElem.textContent = `$${producto.precio}`;
    if (imagenElem) {
        imagenElem.src = producto.imagen;
        imagenElem.alt = producto.nombre;
    }
    if (descElem) descElem.textContent = producto.descripcion;
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/5493364106337?text=Hola%2C%20quiero%20comprar%20${encodeURIComponent(producto.whatsapp)}`;
    }

    // Agregar al carrito pasando el evento para feedback visual
    const botonAgregar = document.getElementById("agregar-carrito-producto");
    if (botonAgregar) {
        botonAgregar.addEventListener("click", (event) => {
            window.agregarCarrito(event, producto.nombre, producto.precio);
        });
    }
} else {
    const detalleSection = document.querySelector(".producto-detalle");
    if (detalleSection) {
        detalleSection.innerHTML = "<p style='text-align:center;padding:40px'>❌ Producto no encontrado</p>";
    }
}