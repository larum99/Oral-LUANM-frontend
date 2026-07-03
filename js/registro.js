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
        email: document.getElementById("correo").value.trim().toLowerCase(),
        telefono: document.getElementById("telefono").value.trim(),
        fechaNacimiento: document.getElementById("fecha").value,
        tipoDocumento: document.getElementById("tipo-documento").value,
        documento: document.getElementById("documento").value.trim(),
        password: document.getElementById("password").value,
        role: "cliente",
        path: "registro/cliente/index.html"
    };
}

const formulario = document.getElementById("registro-form");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();
    const usuario = obtenerDatosForm();

    const usuariosGuardados = JSON.parse(
        localStorage.getItem("oralLuanmUsers")
    ) || [];

    // Verificar que el correo no exista
    const usuarioExistente = usuariosGuardados.find(
        (item) => item.email === usuario.email
    );

    if (usuarioExistente) {
        alert("Ya existe una cuenta registrada con ese correo.");
        return;
    }

    usuariosGuardados.push(usuario);

    // Guardar todos los usuarios
    localStorage.setItem(
        "oralLuanmUsers",
        JSON.stringify(usuariosGuardados)
    );

    // Preguntarle a Nico
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosGuardados)
    );

    // Crear la sesión del usuario recién registrado
    localStorage.setItem(
        "oralLuanmUser",
        JSON.stringify(usuario)
    );

    console.log(usuariosGuardados);

    window.location.href = "cliente/index.html";
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