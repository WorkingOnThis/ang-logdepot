import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';

// import * as swal from 'sweetalert';

import { UsuarioService } from '../../../services/service.index';
import { LOCALETEXT, FILTERPARAMS, dateComparator } from '../../../config/config';
import { GridOptions } from 'ag-grid-community';

import { ButtonUsuarioComponent } from './button-usuario/button-usuario.component';


@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styles: []
})

export class ListarUsuariosComponent implements OnInit {

  codigo: string = '';

  public paginationPageSize;

  gridApi: any;

  frameworkComponents: any = {
   buttonUsuario: ButtonUsuarioComponent,
  };

  rowDataClicked1 = {};

  localeText = LOCALETEXT;

  columnDefs = [
    { headerName: 'ACCIONES', field: '_id', sortable: true, cellStyle: { 'text-align': "center" }, width: 90,
    cellRenderer: 'buttonUsuario',
    },
    { headerName: 'NOMBRE', field: 'nombre', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'APELLIDO', field: 'apellido', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'EMPRESA', field: 'empresa', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'CARGO', field: 'role', sortable: true, resizable: true, filter: true, width: 150, cellStyle: { 'font-size': "13px" },
      cellRenderer: (data) => {
        return data.value == 'ROLE_ADMIN' ? '<label class="label label-danger">Administrador</label>' : '<label class="label label-info">Usuario</label>';
      }  
    },
    { headerName: 'E-MAIL', field: 'email', sortable: true, resizable: true, filter: true, width: 210 },
    { headerName: 'TELEFONO', field: 'telefono', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'DNI', field: 'dni', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'FECHA DE ALTA', field: 'fecha_creacion', sortable: true, resizable: true, filter: 'agDateColumnFilter',
      cellStyle: { 'text-align': "center" }, width: 180,
      filterParams: FILTERPARAMS, comparator: dateComparator
    },
    { headerName: 'USUARIO CREACION', field: 'id_creador', sortable: true, resizable: true, filter: true, width: 160,
      cellStyle: { 'text-align': "center" } }
  ];
  
  rowData = [];

  // <label class="label label-danger mt-3">Administrador</label>
  // <label class="label label-info mt-3">Usuario</label>

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
    public _usuarioService: UsuarioService
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
      this._usuarioService.cargarUsuarios()
        .subscribe( (resp:any) => {

          resp = resp.usuarios;

          console.log(resp);

          resp.forEach((element, index) => {
            let dateobj = new Date (element.fecha_creacion);
            resp[index].fecha_creacion = this.formatDate(dateobj);

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
        this._usuarioService.cargarUsuario(rowNode.data._id)
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
        fileName: 'Listado de usuarios',
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
