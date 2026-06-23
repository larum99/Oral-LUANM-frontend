
// funcionalidad login y register ramiro -----------------------------------------

// funcionalidad para abrir el modal de registro desde el modal de inicio de sesión

document.getElementById('btnAbrirRegister').addEventListener('click', function(){
   const loginMd = bootstrap.Modal.getInstance(
        document.getElementById('appointmentModal')
   ); 
   loginMd.hide();

   setTimeout( () => {
        const registerMd = new bootstrap.Modal(
            document.getElementById('registerModal')
        );
        registerMd.show();
   }, 300)
});

// funcionalidad validacones con bootstrap

const formularios = document.querySelectorAll('.needs-validation');
    formularios.forEach( formulario => {
        formulario.addEventListener('submit', evento => {
            if(!formulario.checkValidity()){
                evento.preventDefault();
                evento.stopPropagation();
                formulario.classList.add('was-validated');
            }else{
                evento.preventDefault();

                const mensaje = document.createElement('div');
                mensaje.className = 'alert alert-success mt-3 alert-dismissible fade show';
                mensaje.setAttribute('role', 'alert');
                mensaje.innerHTML = `
                    <strong>¡Proceso exitoso!</strong>. Bienvenido a la comunidad Oral LUANM.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                `;

                formulario.appendChild(mensaje);
                formulario.reset();
                formulario.classList.remove('was-validated');

                setTimeout(() => {
                    const alerta = new bootstrap.Alert(mensaje);
                    alerta.close();
                    window.location.href = 'index.html';
                }, 2000);
            }
        }, false);
    });



// funcionalidad login y register ramiro CIERRE ----------------------------------------
