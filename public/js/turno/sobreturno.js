let fechaSeleccionada;
let medicoIdSeleccionado;

$(document).ready(function() {
    $(document).on('click', '.btn-sobreturno', function() {
        const $btn = $(this);
        
        const fecha = $btn.attr('data-fecha');
        const medicoId = $btn.attr('data-medico-id');
        const medicoNombre = $btn.attr('data-medico-nombre');
        const pacienteId = $btn.attr('data-paciente-id');
        
        console.log('Datos del botón:', { fecha, medicoId, medicoNombre, pacienteId });
        
        if (!medicoId) {
            console.error('Error: medicoid no encontrado');
            mostrarAlerta('Error al identificar el médico. Por favor, intente nuevamente.', 'warning');
            return;
        }
        
        // Guardamos el ID del paciente en el modal
        $('#modalSobreturno').data('paciente-id', pacienteId);
        
        verificarDisponibilidad(fecha, medicoId, medicoNombre);
    });

    $('#btnConfirmarSobreturno').click(function() {
        const data = {
            medicoId: medicoIdSeleccionado,
            fecha: fechaSeleccionada,
            horaInicio: $('#espacioSobreturno').val(),
            motivo: $('#motivoSobreturno').val(),
            personaId: $('#modalSobreturno').data('paciente-id')
        };

        if (!data.horaInicio || !data.motivo) {
            mostrarAlerta('Por favor complete todos los campos', 'warning');
            return;
        }

        $.post('/turno/sobreturno/crear', data)
            .done(function(response) {
                if (response.success) {
                    mostrarAlerta('Sobreturno creado exitosamente', 'success');
                    $('#modalSobreturno').modal('hide');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    mostrarAlerta(response.message || 'Error al crear el sobreturno', 'danger');
                }
            })
            .fail(function(error) {
                mostrarAlerta('Error al crear el sobreturno', 'danger');
            });
    });

    function verificarDisponibilidad(fecha, medicoId, medicoNombre) {
        $('#espacioSobreturno').empty().append('<option value="">Seleccione un horario</option>');
        $('#motivoSobreturno').val('');
        
        fechaSeleccionada = fecha;
        medicoIdSeleccionado = medicoId;

        $.post('/turno/sobreturno/verificar', { fecha, medicoId })
            .done(function(response) {
                if (response.success && response.espaciosDisponibles?.length > 0) {
                    response.espaciosDisponibles.forEach(espacio => {
                        const horaInicio = moment(espacio.horaInicio, 'HH:mm:ss').format('HH:mm');
                        const horaFin = moment(espacio.horaFin, 'HH:mm:ss').format('HH:mm');
                        $('#espacioSobreturno').append(
                            `<option value="${espacio.horaInicio}">${horaInicio} - ${horaFin}</option>`
                        );
                    });
                    
                    $('#modalSobreturno .modal-title').text(
                        `Crear Sobreturno - ${medicoNombre} (${moment(fecha).format('DD/MM/YYYY')})`
                    );
                    
                    const modal = new bootstrap.Modal(document.getElementById('modalSobreturno'));
                    modal.show();
                } else {
                    mostrarAlerta(
                        response.message || 'No hay espacios disponibles para sobreturnos en este día', 
                        'warning'
                    );
                }
            })
            .fail(function(error) {
                console.error('Error en la petición:', error);
                mostrarAlerta('Error al verificar disponibilidad', 'error');
            });
    }
});

function mostrarAlerta(mensaje, tipo) {
    const tipoAlerta = tipo === 'danger' ? 'error' : tipo;
    
    Swal.fire({
        text: mensaje,
        icon: tipoAlerta,
        timer: 3000,
        showConfirmButton: false
    });
} 