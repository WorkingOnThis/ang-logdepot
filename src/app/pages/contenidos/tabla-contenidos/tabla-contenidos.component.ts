import { Component, OnInit } from '@angular/core';
import { UsuarioService, ContenidoService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';
// import { ButtonPosicionComponent } from '../posicionar-caja/button-posicion/button-posicion.component';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';
import { Empresa } from 'src/app/models/empresa.model';

@Component({
  selector: 'app-tabla-contenidos',
  templateUrl: './tabla-contenidos.component.html',
  styles: []
})
export class TablaContenidosComponent implements OnInit {

  codigo: string = '';
  empresas: Empresa[] = [];  

  // quickSearchValue: string = '';

  public paginationPageSize;

  gridApi: any;

  // frameworkComponents: any = {
  //  buttonPosicion: ButtonPosicionComponent,
  // };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    // { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    // cellRenderer: 'buttonPosicion',
    // },
    { headerName: 'EN PRESTAMO', field: 'prestamo', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == 0 ? '<i class="fas fa-times text-danger"></i>' : '<i class="fas fa-check text-primary"></i>';
      }  
    },
    { headerName: 'ETIQUETA CAJA', field: 'etiqueta', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'ETIQUETA DOC.', field: 'etiqueta_doc', sortable: true, resizable: true, filter: true, width: 150 },

    { headerName: 'CONTENIDO', field: 'txt_contenido', sortable: true, resizable: true, filter: true, width: 250 },
    // { headerName: 'EMPRESA', field: 'empresa', sortable: true, resizable: true, filter: true, width: 150 },
    // { headerName: 'PRECINTO', field: 'precinto', sortable: true, resizable: true, filter: true, width: 110, cellStyle: { 'text-align': "center" },
    //   cellRenderer: (data) => {
    //     return data.value == null ? '<i class="fas fa-unlock-alt text-primary"></i>' : data.value;
    //   } 
    // },
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
    // { headerName: 'USUARIO CREACION', field: 'id_usuario_alta', sortable: true, resizable: true, filter: true, cellStyle: { 'text-align': "center" } },

    // { headerName: 'ANULADO', field: 'fecha_baja', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
    //   cellRenderer: (data) => {
    //     return data.value === null ? '<i class="fas fa-times text-danger"></i>' : '<i class="fas fa-check text-primary"></i>';
    //   }
    // },

 
    // DEBO TRAER PRESTAMO
    // VERIFICAR ANULACION

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
      },
      animateRows: true,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
  };

  ageType: string = 'everyone';

  isExternalFilterPresent() {
      // if ageType is not everyone, then we are filtering
      return this.ageType != 'everyone';
  }

  doesExternalFilterPass(node) {

      switch (this.ageType) {
          case this.ageType: return node.data.empresa == this.ageType;
          case undefined: return;
          default: return true;
      }
  }

  externalFilterChanged(newValue) {
    this.ageType = newValue;
    this.gridOptions.api.onFilterChanged();
  }

  constructor(
    public dialog: MatDialog,
    public _contenidoService: ContenidoService,
    public _usuarioService: UsuarioService,
    ) { }
    
    ngOnInit() {
      this.paginationPageSize = 15;
      this.datos();

      this._usuarioService.cargarEmpresas()
          .subscribe( (resp:any) => {
            this.empresas = resp.listaodempresas;
      });
    }

    openDialogCodigo(): void {
      const dialogRef = this.dialog.open(DialogCodigo, {
        // height: '800px',
        width: '400px',
        data: {codigo: this.codigo}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.codigo = result; // se puede agregar result al arreglo directamente.
      });
    }

    datos(){
      this._contenidoService.obtenerContenidos()
        .subscribe( (resp:any) => {

          resp.forEach((element, index) => {
            
            if(element.desde_fecha != null){
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

    onBtnExport(){
      const params = {
        columnGroups: true,
        allColumns: false,
        fileName: 'Listado de cajas',
      };
      this.gridApi.exportDataAsCsv(params);
    }

    formatDate(todayTime){
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      return day + "/" + month + "/"  + year;
    }

}
