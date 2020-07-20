import { Component, OnInit } from '@angular/core';
import { LOCALETEXT } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';
// import { Caja } from '../../../models/caja.model';
// import { LoteService } from '../../../services/service.index';
import { ButtonEtiquetaComponent } from './button-etiqueta/button-etiqueta.component';
import { EtiquetaService } from '../../../services/etiqueta/etiqueta.service';

@Component({
  selector: 'app-etiquetas-individuales',
  templateUrl: './etiquetas-individuales.component.html',
  styles: []
})
export class EtiquetasIndividualesComponent implements OnInit {


  codigo: string = '';

  // quickSearchValue: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
   buttonEtiqueta: ButtonEtiquetaComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonEtiqueta',
    },
    { headerName: 'CODIGO', field: 'codigo', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'LOTE', field: 'lote', sortable: true, cellStyle: { 'text-align': "center" }, resizable: true, filter: true, width: 90 },
    { headerName: 'N° ETIQUETA', field: 'num_etiqueta', sortable: true, cellStyle: { 'text-align': "center" }, resizable: true, filter: true, width: 120 },
    { headerName: 'TIPO', field: 'tipo', sortable: true, resizable: true, filter: true, width: 90 },
    { headerName: 'ESTADO', field: 'estado', sortable: true, resizable: true, filter: true, width: 110},
    // { headerName: 'CANTIDAD', field: 'cantidad', sortable: true, resizable: true, filter: true, width: 110, cellStyle: { 'text-align': "center" } },
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
    public _etiquetaService: EtiquetaService
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
      this._etiquetaService.obtenerEtiquetas()
        .subscribe( (resp:any) => {
          
          resp.forEach((element, index) => {

            if(element.fecha_baja != null){
              let dateobj2 = new Date (element.fecha_baja);
              resp[index].fecha_baja = this.formatDate(dateobj2);
            }
          });

          this.rowData = resp;
          
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
        this._etiquetaService.obtenerEtiqueta(rowNode.data._id)
              .subscribe( (resp:any) => {

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
