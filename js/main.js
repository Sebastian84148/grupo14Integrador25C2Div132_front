const API_URL = "http://localhost:3000/api/productos/activos";

//Seleccion de etiquetas html
let seccionCarrito = document.getElementById("seccion-carrito");
let cantidadCarrito = document.getElementById("cantidad-carrito");

// //Variables
// let nombreAlumno = document.getElementById("nombre-alumno");
// let barraBusqueda = document.getElementById("barra-busqueda");

let carrito = sessionStorage.getItem("carrito");

if(carrito !== null) {
    carrito = JSON.parse(carrito);
}
else {
    carrito = [];
}

// //Selecciono las etiquetas del html
let seccionFrutas = document.getElementById("seccion-frutas");

//Variables
let productosDisponibles = [];

async function obtenerProductos() {
    try {
        let respuesta = await fetch(API_URL);
        let resultado = await respuesta.json();

        if(respuesta.ok) {
            productosDisponibles = resultado.payload;
            
            mostrarProductos(productosDisponibles);

        } else {
            alert(resultado.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function mostrarProductos(array) {
    let cartaProducto = `
            <div>
                <h3>Nuestras Frutas</h3>
            </div>
            <div class="contenedor-titulo">
                <button class="boton" onclick="ordenarPorCriterio('nombre')">Ordenar por nombre</button>
                <button class="boton" onclick="ordenarPorCriterio('precio')">Ordenar por precio</button>
            </div>
    `;

    cartaProducto += "<div class='contenedor-frutas'>";

    array.forEach(fru => {
        console.log(fru.id)
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

    seccionFrutas.innerHTML = cartaProducto;
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






// function imprimirDatosAlumno() {
//     const alumno = {dni: 44503351, nombre: "Sebastian", apellido: "Peña"};

//     for(let propiedad in alumno) {
//         console.log(`${propiedad}: ${alumno[propiedad]}`);
//     }

//     nombreAlumno.textContent = `${alumno.nombre} ${alumno.apellido}`;
// }


// barraBusqueda.addEventListener("keyup", filtrarProductos)


// function filtrarProductos() {
//     let productosFiltrados = frutas.filter(fru => fru.nombre.includes(barraBusqueda.value));

//     mostrarProductos(productosFiltrados);
// }




// function ordenarPorCriterio(propiedad) {
//     for(let i = 0; i < frutas.length - 1; i++) {
//         let minFruta = i;

//         for(let j = i + 1; j < frutas.length; j++) {
//             if(frutas[j][propiedad] < frutas[minFruta][propiedad]) {
//                 minFruta = j;
                
//             }
//         }

//         let aux = frutas[i];
//         frutas[i] = frutas[minFruta]
//         frutas[minFruta] = aux;
//     }

//     mostrarProductos(frutas);
// }





function init() {
    obtenerProductos();
}

init();