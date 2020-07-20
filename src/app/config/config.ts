export const URL_SERVICIOS = 'https://api.logdepotsa.com';

export const LOCALETEXT = {
  // for filter panel
  page: 'Página',
  more: 'más',
  to: 'a',
  of: 'de',
  next: 'Siguiente',
  last: 'Último',
  first: 'Primero',
  previous: 'Anterior',
  loadingOoo: 'Cargando...',

  // for set filter
  selectAll: 'Seleccionar todo',
  searchOoo: 'Buscar...',
  blanks: 'daBlanc',

  // for number filter and text filter
  filterOoo: 'Filtrar...',
  applyFilter: 'Aplicar filtro...',
  equals: 'Que sea igual que...',
  notEqual: 'Que no sea igual que...',

  // for number filter
  lessThan: 'Que sea menor que...',
  greaterThan: 'Que sea mayor que...',
  lessThanOrEqual: 'Que sea menor o igual que...',
  greaterThanOrEqual: 'Que sea mayor o igual que...',
  inRange: 'En rango...',

  // for text filter
  contains: 'Que contenga...',
  notContains: 'Que no contenga...',
  startsWith: 'Que empiece con...',
  endsWith: 'Que termine con...',

  // filter conditions
  andCondition: '...  Y',
  orCondition: '...  O',

  // the header of the default group column
  group: 'Grupo',

  // tool panel
  columns: 'Columnas',
  filters: 'Filtros',
  rowGroupColumns: 'laPivot Cols',
  rowGroupColumnsEmptyMessage: 'la drag cols to group',
  valueColumns: 'laValue Cols',
  pivotMode: 'laPivot-Mode',
  groups: 'laGroups',
  values: 'laValues',
  pivots: 'laPivots',
  valueColumnsEmptyMessage: 'la drag cols to aggregate',
  pivotColumnsEmptyMessage: 'la drag here to pivot',
  toolPanelButton: 'la tool panel',

  // other
  noRowsToShow: 'No hay registros para mostrar',

  // enterprise menu
  pinColumn: 'laPin Column',
  valueAggregation: 'laValue Agg',
  autosizeThiscolumn: 'laAutosize Diz',
  autosizeAllColumns: 'laAutsoie em All',
  groupBy: 'laGroup by',
  ungroupBy: 'laUnGroup by',
  resetColumns: 'laReset Those Cols',
  expandAll: 'laOpen-em-up',
  collapseAll: 'laClose-em-up',
  toolPanel: 'laTool Panelo',
  export: 'laExporto',
  csvExport: 'la CSV Exportp',
  excelExport: 'la Excel Exporto (.xlsx)',
  excelXmlExport: 'la Excel Exporto (.xml)',

  // enterprise menu pinning
  pinLeft: 'Pin <<',
  pinRight: 'Pin >>',
  noPin: 'Sin pin <>',

  // enterprise menu aggregation and status bar
  sum: 'Suma',
  min: 'Mínimo',
  max: 'Máximo',
  none: 'Ninguno',
  count: 'Contar',
  average: 'Promedio',
  filteredRows: 'Registros filtrados',
  selectedRows: 'Registros seleccionados',
  totalRows: 'Registros totales',
  totalAndFilteredRows: 'laRows',

  // standard menu
  copy: 'Copiar',
  copyWithHeaders: 'Copiar con cabeceras',
  ctrlC: 'ctrl n C',
  paste: 'Pegar',
  ctrlV: 'ctrl n V'
};

export const FILTERPARAMS = {

  // provide comparator function
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var dateAsString = cellValue;
    if (dateAsString == null) return 0;

    // In the example application, dates are stored as dd/mm/yyyy
    // We create a Date object for comparison against the filter date
    var dateParts = dateAsString.split("/");
    var day = Number(dateParts[2]);
    var month = Number(dateParts[1]) - 1;
    var year = Number(dateParts[0]);
    var cellDate = new Date(day, month, year);

    // Now that both parameters are Date objects, we can compare
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    } else {
      return 0;
    }
  }

}

export function dateComparator(date1, date2) {
  var date1Number = monthToComparableNumber(date1);
  var date2Number = monthToComparableNumber(date2);
  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }
  return date1Number - date2Number;
}

export function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null;
  }
  var yearNumber = date.substring(6, 10);
  var monthNumber = date.substring(3, 5);
  var dayNumber = date.substring(0, 2);
  var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
  return result;
}