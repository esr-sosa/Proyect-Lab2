document.addEventListener('DOMContentLoaded', function() {
    const formBuscarTurno = document.getElementById('formBuscarTurno');
    
    formBuscarTurno.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const medico_id = document.getElementById('medico_id').value;
        const fecha = document.getElementById('fecha').value;

        if (!medico_id || !fecha) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor seleccione un médico y una fecha',
                icon: 'error'
            });
            return;
        }

        try {
            const response = await fetch(`/turno/buscar?medico_id=${medico_id}&fecha=${fecha}`);
            const data = await response.json();

            if (data.success) {
                mostrarTurnos(data.data);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Error al buscar turnos',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Error al buscar turnos disponibles',
                icon: 'error'
            });
        }
    });
});

function mostrarTurnos(turnos) {
    const contenedorTurnos = document.getElementById('contenedorTurnos');
    contenedorTurnos.innerHTML = '';

    if (turnos.length === 0) {
        contenedorTurnos.innerHTML = `
            <div class="alert alert-info">
                No hay turnos disponibles para la fecha seleccionada
            </div>
        `;
        return;
    }

    turnos.forEach(turno => {
        contenedorTurnos.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Turno ${turno.inicioturno}</h5>
                    <p class="card-text">
                        <strong>Médico:</strong> ${turno.medico_nombre} ${turno.medico_apellido}<br>
                        <strong>Especialidad:</strong> ${turno.especialidad}<br>
                        <strong>Sucursal:</strong> ${turno.nombre_sucrsal}
                    </p>
                    <button class="btn btn-primary reservar-turno" 
                            data-calendar-id="${turno.calendarid}">
                        Reservar
                    </button>
                </div>
            </div>
        `;
    });
} 