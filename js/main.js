//Seleccion de etiquetas html
let seccionProductos = document.getElementById("seccion-productos");
let seccionCarrito = document.getElementById("seccion-carrito");
let cantidadCarrito = document.getElementById("cantidad-carrito");
let barraBusqueda = document.getElementById("barra-busqueda");


//Variables
const API_URL = "http://localhost:3000/api/productos/activos";
const API_VENTAS = "http://localhost:3000/api/ventas";
let carrito = [];
let productosDisponibles = [];


//Funciones
function verificarLogin() {
    let usuarioCliente = sessionStorage.getItem("usuarioCliente");
    
    if(!usuarioCliente) {
        location.href = "login.html";
    }

    let nombreCliente = document.getElementById("nombre-cliente");
    
    nombreCliente.textContent = `Bienvenido ${usuarioCliente}`;

    obtenerProductos();
}

async function obtenerProductos() {
    try {
        let respuesta = await fetch(API_URL);
        let resultado = await respuesta.json();

        if(respuesta.ok) {
            productosDisponibles = resultado.payload;
            
            mostrarProductos(productosDisponibles);

        } else {
            alert(resultado.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function mostrarProductos(array) {
    let cartaProducto = `
            <div>
                <h3>Nuestros Productos</h3>
            </div>
            <div class="contenedor-titulo">
                <button class="boton" onclick="ordenarPorCriterio('nombre')">Ordenar por nombre</button>
                <button class="boton" onclick="ordenarPorCriterio('precio')">Ordenar por precio</button>
            </div>
    `;

    cartaProducto += "<div class='contenedor-productos'>";

    array.forEach(fru => {
        cartaProducto += `
            <div class="card-producto">
                <img src="${fru.img_url}" alt="${fru.nombre}">
                <h3>${fru.nombre}</h3>
                <p>$ ${fru.precio}</p>
                <button onclick="agregarACarrito(${fru.id})" class="boton">Agregar al carrito</button>
            </div>
        `;
    });

    cartaProducto += "</div>";

    seccionProductos.innerHTML = cartaProducto;
}

function ordenarPorCriterio(criterio) {
    if (criterio === 'precio') {
        productosDisponibles.sort((a, b) => a.precio - b.precio);

    } else if (criterio === 'nombre') {
        productosDisponibles.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    mostrarProductos(productosDisponibles);
}

function agregarACarrito(id) {
    let productoSeleccionado = productosDisponibles.find(prod => prod.id === id);

    let productoEnCarrito = carrito.find(prod => prod.id === id);

    if(productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad: 1 });
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
}

function mostrarCarrito() {
    let cartaCarrito = `
        <div class="titulo-carrito">
            <h3>Carrito</h3>
        </div>
    `;

    cartaCarrito += "<ul class='contenedor-carrito'>";

    let total = 0;
    let totalUnidades = 0;
    
    carrito.forEach((prod, i) => {
        const subTotal = prod.precio * prod.cantidad;
        total += subTotal;
        totalUnidades += prod.cantidad;

        cartaCarrito += `
            <li class="bloque-item">
                <div class="info-producto">
                    <p class="nombre-item"><strong>${prod.nombre}</strong></p>
                    <p>$${prod.precio} x ${prod.cantidad} = <strong>$${subTotal}</strong></p>
                </div>
                <div class="acciones-item">
                    <button class="boton-chico" onclick="restarCantidad(${i})">-</button>
                    <button class="boton-chico" onclick="sumarCantidad(${i})">+</button>
                    <button class="boton-eliminar" onclick="eliminarProducto(${i})">Eliminar</button>
                </div>
            </li>
        `;

    });

    cartaCarrito += `</ul>`;

    if(carrito.length > 0) {
        cartaCarrito += `
            <div class="bloque-total">
                <div class="botones-finales">
                    <button class="boton-vaciar" onclick="vaciarCarrito()">Vaciar carrito</button>
                    <button class="boton-finalizar" onclick="finalizarCompra()">Imprimir ticket</button>
                </div>
                <p class="total-texto">Total: $ ${total}</p>
            </div>
        `;
    } else {
        cartaCarrito += `<p class="carrito-vacio">El carrito está vacío</p>`;
    }

    if(cantidadCarrito) {
        cantidadCarrito.textContent = `Carrito: ${totalUnidades} Productos`;
    }

    seccionCarrito.innerHTML = cartaCarrito;
}

function sumarCantidad(i) {
    carrito[i].cantidad++;

    guardarYRenerizarCarrito();
}

function restarCantidad(i) {
    if(carrito[i].cantidad > 1) {
        carrito[i].cantidad--;
    } else {
        carrito.splice(i, 1);
    }

    guardarYRenerizarCarrito();
}

function eliminarProducto(i) {
    carrito.splice(i, 1);

    guardarYRenerizarCarrito();
}

function guardarYRenerizarCarrito() {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];

    guardarYRenerizarCarrito();
}

async function finalizarCompra() {
    console.table(carrito);

    if(carrito.length === 0) {
        return alert("El carrito esta vacio");
    }

    const usuarioCliente = sessionStorage.getItem("usuarioCliente");

    const precioTotal = carrito.reduce((total, prod) => total + (prod.precio * prod.cantidad), 0);

    let idProductos = [];

    carrito.forEach(prod => idProductos.push(prod.id));

    try {
        const ventaExitosa = await registrarVenta(precioTotal, idProductos, usuarioCliente);

        if(ventaExitosa) {
            imprimirTicket(usuarioCliente, precioTotal);

            alert("¡Compra realizada con éxito! Tu ticket se está descargando.");

            sessionStorage.removeItem("carrito");
            sessionStorage.removeItem("usuarioCliente");

            location.href = "login.html"
        }
    } catch (error) {
        console.error("Error en el proceso de compra:", error);
        alert("Hubo un error al procesar tu compra. Por favor intenta de nuevo.");
    }
}

async function registrarVenta(precioTotal, idProductos, nombreCliente) {
    const fecha = new Date()
    .toLocaleString("sv-SE", { hour12: false })  
    .replace("T", " ");

    const data = {
        date: fecha,
        total_price: precioTotal,
        user_name: nombreCliente,
        products: idProductos
    }

    try {
        const response  = await fetch(API_VENTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();

        if(response.ok) {
            alert("Venta creada con exito");
        
            return true;
        } else {
            console.error("Error del servidor:", resultado.message);
            alert("Error al registrar venta: " + resultado.message);

            return false;
        }
    } catch (error) {
        console.error("Error de red:", error);

        return false;
    }
}

function imprimirTicket(usuarioCliente, precioTotal) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("Ticket de compra:", 20, y);
    y += 15;

    doc.setFontSize(12);
    doc.text(`Cliente: ${usuarioCliente}`, 20, y);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, y);
    y += 15;

    doc.text("Producto", 20, y);
    doc.text("Cant.", 120, y);
    doc.text("Precio", 150, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    carrito.forEach(prod => {
        const nombreRecortado = prod.nombre.length > 40 ? prod.nombre.substring(0, 40) + "..." : prod.nombre;
        doc.text(nombreRecortado, 20, y);
        doc.text(prod.cantidad.toString(), 125, y);
        doc.text(`$${prod.precio * prod.cantidad}`, 150, y);
        y += 10;
    });

    y += 5;
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Total: $${precioTotal}`, 120, y);

    // Guardar
    doc.save(`ticket_${Date.now()}.pdf`);
}

barraBusqueda.addEventListener("keyup", filtrarProductos)

function filtrarProductos() {
    let productosFiltrados = productosDisponibles.filter(prod => prod.nombre.toLowerCase().includes(barraBusqueda.value));

    mostrarProductos(productosFiltrados);
}

function init() {
    verificarLogin();
}

init();