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
        botonMas.onclick = function() { clonarDiv(this); };
    }

    const botonEliminar = clon.querySelector('input[type="button"]');
    if (botonEliminar) {
        botonEliminar.onclick = function() { eliminarDiv(this); };
    }

    // Reasignar evento para el cálculo automático
    asignarEventosCalculo(clon);

    // Añadir el clon al contenedor
    const contenedor = document.getElementById("contendorclonar");
    contenedor.appendChild(clon);
}

function eliminarDiv(boton) {
    const divPedido = boton.closest('.Pedido');
    divPedido.remove();
}

function asignarEventosCalculo(pedidoDiv) {
    const unidadesInput = Array.from(pedidoDiv.querySelectorAll('input'))
        .find(input => input.placeholder === "Número Unidades");

   const precioInput = pedidoDiv.querySelector('.precio-unitario');
    const totalInput = Array.from(pedidoDiv.querySelectorAll('input'))
        .find(input => input.disabled);

    function calcularTotal() {
        const unidades = parseFloat(unidadesInput.value) || 0;
        const precio = parseFloat(precioInput.value) || 0;
        const total = unidades * precio;
        totalInput.value = total.toFixed(2); // Redondear a 2 decimales
    }

    unidadesInput.addEventListener('input', calcularTotal);
    precioInput.addEventListener('input', calcularTotal);
}

// Llamar al asignador en el primer div ya existente al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const primerPedido = document.querySelector(".Pedido");
    if (primerPedido) {
        asignarEventosCalculo(primerPedido);
    }
});
