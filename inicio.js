/* ===================================================
   Banco de la Nación - Multired Virtual | Inicio
   =================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initAccordion();
  initPaneles();
  initBuscadorServicios();
  initPagoInmediato();
});

/* --- Sistema de paneles de contenido --- */
function initPaneles() {
  document.querySelectorAll("#navegacion a[data-panel]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var panelId = this.getAttribute("data-panel");
      mostrarPanel(panelId);

      // Marcar enlace activo
      document.querySelectorAll("#navegacion a").forEach(function (a) {
        a.classList.remove("sub-active");
      });
      this.classList.add("sub-active");

      // Cerrar sub-submenús (accordionContent1) dentro del accordionContent padre
      var parentContent = link.closest(".accordionContent");
      if (parentContent) {
        parentContent.querySelectorAll(".accordionContent1").forEach(function (sub) {
          sub.style.display = "none";
        });
        parentContent.querySelectorAll(".has-sub").forEach(function (a) {
          a.classList.remove("sub-active");
        });
      }
    });
  });
}

function mostrarPanel(id) {
  document.querySelectorAll("#contenidos-informativos .panel").forEach(function (p) {
    p.style.display = "none";
  });
  var panel = document.getElementById(id);
  if (panel) panel.style.display = "block";
}

/* --- Accordion menú lateral --- */

function cerrarTodoAccordion() {
  document.querySelectorAll("#navegacion .accordionButton.has-children").forEach(function (btn) {
    btn.classList.remove("open");
    var content = btn.nextElementSibling;
    if (!content) return;
    content.style.display = "none";
    content.querySelectorAll(".accordionContent1").forEach(function (sub) {
      sub.style.display = "none";
    });
    content.querySelectorAll(".has-sub").forEach(function (a) {
      a.classList.remove("sub-active");
    });
  });
}

function initAccordion() {
  // Botones con submenú (has-children)
  document.querySelectorAll("#navegacion .accordionButton.has-children").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (e.target.tagName === "A") e.preventDefault();

      var content = btn.nextElementSibling;
      if (!content || !content.classList.contains("accordionContent")) return;

      var isOpen = btn.classList.contains("open");

      cerrarTodoAccordion();

      if (!isOpen) {
        btn.classList.add("open");
        content.style.display = "block";
      }
    });
  });

  // Botones sin submenú: cerrar todos los acordeones abiertos
  document.querySelectorAll("#navegacion .accordionButton:not(.has-children)").forEach(function (btn) {
    btn.addEventListener("click", function () {
      cerrarTodoAccordion();
    });
  });

  // Sub-submenús (accordionContent1): no tocan el accordion padre
  document.querySelectorAll("#navegacion .accordionContent .has-sub").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      var sub = link.nextElementSibling;
      if (!sub || !sub.classList.contains("accordionContent1")) return;

      var isOpen = sub.style.display === "block";

      var parent = link.closest(".accordionContent");
      parent.querySelectorAll(".accordionContent1").forEach(function (el) {
        el.style.display = "none";
      });
      parent.querySelectorAll(".has-sub").forEach(function (a) {
        a.classList.remove("sub-active");
      });

      if (!isOpen) {
        sub.style.display = "block";
        link.classList.add("sub-active");
      }
    });
  });

  // Enlaces de submenú con data-panel: no tocan el accordion, solo cambian el panel
  // (el accordion padre permanece abierto tal cual)
}

/* --- Pago inmediato: flujo paso 1 → paso 2 --- */
function initPagoInmediato() {
  var paso1           = document.getElementById("pago-paso1");
  var paso2           = document.getElementById("pago-paso2");
  if (!paso1 || !paso2) return;

  var selectCuenta    = document.getElementById("pago-cuenta-origen");
  var btnQuitar       = document.getElementById("btn-quitar");
  var radioFrecuentes = document.getElementById("radio-frecuentes");
  var radioNuevo      = document.getElementById("radio-nuevo");
  var camposFrecuentes = document.getElementById("campos-frecuentes");
  var camposNuevo     = document.getElementById("campos-nuevo");
  var selectFrecuente = document.getElementById("pago-frecuente");
  var btnContinuar    = document.getElementById("btn-pago-continuar");
  var btnRegresar     = document.getElementById("btn-pago-regresar");
  var btnContinuar2   = document.getElementById("btn-pago-continuar2");

  // Lista de tarjetas frecuentes (se va poblando con los pagos realizados)
  var tarjetasFrecuentes = [];

  function poblarSelectFrecuente() {
    if (!selectFrecuente) return;
    // Conservar primera opción
    selectFrecuente.innerHTML = '<option value="">Seleccione...</option>';
    tarjetasFrecuentes.forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t.numero;
      opt.textContent = t.banco + " - " + t.numero;
      selectFrecuente.appendChild(opt);
    });
  }

  // DESAFILIAR TARJETA: activo solo si hay frecuente seleccionada
  function actualizarQuitar() {
    var esFrecuentes = radioFrecuentes && radioFrecuentes.checked;
    var frecuenteOk  = selectFrecuente && selectFrecuente.value !== "";
    if (btnQuitar) btnQuitar.disabled = !(esFrecuentes && frecuenteOk);
  }

  if (selectFrecuente) selectFrecuente.addEventListener("change", actualizarQuitar);

  // Modal desafiliar
  var modal            = document.getElementById("modal-desafiliar");
  var btnConfirmar     = document.getElementById("btn-confirmar-desafiliar");
  var btnCancelarModal = document.getElementById("btn-cancelar-desafiliar");

  if (btnQuitar) {
    btnQuitar.addEventListener("click", function () {
      if (modal) modal.style.display = "block";
    });
  }
  if (btnCancelarModal) {
    btnCancelarModal.addEventListener("click", function () {
      if (modal) modal.style.display = "none";
    });
  }
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      if (!selectFrecuente) return;
      var numeroEliminar = selectFrecuente.value;
      tarjetasFrecuentes = tarjetasFrecuentes.filter(function (t) {
        return t.numero !== numeroEliminar;
      });
      poblarSelectFrecuente();
      actualizarQuitar();
      if (modal) modal.style.display = "none";
    });
  }

  // Mostrar campos según modo
  function actualizarModo() {
    var esNuevo = radioNuevo && radioNuevo.checked;
    if (camposFrecuentes) camposFrecuentes.style.display = esNuevo ? "none" : "block";
    if (camposNuevo)      camposNuevo.style.display      = esNuevo ? "block" : "none";
    actualizarQuitar();
  }
  if (radioFrecuentes) radioFrecuentes.addEventListener("change", actualizarModo);
  if (radioNuevo)      radioNuevo.addEventListener("change", actualizarModo);

  // CONTINUAR paso 1 → paso 2
  if (btnContinuar) {
    btnContinuar.addEventListener("click", function () {
      var esNuevo = radioNuevo && radioNuevo.checked;

      var cuentaTexto = selectCuenta && selectCuenta.value
        ? selectCuenta.options[selectCuenta.selectedIndex].text : "—";

      var bancoEl    = document.getElementById("pago-banco-destino");
      var tarjetaEl  = document.getElementById("pago-nro-tarjeta");
      var bancoTexto   = esNuevo && bancoEl && bancoEl.value    ? bancoEl.value    : "—";
      var tarjetaTexto = esNuevo && tarjetaEl && tarjetaEl.value ? tarjetaEl.value : "—";

      // Si es frecuente, leer del selector
      if (!esNuevo && selectFrecuente && selectFrecuente.value) {
        var selOpt = selectFrecuente.options[selectFrecuente.selectedIndex];
        tarjetaTexto = selectFrecuente.value;
        // Extraer banco del texto "Banco - Numero"
        bancoTexto = selOpt.textContent.split(" - ")[0];
      }

      document.getElementById("conf-cuenta").textContent  = cuentaTexto;
      document.getElementById("conf-banco").textContent   = bancoTexto;
      document.getElementById("conf-tarjeta").textContent = tarjetaTexto;

      // Guardar datos del paso para usarlos al confirmar
      paso2.dataset.banco   = bancoTexto;
      paso2.dataset.numero  = tarjetaTexto;
      paso2.dataset.esNuevo = esNuevo ? "1" : "0";

      paso1.style.display = "none";
      paso2.style.display = "block";
    });
  }

  // REGRESAR paso 2 → paso 1
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      paso2.style.display = "none";
      paso1.style.display = "block";
    });
  }

  // CONTINUAR paso 2 → pago realizado, agregar a frecuentes y volver al paso 1
  if (btnContinuar2) {
    btnContinuar2.addEventListener("click", function () {
      var esNuevo = paso2.dataset.esNuevo === "1";
      if (esNuevo) {
        var banco  = paso2.dataset.banco;
        var numero = paso2.dataset.numero;
        if (banco && numero && banco !== "—" && numero !== "—") {
          // Agregar a frecuentes si no existe ya
          var existe = tarjetasFrecuentes.some(function (t) { return t.numero === numero; });
          if (!existe) {
            tarjetasFrecuentes.push({ banco: banco, numero: numero });
            poblarSelectFrecuente();
          }
        }
      }
      // Volver al paso 1 en modo Frecuentes
      paso2.style.display = "none";
      paso1.style.display = "block";
      if (radioFrecuentes) { radioFrecuentes.checked = true; }
      actualizarModo();
    });
  }

  // Resetear al cambiar de panel
  function resetearPago() {
    paso2.style.display = "none";
    paso1.style.display = "block";
    if (radioFrecuentes) radioFrecuentes.checked = true;
    actualizarModo();
    if (selectCuenta) selectCuenta.selectedIndex = 0;
    var bancoEl   = document.getElementById("pago-banco-destino");
    var tarjetaEl = document.getElementById("pago-nro-tarjeta");
    var correoEl  = document.getElementById("pago-correo");
    if (bancoEl)   bancoEl.selectedIndex = 0;
    if (tarjetaEl) tarjetaEl.value = "";
    if (correoEl)  correoEl.value  = "";
    if (selectFrecuente) selectFrecuente.selectedIndex = 0;
  }

  document.querySelectorAll("#navegacion a[data-panel]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (this.getAttribute("data-panel") !== "panel-pago-inmediato") resetearPago();
    });
  });
}

/* --- Buscador de servicios --- */
var SERVICIOS = [
  { nombre: "Electrolux",          categoria: "Empresas" },
  { nombre: "Mabe",                categoria: "Empresas" },
  { nombre: "Samsung",             categoria: "Empresas" },
  { nombre: "LG",                  categoria: "Empresas" },
  { nombre: "Sony",                categoria: "Empresas" },
  { nombre: "Claro",               categoria: "Celular" },
  { nombre: "Movistar",            categoria: "Celular" },
  { nombre: "Entel",               categoria: "Celular" },
  { nombre: "Bitel",               categoria: "Celular" },
  { nombre: "Claro TV",            categoria: "Cable" },
  { nombre: "Movistar TV",         categoria: "Cable" },
  { nombre: "DirecTV",             categoria: "Cable" },
  { nombre: "Sedapal",             categoria: "Agua" },
  { nombre: "Emapa",               categoria: "Agua" },
  { nombre: "Sedacusco",           categoria: "Agua" },
  { nombre: "Luz del Sur",         categoria: "Luz" },
  { nombre: "Enel",                categoria: "Luz" },
  { nombre: "Hidrandina",          categoria: "Luz" },
  { nombre: "Electrocentro",       categoria: "Luz" },
  { nombre: "PUCP",                categoria: "Universidades" },
  { nombre: "Universidad de Lima", categoria: "Universidades" },
  { nombre: "USMP",                categoria: "Universidades" },
  { nombre: "UPC",                 categoria: "Universidades" },
  { nombre: "UTP",                 categoria: "Universidades" },
  { nombre: "UNMSM",               categoria: "Universidades" },
  { nombre: "Movistar Hogar",      categoria: "Internet" },
  { nombre: "Claro Internet",      categoria: "Internet" },
  { nombre: "Win",                 categoria: "Internet" },
  { nombre: "Sunat",               categoria: "Institución Pública" },
  { nombre: "SBS",                 categoria: "Institución Pública" },
  { nombre: "AFP Integra",         categoria: "Entidades Financieras" },
  { nombre: "AFP Prima",           categoria: "Entidades Financieras" },
  { nombre: "AFP Habitat",         categoria: "Entidades Financieras" },
  { nombre: "Telefónica Fija",     categoria: "Telefonía Fija" },
  { nombre: "Claro Fijo",          categoria: "Telefonía Fija" },
];

function initBuscadorServicios() {
  var input      = document.getElementById("servicios-input");
  var lista      = document.getElementById("servicios-resultados");
  var vacio      = document.getElementById("servicios-vacio");
  var panelPago  = document.getElementById("servicios-pago");
  var buscador   = document.getElementById("servicios-buscador");
  var nombreEl   = document.getElementById("servicios-empresa-nombre");
  var btnVolver  = document.getElementById("servicios-volver");
  var btnCancelar = document.getElementById("btn-cancelar-servicio");

  if (!input) return;

  input.addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    lista.innerHTML = "";
    vacio.style.display = "none";

    if (q.length < 1) {
      lista.style.display = "none";
      return;
    }

    var resultados = SERVICIOS.filter(function (s) {
      return s.nombre.toLowerCase().includes(q);
    });

    if (resultados.length === 0) {
      lista.style.display = "none";
      vacio.style.display = "block";
      return;
    }

    resultados.forEach(function (s) {
      var li = document.createElement("li");
      var a  = document.createElement("a");
      a.href = "#";

      // Resaltar coincidencia
      var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      var nombre = document.createElement("span");
      nombre.innerHTML = s.nombre.replace(re, "<strong>$1</strong>");

      var cat = document.createElement("span");
      cat.className = "res-categoria";
      cat.textContent = s.categoria;

      a.appendChild(nombre);
      a.appendChild(cat);
      li.appendChild(a);
      lista.appendChild(li);

      a.addEventListener("click", function (e) {
        e.preventDefault();
        seleccionarServicio(s.nombre);
      });
    });

    lista.style.display = "block";
  });

  // Cerrar lista al hacer clic fuera
  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !lista.contains(e.target)) {
      lista.style.display = "none";
    }
  });

  function seleccionarServicio(nombre) {
    nombreEl.textContent = nombre;
    buscador.style.display = "none";
    panelPago.style.display = "block";
    lista.style.display = "none";
  }

  function volverBuscador() {
    panelPago.style.display = "none";
    buscador.style.display = "block";
    input.value = "";
    lista.innerHTML = "";
    lista.style.display = "none";
    vacio.style.display = "none";
  }

  if (btnVolver)   btnVolver.addEventListener("click",   volverBuscador);
  if (btnCancelar) btnCancelar.addEventListener("click", volverBuscador);

  // Resetear buscador al cambiar de panel
  document.querySelectorAll("#navegacion a[data-panel]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (this.getAttribute("data-panel") !== "panel-servicios") {
        volverBuscador();
      }
    });
  });
}
