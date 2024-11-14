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
                title: 'Éxito',
                text: 'Turno reservado correctamente',
                icon: 'success'
            }).then(() => {
                window.location.href = '/turno/misTurnos';
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