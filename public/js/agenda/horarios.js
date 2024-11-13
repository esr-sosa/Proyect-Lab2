document.addEventListener('DOMContentLoaded', function() {
    const formHorarios = document.getElementById('formHorarios');

    formHorarios.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const diasSeleccionados = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
            .map(checkbox => parseInt(checkbox.value));

        const datos = {
            agendaId: window.agendaId, // Asegúrate de tener esta variable disponible
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaFin: document.getElementById('fechaFin').value,
            horaInicio: document.getElementById('horaInicio').value,
            horaFin: document.getElementById('horaFin').value,
            intervalo: document.getElementById('intervalo').value,
            diasSemana: diasSeleccionados
        };

        try {
            const response = await fetch('/agenda/horarios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Horarios creados exitosamente');
                window.location.reload();
            } else {
                alert('Error al crear los horarios: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    });
}); 