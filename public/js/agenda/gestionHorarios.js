document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendario');
    const formHorarios = document.getElementById('formHorarios');
    const btnAgregarFranjaUnico = document.getElementById('agregarFranjaUnico');
    const btnAgregarFranjaRango = document.getElementById('agregarFranjaRango');
    const franjasContainerUnico = document.getElementById('franjasHorariasUnico');
    const franjasContainerRango = document.getElementById('franjasHorariosRango');
    const rangoFechasCheck = document.getElementById('rangoFechas');
    const fechaUnicaDiv = document.getElementById('fechaUnica');
    const rangoFechasContainer = document.getElementById('rangoFechasContainer');
    
    // Inicializar calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        selectable: true,
        selectMirror: true,
        unselectAuto: false,
        select: function(info) {
            if (!rangoFechasCheck.checked) {
                document.getElementById('fechaSeleccionada').value = info.startStr;
                document.getElementById('fechaSeleccionadaTexto').textContent = moment(info.startStr).format('DD/MM/YYYY');
            }
        },
        events: `/agenda/obtenerHorarios/${formHorarios.dataset.agendaId}`
    });

    calendar.render();

    fechaUnicaDiv.style.display = 'block';
    rangoFechasContainer.style.display = 'none';
    rangoFechasContainer.classList.add('d-none');

    rangoFechasCheck.addEventListener('change', function() {
        if (this.checked) {
            fechaUnicaDiv.style.display = 'none';
            rangoFechasContainer.style.display = 'block';
            rangoFechasContainer.classList.remove('d-none');
            document.getElementById('fechaSeleccionada').value = '';
            document.getElementById('fechaSeleccionadaTexto').textContent = '';
            calendar.unselect();
        } else {
            fechaUnicaDiv.style.display = 'block';
            rangoFechasContainer.style.display = 'none';
            rangoFechasContainer.classList.add('d-none');
            document.getElementById('fechaInicio').value = '';
            document.getElementById('fechaFin').value = '';
            document.querySelectorAll('input[name="dias"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    });

    document.getElementById('fechaInicio').addEventListener('change', actualizarSeleccionCalendario);
    document.getElementById('fechaFin').addEventListener('change', actualizarSeleccionCalendario);

    function actualizarSeleccionCalendario() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        
        if (fechaInicio && fechaFin) {
            if (moment(fechaInicio).isAfter(fechaFin)) {
                Swal.fire({
                    title: 'Error',
                    text: 'La fecha de inicio debe ser anterior a la fecha fin',
                    icon: 'error'
                });
                return;
            }
            calendar.select(fechaInicio, moment(fechaFin).add(1, 'days').format('YYYY-MM-DD'));
            calendar.scrollToDate(fechaInicio);
        }
    }

    function agregarFranja(container) {
        const franjas = container.querySelectorAll('.franja').length + 1;
        const nuevaFranja = document.createElement('div');
        nuevaFranja.className = 'franja mb-3';
        nuevaFranja.innerHTML = `
            <h5 class="mb-3">Franja Horaria ${franjas}</h5>
            <div class="row g-2">
                <div class="col-5">
                    <label class="form-label">Hora Inicio</label>
                    <input class="hora-inicio form-control" type="time" required>
                </div>
                <div class="col-5">
                    <label class="form-label">Hora Fin</label>
                    <input class="hora-fin form-control" type="time" required>
                </div>
                <div class="col-2 d-flex align-items-end">
                    <button class="btn btn-danger btn-sm eliminar-franja" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertBefore(nuevaFranja, container.querySelector('.text-center'));
    }

    if (btnAgregarFranjaUnico) {
        btnAgregarFranjaUnico.addEventListener('click', () => agregarFranja(franjasContainerUnico));
    }
    if (btnAgregarFranjaRango) {
        btnAgregarFranjaRango.addEventListener('click', () => agregarFranja(franjasContainerRango));
    }

    document.getElementById('guardarHorarios').addEventListener('click', async () => {
        try {
            const container = rangoFechasCheck.checked ? franjasContainerRango : franjasContainerUnico;
            const franjas = [];
            
            container.querySelectorAll('.franja').forEach(franja => {
                const inicio = franja.querySelector('.hora-inicio').value;
                const fin = franja.querySelector('.hora-fin').value;
                
                if (!inicio || !fin) {
                    throw new Error('Todas las franjas deben tener hora de inicio y fin');
                }
                
                if (inicio >= fin) {
                    throw new Error('La hora de fin debe ser mayor que la hora de inicio');
                }
                
                franjas.push({ inicio, fin });
            });

            if (franjas.length === 0) {
                throw new Error('Debe agregar al menos una franja horaria');
            }

            let fechaInicio, fechaFin;
            const diasSeleccionados = [];
            
            if (rangoFechasCheck.checked) {
                fechaInicio = document.getElementById('fechaInicio').value;
                fechaFin = document.getElementById('fechaFin').value;
                
                if (!fechaInicio || !fechaFin) {
                    throw new Error('Debe seleccionar fechas de inicio y fin');
                }
                
                document.querySelectorAll('input[name="dias"]:checked').forEach(checkbox => {
                    diasSeleccionados.push(parseInt(checkbox.value));
                });
                
                if (diasSeleccionados.length === 0) {
                    throw new Error('Debe seleccionar al menos un día de la semana');
                }

                const inicio = moment(fechaInicio);
                const fin = moment(fechaFin);
                
                for (let fecha = inicio.clone(); fecha.isSameOrBefore(fin); fecha.add(1, 'days')) {
                    const diaSemana = fecha.day();
                    if (diaSemana === 0 && !diasSeleccionados.includes(6)) {
                        continue;
                    }
                    if (!diasSeleccionados.includes(diaSemana === 0 ? 6 : diaSemana - 1)) {
                        continue;
                    }
                }
            } else {
                fechaInicio = document.getElementById('fechaSeleccionada').value;
                if (!fechaInicio) {
                    throw new Error('Debe seleccionar una fecha');
                }
                fechaFin = fechaInicio;
                
                // Obtener el día de la semana de la fecha seleccionada (0-6)
                const diaSemana = moment(fechaInicio).day();
                // Convertir al formato que usamos (lunes=0, domingo=6)
                const diaAjustado = diaSemana === 0 ? 6 : diaSemana - 1;
                diasSeleccionados.push(diaAjustado);
            }

            Swal.fire({
                title: 'Guardando horarios...',
                text: 'Por favor espere...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('/agenda/horarios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agendaId: formHorarios.dataset.agendaId,
                    fechaInicio,
                    fechaFin,
                    franjas,
                    diasSemana: diasSeleccionados
                })
            });

            const result = await response.json();
            
            if (result.success) {
                const agenda = result.agenda;
                const duracionTurno = agenda.duracion;
                // Calcular total de turnos por día
                const turnosPorDia = franjas.reduce((total, franja) => {
                    const inicio = moment(franja.inicio, 'HH:mm');
                    const fin = moment(franja.fin, 'HH:mm');
                    return total + Math.floor(fin.diff(inicio, 'minutes') / duracionTurno);
                }, 0);

                const diasTotales = rangoFechasCheck.checked ? diasSeleccionados.length : 1;
                const fechaInicioFormat = moment(fechaInicio).format('DD/MM/YYYY');
                const fechaFinFormat = rangoFechasCheck.checked ? moment(fechaFin).format('DD/MM/YYYY') : fechaInicioFormat;
                
                await Swal.fire({
                    title: '¡Horarios guardados exitosamente!',
                    html: `
                        <div class="text-start">
                            <h5 class="mb-3">Resumen de configuración:</h5>
                            <p><strong>Médico:</strong> ${agenda.nombre} ${agenda.apellido}</p>
                            <p><strong>Especialidad:</strong> ${agenda.nombre_esp}</p>
                            <p><strong>Sucursal:</strong> ${agenda.nombre_sucrsal}</p>
                            <p><strong>Período:</strong> ${fechaInicioFormat} al ${fechaFinFormat}</p>
                            <p><strong>Franjas horarias:</strong></p>
                            ${franjas.map(f => `<li>${f.inicio} a ${f.fin}</li>`).join('')}
                            <p class="mt-3"><strong>Turnos disponibles por día:</strong> ${turnosPorDia}</p>
                            <p><strong>Total días configurados:</strong> ${diasTotales}</p>
                            <p><strong>Total turnos disponibles:</strong> ${turnosPorDia * diasTotales}</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                calendar.refetchEvents();
            } else {
                throw new Error(result.message || 'Error al guardar los horarios');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al guardar los horarios',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.eliminar-franja')) {
            const franja = e.target.closest('.franja');
            const container = franja.closest('#franjasHorariasUnico, #franjasHorariosRango');
            if (container.querySelectorAll('.franja').length > 1) {
                franja.remove();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Debe mantener al menos una franja horaria',
                    icon: 'warning'
                });
            }
        }
    });
}); 