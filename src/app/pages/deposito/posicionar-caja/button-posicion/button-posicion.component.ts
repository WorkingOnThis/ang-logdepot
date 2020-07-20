import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ContenidoService, DepositoService, CajaService } from '../../../../services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
import { Caja } from '../../../../models/caja.model';
import { Estante } from '../../../../models/estante.model';
import { Lugar } from '../../../../models/lugar.model';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../../config/config';
import { GridOptions } from 'ag-grid-community';

import { from, throwError } from 'rxjs';
import { map, filter, distinct, bufferCount, catchError } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { markFormGroupTouched } from 'src/app/pages/recibo/agregar-recibo/agregar-recibo.component';



@Component({
  selector: 'app-button-posicion',
  templateUrl: './button-posicion.component.html',
  styleUrls: ['./button-posicion.component.css'],
})
export class ButtonPosicionComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
  params;
  label: string;
  
  caja: Caja;
  usuario_baja: Usuario;
  
  constructor(
    public dialog: MatDialog,
    ){
      this.usuario_baja = JSON.parse(localStorage.getItem('usuario'));
    }

    agInit(params): void {
      this.params = params;
      this.label = this.params.label || null;
    }
    
    refresh(params?: any): boolean {
      return true;
    }
    
    cerrarMenu() {
      this.trigger.closeMenu();
    }
    
  infoAnulado(data: any){
    swal({
      html: "<h2><b>Información</1></h2><hr><div>Anulado por el usuario: </div><br />" + data.id_usuario_baja +  "<br /><br />Fecha: " + data.fecha_baja ,
      confirmButtonText: 'Ok'
    })
  }


  vercontenidos( id: string, nom_empresa: string ){

      this.dialog.open(DialogContenido, {
        height: '550px',
        width: '1200px',
        panelClass: 'dialog-contenido',
        data: {codigo: id, empresa: nom_empresa}
      });

  }


  posicionar( id: string, codigo: string, nom_empresa: string, rowIndex: number ){

      const dialogRef = this.dialog.open(DialogPosiciones, {
        // height: '550px',
        maxHeight: '90vh',
        maxWidth: '90vw',
        minHeight: '250px',
        panelClass: 'dialog-contenido',
        data: {id: id, codigo: codigo, empresa: nom_empresa}
      });

      dialogRef.afterClosed().subscribe(result => {

        if(result == undefined){
          return;
        }

        if(result.ok == true){

          console.log(result);
          swal({
            title: 'Posicionamiento',
            text: result.mensaje,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.params.context.componentParent.updateRow(rowIndex);

        } else {

          console.log(result.mensaje);
          swal({
            title: 'Error al posicionar',
            text: 'Ocurrió un error mientras se procesaba la solicitud.',
            type: 'error',
            confirmButtonText: 'Ok'
          });
        }

      });

  }
  
}

@Component({
  selector: 'dialog-contenido',
  templateUrl: 'dialog-contenido.component.html'
})
export class DialogContenido {

  public paginationPageSize;

  empresa: string;
  etiqueta: string;

  gridApi: any;

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'EN PRESTAMO', field: 'prestamo', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == 0 ? '<i class="fas fa-times text-danger"></i>' : '<i class="fas fa-check text-primary"></i>';
      }  
    },
    { headerName: 'ETIQUETA DOC.', field: 'etiqueta_doc', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'CONTENIDO', field: 'txt_contenido', sortable: true, resizable: true, filter: true, width: 250 },
    { headerName: 'AREA', field: 'area', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" } },
    { headerName: 'TIPO DE DOCUMENTO', field: 'tipodocumento', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" }},
    { headerName: 'DESDE N°', field: 'desde_n', sortable: true, resizable: true, filter: true, width: 100, cellStyle: { 'text-align': "center" } },
    { headerName: 'HASTA N°', field: 'hasta_n', sortable: true, resizable: true, filter: true, width: 100, cellStyle: { 'text-align': "center" } },
    { headerName: 'DESDE LETRA', field: 'desde_letra', sortable: true, resizable: true, filter: true, width: 120, cellStyle: { 'text-align': "center" } },
    { headerName: 'HASTA LETRA', field: 'hasta_letra', sortable: true, resizable: true, filter: true, width: 120, cellStyle: { 'text-align': "center" } },
    { headerName: 'DESDE FECHA', field: 'desde_fecha', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 170,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'HASTA FECHA', field: 'hasta_fecha', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 170,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'OBSERVACION', field: 'observacion', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" } },
  ];
  
  rowData = [];

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
      }
  };

  constructor(
    public dialogRef: MatDialogRef<DialogContenido>,
    public _contenidoService: ContenidoService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    ngOnInit(){
      this.paginationPageSize = 10;
      this.empresa = this.data.empresa;
      this.etiqueta = this.data.codigo;
      this.datos( this.data.codigo );
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    datos( id ){
      
      this._contenidoService.obtenerContenido( id )
        .subscribe( (resp:any) => {

          resp.forEach((element, index) => {
            
            if(element.hasta_fecha != null){
              let dateobj = new Date (element.desde_fecha);
              resp[index].desde_fecha = this.formatDate(dateobj);
            }

            if(element.hasta_fecha != null){
              let dateobj2 = new Date (element.hasta_fecha);
              resp[index].hasta_fecha = this.formatDate(dateobj2);
            }
          });

          this.rowData = resp;
        });
    }

    onGridready( params: any ){
      this.gridApi = params.api;
    }

    formatDate(todayTime){
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      return day + "/" + month + "/"  + year;
    }

}

@Component({
  selector: 'dialog-posiciones',
  templateUrl: 'dialog-posiciones.component.html'
})
export class DialogPosiciones {

  addpositionspinner: Boolean = false;
  formulario: any;

  cajaSeleccionada: any = null;
  value_posicion: string = '';

  empresa: string;
  etiqueta: string;

  depositos: Estante[] = [];
  estantes: Array<any> = [];
  posiciones: Array<any> = [];

  estante: FormGroup;
  matriz: Array<any> = [];

  depositoSeleccionado: string;
  estanteSeleccionado: string;
  posicionSeleccionado: number;

  lugares: Lugar[] = [];
  lugarBuscado: string = '';
  filas: number;
  columnas: number;

  armar: Array<any> = [];

  form_posicion: FormGroup;
  posicion_fc = new FormControl( null, [Validators.required]);
  n_caja_fc = new FormControl( null, [Validators.required]);


  constructor(
    public dialogRef: MatDialogRef<DialogContenido>,
    public _depositoService: DepositoService,
    public _cajaService: CajaService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    ngOnInit(){
      this.empresa = this.data.empresa;
      this.etiqueta = this.data.codigo;

      this.obtenerEstantes();

      this.form_posicion = new FormGroup({
        posicion: this.posicion_fc,
        n_caja: this.n_caja_fc
      });

    }

    getRequiredErrorMessage(field) {
      return this.form_posicion.get(field).hasError('required') ? 'Este campo es requerido' : '';
    }
    
    guardarPosicion(){

      if( this.form_posicion.invalid ){
        markFormGroupTouched(this.form_posicion);
        return;
      }

      this.addpositionspinner = true;

      this.formulario = {
        _id: this.data.id,
        numero_caja: this.form_posicion.value.n_caja,
        id_posicion: this.cajaSeleccionada._id,
      };

      this._cajaService.posicionar( this.formulario )
        .subscribe( 
          resp => { 
            this.addpositionspinner = false;
            this.form_posicion.reset();
            this.form_posicion.markAsPristine();
            this.form_posicion.markAsUntouched();
            this.dialogRef.close(resp);
         },
         err => {
          this.addpositionspinner = false;
          this.dialogRef.close(err);
          // swal( 'Error en el login', err.error.mensaje, 'error' );
         })

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    obtenerEstantes(){    
      this._depositoService.obtenerEstantes()
            .subscribe( (resp:any) => {
              this.depositos = resp.Estantes;
      });
    }

    
  cambioDeposito( id: string ){

      this.cajaSeleccionada = null;
      this.form_posicion.reset();
      this.form_posicion.markAsPristine();
      this.form_posicion.markAsUntouched();
      this.armar = [];

    this.estantes = [];
    this.posiciones = [];

    this.estanteSeleccionado = '';
    this.posicionSeleccionado = 0;

    from(this.depositos)
        .pipe(
        filter(depo => depo.deposito == id),
        distinct( depo => depo.nombre)
        )
        .subscribe(val => {
          this.estantes.push(val);
          // console.log(val);
        });
  }

  cambioEstante( nombre: string ){

      this.cajaSeleccionada = null;
      this.form_posicion.reset();
      this.form_posicion.markAsPristine();
      this.form_posicion.markAsUntouched();
      this.armar = [];

    this.posiciones = [];
    this.posicionSeleccionado = 0;

    from(this.depositos)
        .pipe(
        filter(depo =>  depo.deposito == this.depositoSeleccionado && depo.nombre == nombre),
        distinct( depo => depo.posicion)
        )
        .subscribe(val => this.posiciones.push(val));
  }

  cambioPosicion(posicion: number){

      this.cajaSeleccionada = null;
      this.form_posicion.reset();
      this.form_posicion.markAsPristine();
      this.form_posicion.markAsUntouched();
      this.armar = [];

    this.posicionSeleccionado = posicion;
    this.lugarBuscado = '';
    this.filas = 0;
    this.columnas = 0;
    this.lugares = [];

    from(this.depositos)
        .pipe(
        filter(depo => depo.deposito == this.depositoSeleccionado && depo.nombre == this.estanteSeleccionado && depo.posicion == this.posicionSeleccionado ),
        map( depo => depo )
        )
        .subscribe( (val) => { 
          this.lugarBuscado = val._id;
          this.filas = val.filas;
          this.columnas = val.columnas;
        });
    
    this.obtenerMatriz();

    this.value_posicion = '';
    
  }

  obtenerMatriz(){
    this._depositoService.obtenerLugares( this.lugarBuscado )
          .subscribe( (resp:any) => {
            this.lugares = resp.lugares;

            this.armar = [];
  
            from(this.lugares)
                .pipe(
                  bufferCount(this.columnas),
                  )
                .subscribe((x) => {
                  this.armar.push(x);
                  // console.log(this.armar);
                });
    });
  }


  selectBox( box: any){

    if(box.color == "#ec6262"){ 

      if(this.cajaSeleccionada !== null){
        document.getElementById(this.cajaSeleccionada._id).classList.remove('focused');
      }

      this.cajaSeleccionada = box;

      document.getElementById(this.cajaSeleccionada._id).classList.add('focused');
      this.form_posicion.controls.posicion.setValue( this.depositoSeleccionado + ' ' + this.cajaSeleccionada.nombre );

    }

  }


}