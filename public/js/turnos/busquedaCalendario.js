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
        dateClick: async function(info) {
            const fecha = info.dateStr;
            if (info.dayEl.classList.contains('dia-disponible')) {
                try {
                    const response = await fetch('/turno/buscarTurnos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            fecha,
                            sucursal: sucursalId,
                            especialidad: especialidadId,
                            medico: medicoId
                        })
                    });
                    
                    const html = await response.text();
                    document.getElementById('contenedorHorarios').innerHTML = html;
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        },
        events: function(info, successCallback, failureCallback) {
            const sucursal = sucursalId;
            const especialidad = especialidadId;
            const medico = medicoId;

            fetch(`/turno/api/turnos-disponibles?sucursal=${sucursal}&especialidad=${especialidad}&medico=${medico}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const events = data.data.map(dia => ({
                            title: `${dia.turnos_disponibles} turnos`,
                            start: dia.fecha,
                            classNames: ['dia-disponible'],
                            display: 'background',
                            color: '#28a745'
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