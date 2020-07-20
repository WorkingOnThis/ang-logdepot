import { Component, OnInit } from '@angular/core';
import { UsuarioService, ContenidoService, MovimientosService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';
import { MatDialog } from '@angular/material';
import { Empresa } from 'src/app/models/empresa.model';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';

@Component({
  selector: 'app-entradas',
  templateUrl: './tabla-movimientos.component.html',
  styles: []
})
export class TablaMovimientosComponent implements OnInit {

  codigo: string = '';
  empresas: Empresa[] = [];  

  public paginationPageSize;

  gridApi: any;

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    // { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    // cellRenderer: 'buttonPosicion',
    // },
    { headerName: 'MOVIMIENTO', field: 'accion', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == 0 ? '<label class="label label-danger">Salida</label>' : '<label class="label label-success">Entrada</label>';
      }  
    },
    // { headerName: 'PRODUCTO', field: 'tipo_prod', sortable: true, resizable: true, width: 120, cellStyle: { 'text-align': "center" },
    //   cellRenderer: (data) => {
    //     return data.value == 'Caja' ? '<i class="fas fa-box text-primary"></i>' : '<i class="fas fa-file-alt text-danger"></i>';
    //   }  
    // },
    { headerName: 'PRODUCTO', field: 'tipo_prod', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" } },
    { headerName: 'EMPRESA', field: 'empresa', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'CODIGO', field: 'codigo', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'ASOCIACION', field: 'asociacion', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'OBSERVACION', field: 'observacion', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" } },
    { headerName: 'FECHA GENERADO', field: 'fecha_alta', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 170,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'GENERADOR', field: 'id_usuario_alta', sortable: true, resizable: true, filter: true, width: 150 }
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
    public _movimientosService: MovimientosService,
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
      this._movimientosService.cargarMovimientos()
        .subscribe( (resp:any) => {

          resp.forEach((element, index) => {
            
            if(element.fecha_alta != null){
              let dateobj = new Date (element.fecha_alta);
              resp[index].fecha_alta = this.formatDate(dateobj);
            }

          });

          console.log(resp);

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
        fileName: 'Listado de movimientos',
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
