//Arrays
const frutas = [
    {id: 1, nombre: "arandano", precio: 5000, rutaImg: "img/arandano.jpg"},
    {id: 2, nombre: "banana", precio: 1000, rutaImg: "img/banana.jpg"},
    {id: 3, nombre: "frambuesa", precio: 4000, rutaImg: "img/frambuesa.png"},
    {id: 4, nombre: "frutilla", precio: 3000, rutaImg: "img/frutilla.jpg"},
    {id: 5, nombre: "kiwi", precio: 2000, rutaImg: "img/kiwi.jpg"},
    {id: 6, nombre: "mandarina", precio: 800, rutaImg: "img/mandarina.jpg"},
    {id: 7, nombre: "manzana", precio: 1500, rutaImg: "img/manzana.jpg"},
    {id: 8, nombre: "naranja", precio: 9000, rutaImg: "img/naranja.jpg"},
    {id: 9, nombre: "pera", precio: 2500, rutaImg: "img/pera.jpg"},
    {id: 10, nombre: "anana", precio: 3000, rutaImg: "img/anana.jpg"},
    {id: 11, nombre: "pomelo-amarillo", precio: 2000, rutaImg: "img/pomelo-amarillo.jpg"},
    {id: 12, nombre: "pomelo-rojo", precio: 2000, rutaImg: "img/pomelo-rojo.jpg"},
    {id: 13, nombre: "sandia", precio: 4500, rutaImg: "img/sandia.jpg"}
];

//Compruebo si el carrito es null mediante el metodo localStorage.getItem(), si lo es, creo el carrito. Si contiene algo lo convierto en un array con JSON.parse(carrito).
let carrito = localStorage.getItem("carrito");

if(carrito !== null) {
    carrito = JSON.parse(carrito);
}
else {
    carrito = [];
}



//Variables

//Selecciono las etiquetas del html
let seccionFrutas = document.getElementById("seccion-frutas");
let nombreAlumno = document.getElementById("nombre-alumno");
let barraBusqueda = document.getElementById("barra-busqueda");
let seccionCarrito = document.getElementById("seccion-carrito");
let cantidadCarrito = document.getElementById("cantidad-productos");


//Funciones

//Crea el objeto alumno y con el for in recorro todas las claves del objeto alumno y por cada iteracion muestro (con backticks) las claves y los valor del alumno. Despues modifico el texto del parrafo vacio del html para que contenca mi nombre y apellido.
function imprimirDatosAlumno() {
    const alumno = {dni: 44503351, nombre: "Sebastian", apellido: "Peña"};

    for(let propiedad in alumno) {
        console.log(`${propiedad}: ${alumno[propiedad]}`);
    }

    nombreAlumno.textContent = `${alumno.nombre} ${alumno.apellido}`;
}

// Muestro las frutas de forma dinamica recorriendo cada una de ellas y mostrando su informacion.
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
                <img src="${fru.rutaImg}" alt="${fru.nombre}">
                <h3>${fru.nombre}</h3>
                <p>$ ${fru.precio}</p>
                <button onclick="agregarACarrito(${fru.id})" class="boton">Agregar al carrito</button>
            </div>
        `;
    });

    cartaProducto += "</div>";

    seccionFrutas.innerHTML = cartaProducto;
}

//Le agrago un escuchador de eventos keyup a la variable barraBusqueda que contiene un input, para que llame a la funcion filtrarProductos por cada caracter que escribo.
barraBusqueda.addEventListener("keyup", filtrarProductos)

//Filtro los productos del array frutas utilizando el metodo filter para que verifique por cada fruta si su nombre es igual al valor del input. Las frutas que sean iguales se guardaran en un nuevo array llamado productosFiltrados ya que filter devuelve un nuevo array. Luego se muestra este array filtrado en pantalla con la funcion mostrar productos
function filtrarProductos() {
    let productosFiltrados = frutas.filter(fru => fru.nombre.includes(barraBusqueda.value));

    mostrarProductos(productosFiltrados);
}

//Mediante el id que recibe como parametro la funcion agregarACarrito, lo compara con cada id de cada fruta y verifica si es igual, para asi guardarla en una variable (find devuelve la primera fruta que encuentre con el mismo id en este caso) y despues hacer el push al carrito y mostrarlo por pantalla. Ademas, agregue el metodo localStorage.setItem() para que guarde de manera local el nuevo producto agregado al carrito para asi poder renderizarlo cuando se refresque la pagina o se vuelva a acceder.
function agregarACarrito(id) {
    let frutaSeleccionada = frutas.find(fru => fru.id === id);

    carrito.push(frutaSeleccionada);

    console.log(carrito);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
}

//Muestro el carrito de forma dinamica recorriendo el array carrito y por cada producto se agrega una lista que contiene su informacion, luego se inyecta al html mediante la variable seccionCarrito. Tambien se agrega el boton para vaciar el carrito.
function mostrarCarrito() {
    let cartaCarrito = `
        <div>
            <h3>Carrito</h3>
        </div>
    `;

    cartaCarrito += "<ul class='contenedor-carrito'>";

    let total = 0;

    carrito.forEach((elemento, i) => {
        cartaCarrito += `
            <li class="bloque-item">
                <p class="nombre-item">${elemento.nombre} - $ ${elemento.precio}</p>
                <button class="boton boton-eliminar" onclick="eliminarProducto(${i})">Eliminar</button>
            </li>
        `;

        total += elemento.precio;
    });

    cartaCarrito += `</ul>`;

    if(carrito.length > 0) {
        cartaCarrito += `<div class="bloque-total">
        <button class="boton boton-eliminar" onclick="vaciarCarrito()">Vaciar Carrito</button>
        <p>Total: $ ${total}</p>
        </div>`;
    }

    //Modifico el texto del parrafo para poder mostrar de forma dinamica la cantidad de productos
    cantidadCarrito.textContent = `Carrito: ${carrito.length} Productos`;

    seccionCarrito.innerHTML = cartaCarrito;
}

//Con esta funcion podemos eliminar un producto mediante su indice en el carrito, utilizando como segundo parametro del forEach() el indice y pasandolo en el llamando a la funcion eliminarProducto() que se hace cuando se clickea en el boton eliminar de cada producto del carrito. Lo hago de esta manera ya que si tengo varias frutas iguales, no puedo utilizar el id de cada una de ellas ya que me eliminaria a todas al mismo tiempo, entonces debo usar la posision de cada fruta en el array carrito para identificar a que fruta exactamente quiero eliminar. Tambien agregue el metodo localStorage.setItem() para que se actualize de manera local cuando se borra un producto y muestro por pantalla los productos en el carrito.
function eliminarProducto(i) {
    carrito.splice(i, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
}

//Mediante el uso de 2 for averiguo cual es la fruta con el menor precio o la que este mas al principio del alfabeto (basicamente el minimo) para poder intercambiar su posicion al inicion del array. Con el argumento propiedad evito tener que crear 2 funciones asi puedo utilizar la misma dependiendo de la propiedad por la cual se quiere ordenar de manera ascendente. Utilizando la primera fruta (minFruta) del array (ya que al ser la primera se asume que es la menor), la comparo con las demas para saber si las demas son menor que la primera, si encuentra uno menor asigno esta misma como menor y despues compararia esta nueva fruta menor con las que quedan. Luego guardo el valor de la primera fruta en la variable aux y asigno su valor como igual a la de minFruta (ya que es la menor) y el valor de minFruta pasa a ser el de la primera fruta del array. Al final muestro los productos ordenados.
function ordenarPorCriterio(propiedad) {
    for(let i = 0; i < frutas.length - 1; i++) {
        let minFruta = i;

        for(let j = i + 1; j < frutas.length; j++) {
            if(frutas[j][propiedad] < frutas[minFruta][propiedad]) {
                minFruta = j;
                
            }
        }

        let aux = frutas[i];
        frutas[i] = frutas[minFruta]
        frutas[minFruta] = aux;
    }

    mostrarProductos(frutas);
}

//Vacio el carrito asignandole como valor un array vacio, lo muestro en el html como "" para que ya no se muestre en pantalla y utilizo el metodo localStorage.clear() para vaciar el carrito que fue guardado de manera local.
function vaciarCarrito() {
    carrito = [];

    cantidadCarrito.textContent = `Carrito: ${carrito.length} Productos`;

    seccionCarrito.innerHTML = "";
    
    localStorage.clear();
}

//Funcion inicializadora cuya funcion es renderizar en todo momento las frutas y el carrito (si es que tiene algo guardado) tambien. Tambien se agrego la funcion imprimirDatosAlumno() en la funcion inicializadora.
function init() {
    imprimirDatosAlumno();
    mostrarProductos(frutas);
    mostrarCarrito();
}

init();