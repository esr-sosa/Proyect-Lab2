document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendario');
    let calendar;

    // Inicializar calendario
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        slotDuration: '00:30:00',
        events: function(info, successCallback, failureCallback) {
            fetch('/turno/obtenerTurnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start: info.startStr,
                    end: info.endStr,
                    sucursal: document.getElementById('filtroSucursal').value,
                    especialidad: document.getElementById('filtroEspecialidad').value,
                    medico: document.getElementById('filtroMedico').value
                })
            })
            .then(response => response.json())
            .then(data => {
                const events = data.turnos.map(turno => ({
                    id: turno.turniid,
                    title: `${turno.medico_nombre} ${turno.medico_apellido}`,
                    start: `${turno.fechaturno}T${turno.inicioturno}`,
                    end: `${turno.fechaturno}T${turno.finalturno}`,
                    color: turno.estadoturno_id === 1 ? '#28a745' : '#dc3545'
                }));
                successCallback(events);
            })
            .catch(error => {
                console.error('Error:', error);
                failureCallback(error);
            });
        }
    });

    calendar.render();
}); 