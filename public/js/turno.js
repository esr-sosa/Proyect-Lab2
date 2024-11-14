document.querySelectorAll('.cancelar-turno').forEach(button => {
    button.addEventListener('click', async function() {
        const turnoId = this.getAttribute('data-turno-id');
        if (confirm('¿Está seguro que desea cancelar este turno?')) {
            try {
                const response = await fetch(`/turno/cancelar/${turnoId}`, {
                    method: 'POST'
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Error al cancelar el turno');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al cancelar el turno');
            }
        }
    });
}); 

function confirmarTurno(turnoId) {
    if (!confirm('¿Está seguro que desea confirmar este turno?')) {
        return;
    }

    fetch('/turno/confirmar-secretaria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ turnoId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Turno confirmado exitosamente');
            window.location.reload();
        } else {
            throw new Error(data.message || 'No se pudo confirmar el turno');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Error al confirmar el turno');
    });
}

function cancelarTurno(turnoId) {
    if (!confirm('¿Está seguro que desea cancelar este turno?')) {
        return;
    }

    fetch(`/turno/cancelar/${turnoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Turno cancelado exitosamente');
            window.location.reload();
        } else {
            throw new Error(data.message || 'No se pudo cancelar el turno');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Error al cancelar el turno');
    });
} 