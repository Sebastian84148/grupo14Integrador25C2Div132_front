const API_URL = "http://localhost:3000/api/productos/activos";

// //Selecciono las etiquetas del html
let seccionFrutas = document.getElementById("seccion-frutas");

async function obtenerProductos() {
    try {
        let respuesta = await fetch(API_URL);
        let resultado = await respuesta.json();

        if(respuesta.ok) {
            let productos = resultado.payload;
            
            mostrarProductos(productos);

        } else {
            alert(message.error);
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

obtenerProductos();

// //Compruebo si el carrito es null mediante el metodo localStorage.getItem(), si lo es, creo el carrito. Si contiene algo lo convierto en un array con JSON.parse(carrito).
// let carrito = localStorage.getItem("carrito");

// if(carrito !== null) {
//     carrito = JSON.parse(carrito);
// }
// else {
//     carrito = [];
// }



// //Variables
// let nombreAlumno = document.getElementById("nombre-alumno");
// let barraBusqueda = document.getElementById("barra-busqueda");
// let seccionCarrito = document.getElementById("seccion-carrito");
// let cantidadCarrito = document.getElementById("cantidad-productos");


// //Funciones

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

// function agregarACarrito(id) {
//     let frutaSeleccionada = frutas.find(fru => fru.id === id);

//     carrito.push(frutaSeleccionada);

//     console.log(carrito);

//     localStorage.setItem("carrito", JSON.stringify(carrito));

//     mostrarCarrito();
// }


// function mostrarCarrito() {
//     let cartaCarrito = `
//         <div>
//             <h3>Carrito</h3>
//         </div>
//     `;

//     cartaCarrito += "<ul class='contenedor-carrito'>";

//     let total = 0;

//     carrito.forEach((elemento, i) => {
//         cartaCarrito += `
//             <li class="bloque-item">
//                 <p class="nombre-item">${elemento.nombre} - $ ${elemento.precio}</p>
//                 <button class="boton boton-eliminar" onclick="eliminarProducto(${i})">Eliminar</button>
//             </li>
//         `;

//         total += elemento.precio;
//     });

//     cartaCarrito += `</ul>`;

//     if(carrito.length > 0) {
//         cartaCarrito += `<div class="bloque-total">
//         <button class="boton boton-eliminar" onclick="vaciarCarrito()">Vaciar Carrito</button>
//         <p>Total: $ ${total}</p>
//         </div>`;
//     }

//     //Modifico el texto del parrafo para poder mostrar de forma dinamica la cantidad de productos
//     cantidadCarrito.textContent = `Carrito: ${carrito.length} Productos`;

//     seccionCarrito.innerHTML = cartaCarrito;
// }


// function eliminarProducto(i) {
//     carrito.splice(i, 1);

//     localStorage.setItem("carrito", JSON.stringify(carrito));

//     mostrarCarrito();
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


// function vaciarCarrito() {
//     carrito = [];

//     cantidadCarrito.textContent = `Carrito: ${carrito.length} Productos`;

//     seccionCarrito.innerHTML = "";
    
//     localStorage.clear();
// }


// function init() {
//     imprimirDatosAlumno();
//     mostrarProductos(frutas);
//     mostrarCarrito();
// }

// init();