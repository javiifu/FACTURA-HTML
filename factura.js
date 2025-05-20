//Método para añadir una línea de pedido nueva. 
function clonarDiv(boton) {
    const divOriginal = boton.closest('.Pedido');
    const clon = divOriginal.cloneNode(true);

    // Limpiar los inputs del clon
    const inputs = clon.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'text') input.value = '';
    });

    // Reasignar eventos
    const botonMas = clon.querySelector('button');
    if (botonMas) {
        botonMas.onclick = function () { clonarDiv(this); };
    }

    const botonEliminar = clon.querySelector('input[type="button"]');
    if (botonEliminar) {
        botonEliminar.onclick = function () { eliminarDiv(this); };
    }

    // Reasignar cálculo automático
    asignarEventosCalculo(clon);

    // Insertar el clon vacío justo encima del original
    const contenedor = document.getElementById("contendorclonar");
    contenedor.insertBefore(clon, divOriginal);
}
//Función para eliminar la línea de pedido. 
function eliminarDiv(boton) {
    const pedidoAEliminar = boton.closest('.Pedido');
    const todosLosPedidos = document.querySelectorAll('#contendorclonar .Pedido');

    if (todosLosPedidos.length > 1) {
        pedidoAEliminar.remove();
    } else {
        alert("No se puede eliminar la última línea de pedido.");
    }
}

function asignarEventosCalculo(pedidoDiv) {
    const unidadesInput = pedidoDiv.querySelector('.unidades');
    const precioInput = pedidoDiv.querySelector('.precio-unitario');
    const ivaSelect = pedidoDiv.querySelector('.iva');
    const totalInput = pedidoDiv.querySelector('.total');

    function calcularTotal() {
        const unidades = parseFloat(unidadesInput.value.replace(',', '.')) || 0;
        const precio = parseFloat(precioInput.value.replace(',', '.')) || 0;
        const iva = parseFloat(ivaSelect.value) || 0;

        const subtotal = unidades * precio;
        const totalConIVA = subtotal * (1 + iva / 100);
        totalInput.value = totalConIVA.toFixed(2);
    }

    unidadesInput.addEventListener('input', calcularTotal);
    precioInput.addEventListener('input', calcularTotal);
    ivaSelect.addEventListener('change', calcularTotal);
    //Para poder meter las validaciones dentro del pedido. 
    asignarValidacionesPedido(pedidoDiv);
}
//Para inicializar lso eventos en la primera línea de pedido a la hora de cargar la paǵina. 
window.addEventListener("DOMContentLoaded", () => {
    const primerPedido = document.querySelector(".Pedido");
    if (primerPedido) {
        asignarEventosCalculo(primerPedido);
    }
});
document.getElementById("Factura").addEventListener("click", generarFactura);
//Método para que se genere la factura. 
function generarFactura() {
    const lineas = document.querySelectorAll(".Pedido");
    const resumen = {
        21: { base: 0, iva: 0 },
        10: { base: 0, iva: 0 },
        4: { base: 0, iva: 0 }
    };

    let totalFactura = 0;

    lineas.forEach(linea => {
        const unidades = parseFloat(linea.querySelector(".unidades")?.value.replace(',', '.') || 0);
        const precio = parseFloat(linea.querySelector(".precio-unitario")?.value.replace(',', '.') || 0);
        const iva = parseFloat(linea.querySelector(".iva")?.value || 0);

        const base = unidades * precio;
        const importeIVA = base * (iva / 100);
        const totalLinea = base + importeIVA;

        if (resumen[iva] !== undefined) {
            resumen[iva].base += base;
            resumen[iva].iva += importeIVA;
        }

        totalFactura += totalLinea;
    });

    let html = "<strong>Desglose IVA:</strong><br>";
    for (let tipo in resumen) {
        const base = resumen[tipo].base.toFixed(2);
        const ivaImporte = resumen[tipo].iva.toFixed(2);
        if (resumen[tipo].base > 0) {
            html += `- ${tipo}%: Base imponible: ${base} €, IVA: ${ivaImporte} €<br>`;
        }
    }

    html += `<hr><strong>Total factura: ${totalFactura.toFixed(2)} €</strong>`;

    document.getElementById("resumenFactura").innerHTML = html;
}
//Asignación del evento Crear pedido al botón tras cargar la página. 
window.addEventListener("DOMContentLoaded", () => {
    const crearBtn = document.getElementById("Crear");
    crearBtn.addEventListener("click", togglePedido);
});
//Función para poder ocultar los pedidos y para cambiar el botón de Crear pedido a Eliminar pedido. 
function togglePedido() {
    const crearBtn = document.getElementById("Crear");
    const encabezadoPedido = document.querySelector(".encabezadoPedido");
    const contenedor = document.getElementById("contendorclonar");
    const btnFactura = document.getElementById("Factura");
    const resumen = document.getElementById("resumenFactura");

    if (crearBtn.value === "Crear Pedido") {
        // Mostrar todos los elementos del pedido
        encabezadoPedido.style.display = "flex";
        contenedor.style.display = "block";
        btnFactura.style.display = "inline-block";
        resumen.style.display = "block";

        // Cambiar botón
        crearBtn.value = "Eliminar Pedido";
    } else {
        // Ocultar y vaciar todos los elementos del pedido
        encabezadoPedido.style.display = "none";
        contenedor.style.display = "none";
        contenedor.innerHTML = ""; // Eliminar líneas
        btnFactura.style.display = "none";
        resumen.style.display = "none";
        resumen.innerHTML = "";

        // Restaurar una línea vacía invisible (por si se vuelve a activar)
        contenedor.innerHTML = `
            <div class="Pedido">
                <div><button onclick="clonarDiv(this)" class="inputsPedido">+</button></div>
                <div><input type="text" class="descripcion" placeholder="Descripción artículo"></div>
                <div><input type="text" class="unidades" placeholder="Número Unidades"></div>
                <div><input type="text" class="precio-unitario" placeholder="Precio Unitario"></div>
                <div>
                    <select class="iva">
                        <option value="21">21%</option>
                        <option value="10">10%</option>  
                        <option value="4">4%</option>
                    </select>
                </div>
                <div><input type="text" class="total" disabled placeholder="Total"></div>
                <div><input type="button" value="Eliminar Línea" onclick="eliminarDiv(this)" class="inputsPedido"></div>
            </div>
        `;

        asignarEventosCalculo(contenedor.querySelector(".Pedido"));

        // Cambiar el botón a su estado inicial
        crearBtn.value = "Crear Pedido";
    }
}

//Función que asigna las validaciones de letras y números en la línea de pedido.
function asignarValidacionesPedido(pedidoDiv) {
    const descripcion = pedidoDiv.querySelector(".descripcion");
    const unidades = pedidoDiv.querySelector(".unidades");
    const precio = pedidoDiv.querySelector(".precio-unitario");

    // Solo letras y espacios para descripción
    if (descripcion) {
        descripcion.addEventListener("input", () => {
            descripcion.value = descripcion.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
        });
    }

    // Solo números enteros para unidades
    if (unidades) {
        unidades.addEventListener("input", () => {
            unidades.value = unidades.value.replace(/[^0-9]/g, "");
        });
    }

    // Solo números con hasta 2 decimales para precio
    if (precio) {
        precio.addEventListener("input", () => {
            precio.value = precio.value
                .replace(/[^0-9.,]/g, "")         // Solo números, punto o coma
                .replace(",", ".")                // Cambiar coma por punto
                .replace(/^(\d+)(\.\d{0,2})?.*$/, "$1$2"); // Limitar a 2 decimales
        });
    }
}

//Método para validar entradas solo de letras para Los inputs. 
window.addEventListener("DOMContentLoaded", () => {
    // Ya existente
    const crearBtn = document.getElementById("Crear");
    crearBtn.addEventListener("click", togglePedido);

    // Validación: solo letras
    const soloLetrasInputs = document.querySelectorAll(".solo-letras");
    soloLetrasInputs.forEach(input => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
        });
    });
});

