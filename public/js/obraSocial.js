async function toggleObraSocialStatus(id, estado) {
	try {
		const result = await Swal.fire({
			title: '¿Está seguro?',
			text: estado ? "¿Desea activar esta obra social?" : "¿Desea desactivar esta obra social?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, continuar',
			cancelButtonText: 'Cancelar'
		});

		if (result.isConfirmed) {
			const response = await fetch(`/obraSocial/toggle/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ estado: estado ? 1 : 0 })
			});

			if (response.ok) {
				await Swal.fire({
					icon: 'success',
					title: 'Éxito',
					text: estado ? 'Obra social activada' : 'Obra social desactivada',
					timer: 1500
				});
				window.location.reload();
			} else {
				throw new Error('Error en la operación');
			}
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'Error al cambiar el estado'
		});
	}
} 