document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendario');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        selectable: true,
        selectConstraint: {
            start: new Date()
        },
        dateClick: function(info) {
            const fecha = info.dateStr;
            if (info.dayEl.classList.contains('dia-disponible')) {
                const sucursal = document.getElementById('filtroSucursal').value;
                const especialidad = document.getElementById('filtroEspecialidad').value;
                const medico = document.getElementById('filtroMedico').value;
                
                window.location.href = `/turno/buscarTurnos?fecha=${fecha}&sucursal=${sucursal}&especialidad=${especialidad}&medico=${medico}`;
            }
        },
        events: function(info, successCallback, failureCallback) {
            const sucursal = document.getElementById('filtroSucursal').value;
            const especialidad = document.getElementById('filtroEspecialidad').value;
            const medico = document.getElementById('filtroMedico').value;

            if (!sucursal || !especialidad || !medico) {
                return;
            }

            fetch(`/turno/api/turnos-disponibles?sucursal=${sucursal}&especialidad=${especialidad}&medico=${medico}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const events = data.data.map(dia => ({
                            title: `${dia.turnos} turnos`,
                            start: dia.fecha,
                            classNames: ['dia-disponible'],
                            display: 'background'
                        }));
                        successCallback(events);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    failureCallback(error);
                });
        }
    });

    calendar.render();

    // Manejadores de eventos para los filtros
    ['filtroSucursal', 'filtroEspecialidad', 'filtroMedico'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            calendar.refetchEvents();
        });
    });
}); 