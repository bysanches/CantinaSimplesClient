app.config(($mdDateLocaleProvider) => {
    $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    $mdDateLocaleProvider.shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    $mdDateLocaleProvider.days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    $mdDateLocaleProvider.shortDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    
    // Example uses moment.js to parse and format dates.
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'L', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('L');
    };
    $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
        return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
    };
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendário';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendário';
});