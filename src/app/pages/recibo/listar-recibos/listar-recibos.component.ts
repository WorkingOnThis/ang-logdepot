import { Component, OnInit } from '@angular/core';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from 'src/app/config/config';
import { ReciboService } from 'src/app/services/service.index';
import { ButtonRendererComponent } from './button-renderer/button-renderer.component';
import { map } from 'rxjs/operators';
import { GridOptions } from 'ag-grid-community';


@Component({
  selector: 'app-listar-recibos',
  templateUrl: './listar-recibos.component.html',
  styles: []
})
export class ListarRecibosComponent implements OnInit {

  quickSearchValue: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
    buttonRenderer: ButtonRendererComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonRenderer',
      // cellRendererParams: {
      //   onClick: this.onBtnClick1.bind(this),
      //   label: 'Click 1'
      // }
    },
    { headerName: 'EMPRESA', field: 'nombre_empresa', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'RAZON SOCIAL', field: 'razon_social', sortable: true, resizable: true, filter: true, width: 150 },
    // { headerName: 'DIRECCION', field: 'direccion', sortable: true, resizable: true, filter: true },
    // { headerName: 'TELEFONO', field: 'telefono', sortable: true, resizable: true, filter: true },
    // { headerName: 'RESPONSABLE', field: 'responsable', sortable: true, resizable: true, filter: true },
    { headerName: 'E-MAIL', field: 'email', sortable: true, resizable: true, filter: true },
    { headerName: 'DIRECCION ENVIO', field: 'envio', sortable: true, resizable: true, filter: true },
    { headerName: 'FECHA INGRESADA', field: 'fecha', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    // { headerName: 'NOMBRE FIRMA', field: 'firma_nombre', sortable: true, resizable: true, filter: true },
    // { headerName: 'APELLIDO FIRMA', field: 'firma_apellido', sortable: true, resizable: true, filter: true },
    // { headerName: 'OBSERVACIONES', field: 'observaciones', sortable: true, resizable: true, filter: true },
    { headerName: 'ENVIAR EMAIL', field: 'enviar_email', sortable: true, cellStyle: { 'text-align': "center" }, resizable: true,
      width: 120,
      cellRenderer: (data) => {
        return data.value ? '<i class="fas fa-check text-primary"></i>' : '<i class="fas fa-times text-danger"></i>';
      } 
    },
    { headerName: 'FECHA CREACION', field: 'fecha_creacion', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'USUARIO CREACION', field: 'usuario_creacion', sortable: true, resizable: true, filter: true },
    // { headerName: 'FECHA BAJA', field: 'FECHA_BAJA', sortable: true, resizable: true, filter: true },
    // { headerName: 'USUARIO BAJA', field: 'USUARIO_BAJA', sortable: true, resizable: true, filter: true }
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
    public _reciboService: ReciboService,
    ) { }
    
    ngOnInit() {
      this.paginationPageSize = 15;
      this.datos();
    }

    datos(){
      this._reciboService.obtenerRecibos()
        .subscribe( (resp:any) => {

          resp.forEach((element, index) => {
            let dateobj = new Date (element.fecha_creacion);
            resp[index].fecha_creacion = this.formatDate(dateobj);

            let dateobj1 = new Date (element.fecha);
            resp[index].fecha = this.formatDate(dateobj1);

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

        this._reciboService.obtenerRecibo(rowNode.data._id)
              .subscribe( (resp:any) => {

                  let dateobj = new Date (resp.fecha_creacion);
                  resp.fecha_creacion = this.formatDate(dateobj);

                  let dateobj1 = new Date (resp.fecha);
                  resp.fecha = this.formatDate(dateobj1);

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
        fileName: 'Listar_recibos',
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
