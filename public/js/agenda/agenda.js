document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cambiar-estado').forEach(btn => {
        btn.addEventListener('click', async function() {
            try {
                const response = await fetch('/agenda/cambiarEstado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        agendaId: this.dataset.agendaId,
                        estado: parseInt(this.dataset.estado)
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: result.message,
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cambiar el estado de la agenda',
                    icon: 'error'
                });
            }
        });
    });
}); 