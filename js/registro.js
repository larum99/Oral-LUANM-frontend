/* ==========================================================================
   REGISTRO.JS
   Flujo del formulario por pasos
   ========================================================================== */


const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");

function obtenerDatosForm() {
    return {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        fechaDeNacimiento: document.getElementById("fecha").value,
        tipoDocumento: document.getElementById("tipo-documento").value,
        numeroDeDocumento: document.getElementById("documento").value.trim(),
        password: document.getElementById("password").value
    };
}

const formulario = document.getElementById("registro-form");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();
    const usuario = obtenerDatosForm();

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuariosGuardados.push(usuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosGuardados)

    );
    console.log(usuariosGuardados);

});

const btnSiguiente = document.getElementById("btn-siguiente");
const btnAnterior = document.getElementById("btn-anterior");

const paso1 = document.getElementById("paso-1");
const paso2 = document.getElementById("paso-2");

function validarPaso1() {

    const campos = step1.querySelectorAll("input[required], select[required]");

    for (const campo of campos) {
        if (!campo.value.trim()) {
            campo.focus();
            return false;
        }
    }
    return true;
}


btnSiguiente.addEventListener("click", () => {

    if (!validarPaso1()) {
        return;
    }

    step1.classList.remove("active");
    step2.classList.add("active");

    paso1.classList.remove("activo");
    paso2.classList.add("activo");

});

btnAnterior.addEventListener("click", () => {

    step2.classList.remove("active");
    step1.classList.add("active");

    paso2.classList.remove("activo");
    paso1.classList.add("activo");

});