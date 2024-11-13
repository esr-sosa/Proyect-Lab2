document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendario');
    const modalHorarios = new bootstrap.Modal(document.getElementById('modalHorarios'));
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        selectable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        select: function(info) {
            document.getElementById('fechaSeleccionada').value = info.startStr;
            modalHorarios.show();
        },
        events: '/agenda/obtenerHorarios/' + document.querySelector('#formHorarios').dataset.agendaId
    });

    calendar.render();

    // Manejar el formulario de horarios
    const formHorarios = document.getElementById('formHorarios');
    const btnGuardar = document.getElementById('guardarHorarios');
    
    btnGuardar.addEventListener('click', async () => {
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
                    fecha: document.getElementById('fechaSeleccionada').value,
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