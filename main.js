/* ===================================================
   Banco de la Nación - Multired Virtual | Login
   =================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initTipoDocumento();
  initSelectDoc();
  initTecladoVirtual();
  initCaptcha();
  initFormulario();
});

/* --- Tipo de documento / tarjeta --- */
function initTipoDocumento() {
  const selectTarjeta = document.getElementById("cboTipoTarjeta");
  const customSelect = document.getElementById("cboTipoTarjeta-button");
  const statusSpan = customSelect ? customSelect.querySelector(".ui-selectmenu-status") : null;
  const menu = document.getElementById("cboTipoTarjeta-menu");

  const filaNumeroTarjeta = document.getElementById("trNumeroTarjeta");
  const filasDNI = document.querySelectorAll(".tarjeta_dni");
  const filaTipoNumDoc = document.getElementById("tipoNumDoc");

  if (!selectTarjeta || !customSelect) return;

  // Mostrar/ocultar campos según selección
  function actualizarCampos(valor) {
    const esTarjeta = valor === "tarjeta";
    filasDNI.forEach(function (el) {
      el.style.display = esTarjeta ? "" : "none";
    });
    if (filaTipoNumDoc) {
      filaTipoNumDoc.style.display = esTarjeta ? "none" : "";
    }
  }

  // Toggle menú desplegable
  customSelect.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = menu && menu.style.visibility === "visible";
    if (menu) menu.style.visibility = isOpen ? "hidden" : "visible";
  });

  // Selección de opción en menú
  if (menu) {
    menu.querySelectorAll("a[role='option']").forEach(function (option) {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        const text = this.textContent.trim();
        if (statusSpan) statusSpan.textContent = text;
        menu.style.visibility = "hidden";
        const esDNI = text.toLowerCase().includes("dni");
        actualizarCampos(esDNI ? "dni" : "tarjeta");
      });
    });
  }

  // Cerrar al hacer click fuera
  document.addEventListener("click", function (e) {
    if (menu && !customSelect.contains(e.target) && !menu.contains(e.target)) {
      menu.style.visibility = "hidden";
    }
  });
}

/* --- Selector tipo de documento (Seleccione / DNI / Pasaporte / C. Extranjeria / RUC) --- */
function initSelectDoc() {
  const btn  = document.getElementById("cboTipoDoc-button");
  const menu = document.getElementById("cboTipoDoc-menu");
  if (!btn || !menu) return;

  const status = btn.querySelector(".ui-selectmenu-status");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = menu.style.visibility === "visible";
    menu.style.visibility = isOpen ? "hidden" : "visible";
  });

  menu.querySelectorAll("a[role='option']").forEach(function (option) {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      if (status) status.textContent = this.textContent;
      menu.style.visibility = "hidden";
    });
  });

  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.style.visibility = "hidden";
    }
  });
}

/* --- Teclado virtual --- */
function initTecladoVirtual() {
  const inputClave = document.getElementById("txtPassword");
  if (!inputClave) return;

  const MAX_DIGITOS = 6;
  let claveIngresada = "";

  document.querySelectorAll(".boton-clave").forEach(function (boton) {
    if (boton.id === "limpiar") return;

    boton.addEventListener("click", function () {
      if (claveIngresada.length < MAX_DIGITOS) {
        claveIngresada += this.textContent.trim();
        // Mostrar asteriscos en el input
        inputClave.value = "*".repeat(claveIngresada.length);
      }
    });
  });

  const btnLimpiar = document.getElementById("limpiar");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      claveIngresada = "";
      inputClave.value = "";
    });
  }
}

/* --- Captcha --- */
function initCaptcha() {
  const btnCambiar = document.querySelector(".boton_captcha");
  const imgCaptcha = document.getElementById("captcha");

  if (!btnCambiar || !imgCaptcha) return;

  // En un prototipo estático solo se simula el cambio de captcha
  btnCambiar.addEventListener("click", function () {
    // Placeholder: en producción se haría un request al servidor
    console.log("Solicitar nuevo captcha");
  });
}

/* --- Formulario --- */
function initFormulario() {
  const btnIngresar = document.getElementById("btnLogin");
  if (!btnIngresar) return;

  btnIngresar.addEventListener("click", function () {
    const numTarjeta = document.getElementById("txtNumeroTarjeta");
    const password = document.getElementById("txtPassword");
    const captcha = document.getElementById("txtCaptcha");

    if (!validarFormulario(numTarjeta, password, captcha)) {
      mostrarError();
      return;
    }

    ocultarError();
    window.location.href = "inicio.html";
  });
}

function mostrarError() {
  const div = document.getElementById("mensajeError");
  if (div) div.style.display = "block";
}

function ocultarError() {
  const div = document.getElementById("mensajeError");
  if (div) div.style.display = "none";
}

function validarFormulario(numTarjeta, password, captcha) {
  if (numTarjeta && numTarjeta.style.display !== "none") {
    const val = numTarjeta.value.trim();
    if (!val || val.length !== 16) return false;
  }
  if (password && !password.value.trim()) return false;
  if (captcha && !captcha.value.trim()) return false;
  return true;
}
