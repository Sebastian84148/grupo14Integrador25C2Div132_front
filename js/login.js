let formLogin = document.getElementById("form-login");
let inputNombre = document.getElementById("input-nombre")

formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuarioCliente = inputNombre.value;

    if(usuarioCliente) {
        sessionStorage.setItem("usuarioCliente", usuarioCliente);
        window.location.href = "index.html";
    }
});