document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendario');
    const modalHorarios = new bootstrap.Modal(document.getElementById('modalHorarios'));
    const formHorarios = document.getElementById('formHorarios');
    const btnAgregarFranja = document.getElementById('agregarFranja');
    const franjasContainer = document.getElementById('franjasHorarias');
    
    // Inicializar calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        selectable: true,
        select: function(info) {
            document.getElementById('fechaSeleccionada').value = info.startStr;
            modalHorarios.show();
        },
        events: `/agenda/obtenerHorarios/${formHorarios.dataset.agendaId}`
    });

    calendar.render();

    // Manejar agregar franjas
    btnAgregarFranja.addEventListener('click', () => {
        const franjas = document.querySelectorAll('.franja').length + 1;
        const nuevaFranja = document.createElement('div');
        nuevaFranja.className = 'franja mb-3';
        nuevaFranja.innerHTML = `
            <h5 class="mb-3">Franja Horaria ${franjas}</h5>
            <div class="row">
                <div class="col-md-5">
                    <label>Hora Inicio</label>
                    <input class="hora-inicio form-control" type="time" required>
                </div>
                <div class="col-md-5">
                    <label>Hora Fin</label>
                    <input class="hora-fin form-control" type="time" required>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-danger eliminar-franja" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        franjasContainer.appendChild(nuevaFranja);
    });

    // Manejar guardar horarios
    document.getElementById('guardarHorarios').addEventListener('click', async () => {
        const franjas = [];
        document.querySelectorAll('.franja').forEach(franja => {
            franjas.push({
                inicio: franja.querySelector('.hora-inicio').value,
                fin: franja.querySelector('.hora-fin').value
            });
        });

        try {
            const response = await fetch('/agenda/horarios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agendaId: formHorarios.dataset.agendaId,
                    fechaInicio: document.getElementById('fechaSeleccionada').value,
                    fechaFin: document.getElementById('fechaSeleccionada').value,
                    franjas
                })
            });

            const result = await response.json();
            
            if (result.success) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Horarios guardados correctamente',
                    icon: 'success'
                });
                modalHorarios.hide();
                calendar.refetchEvents();
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar los horarios',
                icon: 'error'
            });
        }
    });
}); 