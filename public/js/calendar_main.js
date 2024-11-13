document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',  // Configura el idioma español aquí
        initialView: 'dayGridMonth',
        headerToolbar: {
            center: 'addEventButton'
        },
        customButtons: {
            addEventButton: {
                text: 'AGREGAR DIA',
                click: function () {
                    $("#myModal").modal('show');
                }
            }
        },
        selectable: true,
        events: [], // Carga tus eventos aquí
    });
    calendar.render();
});
