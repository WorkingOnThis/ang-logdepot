import { Component, OnInit } from '@angular/core';
// import { Caja } from '../../../models/caja.model';
import { CajaService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';
import { ButtonCajaComponent } from './button-caja/button-caja.component';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-listar-cajas',
  templateUrl: './listar-cajas.component.html',
  styles: []
})
export class ListarCajasComponent implements OnInit {

  codigo: string = '';

  // quickSearchValue: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
   buttonCaja: ButtonCajaComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonCaja',
    },
    { headerName: 'CODIGO', field: 'codigo', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'EMPRESA', field: 'empresa', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'PRECINTO', field: 'precinto', sortable: true, resizable: true, filter: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == null ? '<i class="fas fa-unlock-alt text-primary"></i>' : data.value;
      } 
    },
    { headerName: 'POSICION', field: 'ubicacion', sortable: true, resizable: true, filter: true, width: 110 },
    { headerName: 'NUMERO CAJA', field: 'n_caja', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'text-align': "center" }},
    { headerName: 'PRESTAMO', field: 'prestamo', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == 0 ? '<i class="fas fa-times text-danger"></i>' : '<i class="fas fa-check text-primary"></i>';
      }  
    },
    { headerName: 'FECHA DE ALTA', field: 'fecha_alta', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'USUARIO CREACION', field: 'id_usuario_alta', sortable: true, resizable: true, filter: true, cellStyle: { 'text-align': "center" } }
  ];
  
  rowData = [];

  public gridOptions: GridOptions = {
      rowClassRules: {
          'fila-anulada': function(params) { 
            let baja: boolean = false;
            (params.data.fecha_baja !== null) ? baja = true : baja = false;
            return baja;
          }
      },
      context: {
        componentParent: this
      }
  };
  
  constructor(
    public dialog: MatDialog,
    public _cajaService: CajaService
    ) { }
    
    ngOnInit() {
      this.paginationPageSize = 15;
      this.datos();
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
      this._cajaService.cargarCajas()
        .subscribe( (resp:any) => {

          resp.forEach((element, index) => {
            let dateobj = new Date (element.fecha_alta);
            resp[index].fecha_alta = this.formatDate(dateobj);

            if(element.fecha_baja != null){
              let dateobj2 = new Date (element.fecha_baja);
              resp[index].fecha_baja = this.formatDate(dateobj2);
            }
          });

          this.rowData = resp;

          console.log(this.rowData);
        });
    }


    onGridready( params: any ){
        this.gridApi = params.api;
    }

    updateRow(rowIndex: number, eliminar: boolean = false){
      var rowNode = this.gridApi.getRowNode(rowIndex);
      var selectedData = this.gridApi.getSelectedRows();

      if(eliminar){

        this.gridApi.updateRowData({ remove: selectedData});
        this.gridApi.setRowData(this.datos());
      }
      else{
        this._cajaService.obtenerCaja(rowNode.data._id)
              .subscribe( (resp:any) => {

                  let dateobj = new Date (resp.fecha_creacion);
                  resp.fecha_creacion = this.formatDate(dateobj);

                if(resp.fecha_baja != null){
                  let dateobj2 = new Date (resp.fecha_baja);
                  resp.fecha_baja = this.formatDate(dateobj2);
                }

                rowNode.setData(resp);

                // ESTO DEBE SETEAR SOLO 1 ROW
                this.gridApi.setRowData(this.datos());
                // ESTO DEBE SETEAR SOLO 1 ROW
              })
      }
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
