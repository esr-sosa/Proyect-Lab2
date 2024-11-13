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