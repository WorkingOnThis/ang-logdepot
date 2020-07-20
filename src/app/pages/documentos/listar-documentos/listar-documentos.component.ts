import { Component, OnInit } from '@angular/core';
import { Documento } from '../../../models/documento.model';
import { DocumentoService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';
import { ButtonDocumentoComponent } from './button-documento/button-documento.component';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-listar-documentos',
  templateUrl: './listar-documentos.component.html',
  styles: []
})
export class ListarDocumentosComponent implements OnInit {

  codigo: string = '';
  
  // quickSearchValue: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
   buttonDocumento: ButtonDocumentoComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonDocumento',
    },
    { headerName: 'CODIGO', field: 'id_codigo', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'CAJA', field: 'codigo_caja', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'PRESTAMO', field: 'prestamo', sortable: true, resizable: true, width: 110, cellStyle: { 'text-align': "center" },
      cellRenderer: (data) => {
        return data.value == 0 ? '<i class="fas fa-times text-danger"></i>' : '<i class="fas fa-check text-primary"></i>';
      }  
    },
    { headerName: 'FECHA DE ALTA', field: 'fecha_alta', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'USUARIO CREACION', field: 'id_usuario_alta', sortable: true, resizable: true, filter: true },
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
    public _documentoService: DocumentoService
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
      this._documentoService.cargarDocumentos()
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
        this._documentoService.obtenerDocumento(rowNode.data._id)
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
        fileName: 'Listado de documentos',
      };
      this.gridApi.exportDataAsCsv(params);
    }

    formatDate(todayTime){
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      return day + "/" + month + "/"  + year;
    }

  // dtOptions: any = {};
  
  // documentos: Array<any> = [];

  // cargando: boolean = true;

  // constructor(
  //   public _documentoService: DocumentoService
  // ) { }

  // ngOnInit() {

  //   $.fn.dataTable.ext.errMode = 'throw';

  //   this.dtOptions = {

  //     dom: 'Bfrtip',

  //     buttons: [

  //       { extend: 'copy', text: 'Copiar' },
  //       { extend: 'print', text: 'Imprimir' },
  //       { extend: 'excel', text: 'Excel' }
  //     ],
    
  //     pagingType: 'full_numbers',
  //     responsive: true,

  //     language: {
  //       processing: "Procesando...",
  //       search: "Buscar:",
  //       lengthMenu: "Mostrar _MENU_ registros",
  //       info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
  //       infoEmpty: "Mostrando ningún elemento.",
  //       infoFiltered: "(filtrado _MAX_ elementos total)",
  //       infoPostFix: "",
  //       loadingRecords: "Cargando registros...",
  //       zeroRecords: "No se encontraron registros",
  //       emptyTable: "No hay datos disponibles en la tabla",
  //       paginate: {
  //         first: "Primero",
  //         previous: "Anterior",
  //         next: "Siguiente",
  //         last: "Último"
  //       },
  //       aria: {
  //         sortAscending: ": Activar para ordenar la tabla en orden ascendente",
  //         sortDescending: ": Activar para ordenar la tabla en orden descendente"
  //       }
  //     }
  //   };

  //   this.cargarDocumentos();

  // }

  // mostrarModal( id: string ) {

  // }

  // cargarDocumentos() {
    
  //   this.cargando = true;

  //   this._documentoService.cargarDocumentos()
  //             .subscribe( (resp: any) => {
  //               console.log(resp.documentos);
  //               this.documentos = resp.documentos;
  //               this.cargando = false;
  //             });
  // }

  // verdadero(){
  //   return true;
  // }

  // borrarUsuario( usuario: string ) {

  // }

}
