// 🔹 Tasas de interés por periodo (%)
const intereses = {
  "Diario": 0.09,
  "Semanal": 0.63,
  "Quincenal": 1.26,
  "Mensual": 2.51,
  "Bimestral": 5.02,
  "Trimestral": 7.53,
  "Medio_ano": 15.06,
  "Anual": 30.1
};

// 🔹 Referencias DOM
const montoInput = document.getElementById("monto");
const plazoInput = document.getElementById("plazo");
const periodoSelect = document.getElementById("periodo");
const interesInput = document.getElementById("interes");
const graciaInput = document.getElementById("gracia");
const ticketDiv = document.getElementById("ticket");
const tablaCronograma = document.getElementById("tablaCronograma");
const tituloCronograma = document.getElementById("tituloCronograma");
const imprimirBtn = document.getElementById("imprimir");

// 🔹 Actualizar interés automáticamente al cambiar periodo
periodoSelect.addEventListener("change", () => {
  const periodo = periodoSelect.value;
  interesInput.value = intereses[periodo] !== undefined ? intereses[periodo] : "";
});

// Inicializar con el periodo por defecto
window.onload = () => {
  interesInput.value = intereses[periodoSelect.value];
};

// 🔹 Función calcular crédito
document.getElementById("calcular").addEventListener("click", () => {
  let monto = parseFloat(montoInput.value);
  let plazo = parseInt(plazoInput.value);
  let periodo = periodoSelect.value;
  let gracia = parseInt(graciaInput.value) || 0;

  if (isNaN(monto) || isNaN(plazo)) {
    alert("Completa los datos correctamente.");
    return;
  }

  // 🔹 Usar la tasa fija según el periodo directamente
  let tasaPeriodo = intereses[periodo] / 100;

  // 🔹 Cálculos correctos
  let interesTotal = monto * tasaPeriodo * plazo;
  let total = monto + interesTotal;
  let cuota = total / plazo;

  // 🔹 Fechas
  let fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() + gracia);

  let fechaUltimo = new Date(fechaInicio);
  switch(periodo){
    case "Diario": fechaUltimo.setDate(fechaUltimo.getDate() + plazo); break;
    case "Semanal": fechaUltimo.setDate(fechaUltimo.getDate() + plazo*7); break;
    case "Quincenal": fechaUltimo.setDate(fechaUltimo.getDate() + plazo*15); break;
    case "Mensual": fechaUltimo.setMonth(fechaUltimo.getMonth() + plazo); break;
    case "Bimestral": fechaUltimo.setMonth(fechaUltimo.getMonth() + plazo*2); break;
    case "Trimestral": fechaUltimo.setMonth(fechaUltimo.getMonth() + plazo*3); break;
    case "Medio_ano": fechaUltimo.setMonth(fechaUltimo.getMonth() + plazo*6); break;
    case "Anual": fechaUltimo.setFullYear(fechaUltimo.getFullYear() + plazo); break;
  }

  // 🔹 Mostrar ticket
  ticketDiv.innerHTML = `
    <h3>💳 Recibo de Crédito</h3>
    <p><b>Monto:</b> $${monto.toFixed(2)}</p>
    <p><b>Plazo:</b> ${plazo} cuotas (${periodo})</p>
    <p><b>Tasa de interés por periodo:</b> ${(tasaPeriodo*100).toFixed(2)}%</p>
    <p><b>Tiempo de gracia:</b> ${gracia} días</p>
    <hr>
    <p><b>Cuota fija:</b> $${cuota.toFixed(2)}</p>
    <p><b>Interés total:</b> $${interesTotal.toFixed(2)}</p>
    <p><b>Total a pagar:</b> $${total.toFixed(2)}</p>
    <hr>
    <p><b>Fecha inicio:</b> ${fechaInicio.toLocaleDateString()}</p>
    <p><b>Última fecha:</b> ${fechaUltimo.toLocaleDateString()}</p>
  `;
  ticketDiv.classList.remove("hidden");
  imprimirBtn.classList.remove("hidden");

  // 🔹 Cronograma
  let saldo = monto;
  let tbody = tablaCronograma.querySelector("tbody");
  tbody.innerHTML = "";
  let fechaPago = new Date(fechaInicio);

  for(let i=1; i<=plazo; i++){
    let interesCuota = monto * tasaPeriodo; // interés fijo por periodo
    let capitalCuota = cuota - interesCuota;
    saldo -= capitalCuota;

    switch(periodo){
      case "Diario": fechaPago.setDate(fechaPago.getDate() + 1); break;
      case "Semanal": fechaPago.setDate(fechaPago.getDate() + 7); break;
      case "Quincenal": fechaPago.setDate(fechaPago.getDate() + 15); break;
      case "Mensual": fechaPago.setMonth(fechaPago.getMonth() + 1); break;
      case "Bimestral": fechaPago.setMonth(fechaPago.getMonth() + 2); break;
      case "Trimestral": fechaPago.setMonth(fechaPago.getMonth() + 3); break;
      case "Medio_ano": fechaPago.setMonth(fechaPago.getMonth() + 6); break;
      case "Anual": fechaPago.setFullYear(fechaPago.getFullYear() + 1); break;
    }

    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${fechaPago.toLocaleDateString()}</td>
      <td>$${cuota.toFixed(2)}</td>
      <td>$${interesCuota.toFixed(2)}</td>
      <td>$${capitalCuota.toFixed(2)}</td>
      <td>$${saldo.toFixed(2)}</td>
    </tr>`;
  }

  tablaCronograma.classList.remove("hidden");
  tituloCronograma.classList.remove("hidden");
});

// 🔹 Imprimir ticket
imprimirBtn.addEventListener("click", () => {
  let ventana = window.open("", "_blank");
  ventana.document.write(`<html><head><title>Ticket</title></head><body>${ticketDiv.outerHTML}</body></html>`);
  ventana.document.close();
  ventana.print();
});
