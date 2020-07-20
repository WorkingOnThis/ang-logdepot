import { Component, OnInit } from '@angular/core';
// import { Empresa } from '../../../models/empresa.model';
// import { EmpresaService } from '../../../services/service.index'; LISTO
// import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';

import { EmpresaService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';

import { ButtonEmpresaComponent } from './button-empresa/button-empresa.component';
// import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
// import { MatDialog } from '@angular/material';



import swal from 'sweetalert2';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styles: []
})
export class ListarEmpresasComponent implements OnInit {

  codigo: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
   buttonCaja: ButtonEmpresaComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonCaja',
    },
    { headerName: 'NOMBRE', field: 'nombre', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'RAZON SOCIAL', field: 'razon_social', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'DIRECCION', field: 'direccion', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'TELEFONO', field: 'telefono', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'E-MAIL', field: 'mail', sortable: true, resizable: true, filter: true, width: 200 },
    { headerName: 'FECHA DE ALTA', field: 'ingreso', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'USUARIO CREACION', field: 'id_usuario_alta', sortable: true, resizable: true, filter: true, width: 160,
      cellStyle: { 'text-align': "center" } }
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
    // public dialog: MatDialog,
    public _empresaService: EmpresaService
    ) { }
    
    ngOnInit() {
      this.paginationPageSize = 15;
      this.datos();
    }

    // openDialogCodigo(): void {
    //   const dialogRef = this.dialog.open(DialogCodigo, {
    //     // height: '800px',
    //     width: '400px',
    //     data: {codigo: this.codigo}
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.codigo = result; // se puede agregar result al arreglo directamente.
    //   });
    // }

    datos(){
      this._empresaService.cargarEmpresas()
        .subscribe( (resp:any) => {

          resp = resp.empresas;

          console.log(resp);

          resp.forEach((element, index) => {
            let dateobj = new Date (element.ingreso);
            resp[index].ingreso = this.formatDate(dateobj);

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
        this._empresaService.cargarEmpresa(rowNode.data._id)
              .subscribe( (resp:any) => {

                let dateobj = new Date (resp.ingreso);
                resp.ingreso = this.formatDate(dateobj);

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
        fileName: 'Listado de empresas',
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