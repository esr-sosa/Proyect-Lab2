function reservarTurnoPaciente(calendarId) {
    const modalHtml = `
        <div class="modal fade" id="confirmarReservaModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar Reserva</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Desea reservar este turno?</p>
                        <small class="text-muted">La reserva quedará pendiente hasta que sea confirmada por la secretaria</small>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="procesarReservaPaciente(${calendarId})">
                            Confirmar Reserva
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('confirmarReservaModal'));
    modal.show();
    
    document.getElementById('confirmarReservaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

function confirmarTurnoSecretaria(calendarId) {
    const modalHtml = `
        <div class="modal fade" id="confirmarTurnoModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar Turno</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Comentarios (opcional)</label>
                            <textarea id="comentariosTurno" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="procesarConfirmacionSecretaria(${calendarId})">
                            Confirmar Turno
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('confirmarTurnoModal'));
    modal.show();
}

async function reservarTurno(calendarId, personaId) {
    console.log('Iniciando reserva:', { calendarId, personaId });
    
    try {
        const response = await fetch('/turno/reservar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                calendarId,
                personaId 
            })
        });

        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        if (data.success) {
            Swal.fire({
                title: 'Turno confirmado',
                html: `
                    <div class="text-start">
                        <p class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>El turno ha sido reservado exitosamente</p>
                        <div class="alert alert-info mt-3">
                            <i class="fas fa-info-circle me-2"></i>
                            Puede descargar el comprobante del turno haciendo clic en el botón de abajo
                        </div>
                    </div>`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Descargar Comprobante',
                cancelButtonText: 'Cerrar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const link = document.createElement('a');
                    link.href = `/turno/comprobante/${data.turnoId}`;
                    link.download = `turno-${data.turnoId}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    window.location.href = '/';
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'No se pudo reservar el turno',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Error detallado:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar la solicitud',
            icon: 'error'
        });
    }
} 