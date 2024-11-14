document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('obraSocialForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const id = form.elements['id_obra_social'].value;
    const data = {
        nombre: form.elements['nombre'].value
    };

    try {
        const url = id ? `/obraSocial/editar/${id}` : '/obraSocial/agregar';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: id ? 'Obra social actualizada correctamente' : 'Obra social agregada correctamente',
                timer: 1500
            });
            window.location.href = '/obraSocial';
        } else {
            throw new Error('Error en la operación');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar los cambios'
        });
    }
} 