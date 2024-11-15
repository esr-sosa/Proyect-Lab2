document.addEventListener('DOMContentLoaded', function() {
    const calendario = new FullCalendar.Calendar(document.getElementById('calendario'), {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        validRange: {
            start: new Date()
        },
        selectable: true,
        select: function(info) {
            const fechaSeleccionada = moment(info.start).format('YYYY-MM-DD');
            buscarHorariosPaciente(fechaSeleccionada);
        },
        dateClick: function(info) {
            const fechaSeleccionada = moment(info.date).format('YYYY-MM-DD');
            buscarHorariosPaciente(fechaSeleccionada);
        }
    });

    calendario.render();
});

async function buscarHorariosPaciente(fecha) {
    try {
        const response = await fetch(`/api/horarios/${medicoId}/${fecha}`);
        const data = await response.json();

        if (data.success) {
            mostrarHorariosPaciente(data.horarios, fecha);
        } else {
            mostrarAlerta('No se encontraron horarios disponibles', 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al buscar horarios', 'danger');
    }
}

function mostrarHorariosPaciente(horarios, fecha) {
    const contenedor = document.getElementById('contenedorHorarios');
    if (!horarios || horarios.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-info">No hay horarios disponibles para esta fecha</div>';
        return;
    }

    let html = `
        <h5>Horarios disponibles para ${moment(fecha).format('DD/MM/YYYY')}</h5>
        <div class="row g-3">
    `;

    horarios.forEach(horario => {
        const horaInicio = moment(horario.inicioturno, 'HH:mm:ss').format('HH:mm');
        html += `
            <div class="col-md-3 col-sm-6">
                <button class="btn btn-outline-primary w-100" 
                        onclick="reservarTurnoPaciente(${horario.calendarid})">
                    ${horaInicio} hs
                </button>
            </div>
        `;
    });

    html += '</div>';
    contenedor.innerHTML = html;
}

function mostrarAlerta(mensaje, tipo = 'danger') {
    const alertHtml = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.getElementById('contenedorHorarios').innerHTML = alertHtml;
} 