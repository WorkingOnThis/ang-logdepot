import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { Empresa } from 'src/app/models/empresa.model';
import { Errores } from 'src/app/models/errores.model';
import { UsuarioService, ContenidoService } from 'src/app/services/service.index';

import { GridOptions } from 'ag-grid-community';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

import swal from 'sweetalert2';
import { Router } from '@angular/router';

// import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-importar-contenidos',
  templateUrl: './importar-contenidos.component.html',
  styles: []
})
export class ImportarContenidosComponent implements OnInit {

  @ViewChild('upfile') uploadfile: ElementRef;

  flagSelectEmp: Boolean = false;
  empresa_fc = new FormControl( null );

  arrayBuffer:any;
  file:File;

  empresas: Empresa[] = [];
  cajas: Array<any> = [];
  secciones: Array<any> = [];

  localeText = LOCALETEXT;
  gridApi: any;

  /// Errores
  errores: Array<Errores> = [];
  /// Etiquetas cajas
  labelrequired: number = 0;
  labelexist: number = 0;
  /// Titulo contenido
  contentrequired: number = 0;
  /// Area
  areaexist: number = 0;
  /// Tipos
  typeexist: number = 0;
  /// Fechas
  datedcformat: number = 0;
  datehcformat: number = 0;

  public paginationPageSize;
  codigo: string = '';


  columnDefs = [

    { headerName: 'ETIQUETA CAJA', field: 'ETIQUETA CAJA', sortable: true, resizable: true, filter: true, width: 150,
      cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        if(data.value == null){
          return '<label class="label label-danger">Requerido</label>';
        }
        else if(!(this.boxExist(data.value))){
          return '<span class="dot"></span>&nbsp;' + data.value;
        }
        else{
          return data.value;
        }
      }
      // cellClassRules: {
      //     'rag-red-outer': (params) => { return !(this.boxExist(params.value))},
      //     // 'rag-red-outer': (params) => { return params.value == null},
      //     // 'rag-red-outer': (params) => { return params.value == null},
      // }
    }, 
    // { headerName: 'ETIQUETA DOC.', field: 'ETIQUETA DOC.', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'CONTENIDO', field: 'CONTENIDO', sortable: true, resizable: true, filter: true, width: 250,
      cellRenderer: (data) => {
          if(data.value == null){
            return '<label class="label label-danger">Requerido</label>'
          } 
          else{
            return data.value;
          }
    }},
    { headerName: 'AREA', field: 'AREA', sortable: true, resizable: true, filter: true, width: 150, 
      cellRenderer: (data) => {
        if(data.value != null){
          if(!(this.areaExist(data.value))){
            return '<span class="dot"></span>&nbsp;' + data.value;
          }
          else{
            return data.value;
          }
        }
      }
    },
    { headerName: 'TIPO DE DOCUMENTO', field: 'TIPO DE DOCUMENTO', sortable: true, resizable: true, filter: true, width: 150,
      cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        if(data.value != null){
          if(!(this.typeExist(data.value, data.data.AREA))){
            return '<span class="dot"></span>&nbsp;' + data.value;
          }
          else{
            return data.value;
          }
        }
      }
    },
    { headerName: 'DESDE N°', field: 'DESDE N°', sortable: true, resizable: true, filter: true, width: 100, cellStyle: { 'text-align': "center" } },
    { headerName: 'HASTA N°', field: 'HASTA N°', sortable: true, resizable: true, filter: true, width: 100, cellStyle: { 'text-align': "center" } },
    { headerName: 'DESDE LETRA', field: 'DESDE LETRA', sortable: true, resizable: true, filter: true, width: 120, cellStyle: { 'text-align': "center" } },
    { headerName: 'HASTA LETRA', field: 'HASTA LETRA', sortable: true, resizable: true, filter: true, width: 120, cellStyle: { 'text-align': "center" } },
    { headerName: 'DESDE FECHA', field: 'DESDE FECHA', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 170,
      filterParams: FILTERPARAMS, comparator: dateComparator,
      cellRenderer: (data) => {
        if(data.value != null){
          if(this.formatDateTable(data.value)){
            return data.value;
          } else {
            return '<span class="outer"><span class="inner">' + data.value + '</span></span>'
          }
        }
      }
    },
    { headerName: 'HASTA FECHA', field: 'HASTA FECHA', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 170,
      filterParams: FILTERPARAMS, comparator: dateComparator,
      cellRenderer: (data) => {
        if(data.value != null){
          if(this.formatDateTable(data.value)){
            return data.value;
          } else {
            return '<span class="outer"><span class="inner">' + data.value + '</span></span>'
          }
        }
      }
    },
    { headerName: 'OBSERVACION', field: 'OBSERVACION', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" } },

  ];

  rowData = [];
  // rowExport = [];

  public gridOptions: GridOptions = {
      rowClassRules: {
          'fila-anulada': function(params) { 
            let baja: boolean = false;
            (params.data.anulado === 1) ? baja = true : baja = false;
            return baja;
          }
      },
      context: {
        componentParent: this
      },
      animateRows: true,
  };

  constructor(
    public dialog: MatDialog,
    public _usuarioService: UsuarioService,
    public _contenidoService: ContenidoService,
    public route: Router
  ) { }

  ngOnInit() {

      this.paginationPageSize = 15;

      this._usuarioService.cargarEmpresas()
          .subscribe( (resp:any) => {
            this.empresas = resp.listaodempresas;
      });
  }

  empresaSelect( empresa: any ){

    this.cajas = [];
    this.secciones = [];
    this.flagSelectEmp = false;

      this._contenidoService.obtenerCajasSecciones( empresa )
          .subscribe( (resp:any) => {
            this.flagSelectEmp = true;
            this.cajas = resp.cajas;
            this.secciones = resp.secciones;
          });
  }

  onGridready( params: any ){
     this.gridApi = params.api;
  }

  incomingfile(event) {
    this.file = event.target.files[0]; 
  }
  
  Clear(){
    // Eliminar los errores.
    this.ClearArrays();

    this.empresa_fc.reset();
    this.cajas = [];
    this.secciones = [];
    this.flagSelectEmp = false;
    this.uploadfile.nativeElement.value = "";
    this.rowData = [];
  }

  ClearArrays(){
    // this.rowExport = [];
    this.errores = [];
    this.labelrequired = 0;
    this.labelexist = 0;
    this.contentrequired = 0;
    this.areaexist = 0;
    this.typeexist = 0;
    this.datedcformat = 0;
    this.datehcformat = 0;
  }

  Subir(){

    this.rowData.forEach( ( exp:any ) => {
        
      this.cajas.forEach( ( box:any ) => {

        if(box.id_codigo == exp["ETIQUETA CAJA"]){
           exp["CAJA"] = box._id;
           delete exp["ETIQUETA CAJA"];
        } 

      });

      this.secciones.forEach( ( sec:any ) => {

        if(sec.nombre_area == exp["AREA"]){
          exp["AREA"] = sec.id_area;

          if(sec.nombre_tipo == exp["TIPO DE DOCUMENTO"]){
            exp["TIPO DE DOCUMENTO"] = sec.id_tipo;
          } 
        } 

      });

      if(exp["DESDE FECHA"] != null){
        exp["DESDE FECHA"] = this.formatDateExport(exp["DESDE FECHA"]);
      }

      if(exp["HASTA FECHA"] != null){
        exp["HASTA FECHA"] = this.formatDateExport(exp["HASTA FECHA"]);
      }
      
    });


    this._contenidoService.importarContenido( this.rowData )
      .subscribe( (resp:any) => {
          
          console.log(resp);
          this.Clear();

          swal({
            title: 'Generación satisfactoria',
            text: 'Se ha agregado el contenido especificado.',
            type: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              this.route.navigate(['/contenidos/tabla-contenidos']);
            }
          });

      },
      err => {
        console.log(err);
        swal({
            title: 'Error al crear contenidos',
            text: 'Ocurrió un error mientras se procesaba la solicitud.',
            type: 'error',
            confirmButtonText: 'Ok'
          });
      });

  }

  Errors(){

    this.ClearArrays();

    this.rowData.forEach( ( resp:any ) => {

      if( resp["ETIQUETA CAJA"] != null){
        if(!(this.boxExist( resp["ETIQUETA CAJA"] ))){
          this.labelexist++
        }
      } else{
        this.labelrequired++
      }

      if( resp["CONTENIDO"] == null){
        this.contentrequired++
      }

      if( resp["AREA"] != null){
        if(!(this.areaExist(resp["AREA"]))){
          this.areaexist++
        }
      }

      if( resp["TIPO DE DOCUMENTO"] != null){
        if(!(this.typeExist( resp["TIPO DE DOCUMENTO"], resp["AREA"] ))){
          this.typeexist++
        }
      }

      if( resp["DESDE FECHA"] != null){
        if(!(this.formatDateTable(resp["DESDE FECHA"]))){
          this.datedcformat++
        }
      }

      if( resp["HASTA FECHA"] != null){
        if(!(this.formatDateTable(resp["HASTA FECHA"]))){
          this.datehcformat++
        }
      }

    });

    if(this.labelrequired != 0){
      let error = new Errores (
        'Etiqueta',
        'Campo requerido',
        this.labelrequired
      );
      this.errores.push(error);
    }
    if(this.labelexist != 0){
      let error = new Errores (
        'Etiqueta',
        'No se encuentra en base de datos',
        this.labelexist
      )
      this.errores.push(error);
    }
    if(this.contentrequired != 0){
      let error = new Errores (
        'Contenido',
        'Campo requerido',
        this.contentrequired
      )
      this.errores.push(error);
    }
    if(this.areaexist != 0){
      let error = new Errores (
        'Area',
        'No se encuentra en base de datos',
        this.areaexist
      )
      this.errores.push(error);
    }
    if(this.typeexist != 0){
      let error = new Errores (
        'Tipo de documento',
        'No se encuentra en base de datos',
        this.typeexist
      )
      this.errores.push(error);
    }
    if(this.datedcformat != 0){
      let error = new Errores (
        'Desde fecha',
        'Error en el formato',
        this.datedcformat
      )
      this.errores.push(error);
    }
    if(this.datehcformat != 0){
      let error = new Errores (
        'Hasta fecha',
        'Error en el formato',
        this.datehcformat
      )
      this.errores.push(error);
    }

  }

  Upload() {

    let fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary", cellDates:true, cellNF: false, cellText:false});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          // let tablita = XLSX.utils.sheet_to_json(worksheet,{raw:true, defval:'falta'})
          let tablita = XLSX.utils.sheet_to_json(worksheet,{raw:false, defval: null, dateNF:'DD/MM/YYYY'})

          this.rowData = tablita;
          // this.rowExport = tablita;

          this.Errors();
      }
      fileReader.readAsArrayBuffer(this.file);
  }

  boxExist( nodo ){

    var result = false;

    this.cajas.forEach( ( resp:any ) => {
      if(resp.id_codigo === nodo){
        result = true
      }
    });

    return result;
  }

  areaExist( nodo ){

    var result = false;

    this.secciones.forEach( ( resp:any ) => {
      if(resp.nombre_area === nodo){
        result = true
      }
    });

    return result;
  }

  typeExist( nodo, area ){
    var result = false;

    this.secciones.forEach( ( resp:any ) => {
      if(resp.nombre_tipo === nodo && resp.nombre_area === area ){
        result = true
      }
    });

    return result;
  }


  formatDateTable(fecha){

    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha))
        return false;

    // Parse the date parts to integers
    var parts = fecha.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1900 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];

  }

  formatDateExport(fecha){
    var parts = fecha.split('/');
    var y = parseInt(parts[2]);
    var m = parseInt(parts[1]);
    var d = parseInt(parts[0]);
    var mydate = new Date(y, m - 1, d);
    return mydate;
  }


  openDialogErrors(): void {
    this.dialog.open(DialogErrors, {
      width: '400px',
      data: this.errores
    });
  }

}

@Component({
  selector: 'dialog-errors',
  templateUrl: 'dialog-errors.component.html',
})
export class DialogErrors {

  constructor(
    public dialogRef: MatDialogRef<DialogErrors>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    ngOnInit(): void {
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
