let fechaSeleccionada;
let medicoIdSeleccionado;

$(document).ready(function() {
    $(document).on('click', '.btn-sobreturno', function() {
        const $btn = $(this);
        const fecha = $btn.attr('data-fecha');
        const medicoId = $btn.attr('data-medico-id');
        const medicoNombre = $btn.attr('data-medico-nombre');
        const pacienteId = $btn.attr('data-paciente-id');
        
        if (!medicoId || !pacienteId) {
            mostrarAlerta('Error: Faltan datos necesarios', 'error');
            return;
        }
        
        $('#modalSobreturno').data('paciente-id', pacienteId);
        verificarDisponibilidad(fecha, medicoId, medicoNombre);
    });

    $('#btnConfirmarSobreturno').click(function() {
        const data = {
            medicoId: medicoIdSeleccionado,
            fecha: fechaSeleccionada,
            horaInicio: $('#horarioSobreturno').val(),
            motivo: $('#motivoSobreturno').val(),
            personaId: $('#modalSobreturno').data('paciente-id')
        };

        if (!data.horaInicio || !data.motivo) {
            mostrarAlerta('Por favor complete todos los campos', 'warning');
            return;
        }

        Swal.fire({
            title: '¿Confirmar sobreturno?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear sobreturno',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                crearSobreturno(data);
            }
        });
    });
});

function verificarDisponibilidad(fecha, medicoId, medicoNombre) {
    $('#horarioSobreturno').val('');
    $('#motivoSobreturno').val('');
    
    fechaSeleccionada = fecha;
    medicoIdSeleccionado = medicoId;

    $.post('/turno/sobreturno/verificar', { fecha, medicoId })
        .done(function(response) {
            if (response.success) {
                $('#horarioSobreturno').val(response.horarioSobreturno);
                $('#modalSobreturno .modal-title').text(
                    `Crear Sobreturno - ${medicoNombre} (${moment(fecha).format('DD/MM/YYYY')})`
                );
                
                const modal = new bootstrap.Modal(document.getElementById('modalSobreturno'));
                modal.show();
            } else {
                mostrarAlerta(response.message, 'warning');
            }
        })
        .fail(function(error) {
            console.error('Error:', error);
            mostrarAlerta('Error al verificar disponibilidad', 'error');
        });
}

function crearSobreturno(data) {
    $.post('/turno/sobreturno/crear', data)
        .done(function(response) {
            if (response.success) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Sobreturno creado exitosamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            } else {
                mostrarAlerta(response.message || 'Error al crear el sobreturno', 'error');
            }
        })
        .fail(function(error) {
            mostrarAlerta('Error al crear el sobreturno', 'error');
        });
}

function mostrarAlerta(mensaje, tipo) {
    Swal.fire({
        text: mensaje,
        icon: tipo,
        timer: 3000,
        showConfirmButton: false
    });
} 