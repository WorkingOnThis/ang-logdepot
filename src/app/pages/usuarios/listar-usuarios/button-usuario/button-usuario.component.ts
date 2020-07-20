import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UsuarioService } from '../../../../services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';


@Component({
  selector: 'app-button-usuario',
  templateUrl: './button-usuario.component.html',
  styleUrls: ['./button-usuario.component.css'],
})
export class ButtonUsuarioComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  params;
  label: string;
  
  usuario: Usuario;
  anulado: any;
  usuario_baja: Usuario;
  
  constructor(
    public _usuarioService: UsuarioService
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
    console.log(data);
    swal({
      html: "<h2><b>Información</1></h2><hr><div>Anulado por el usuario: </div><br />" + data.id_usuario_baja +  "<br /><br />Fecha: " + data.fecha_baja ,
      confirmButtonText: 'Ok'
    })
  }

  desanularUsuario(id: string, rowIndex: number){
    this._usuarioService.desanularUsuario( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Usuario',
            text: 'Se ha restaurado el usuario seleccionado.',
            type: 'success',
            confirmButtonText: 'Ok'
          })

          this.params.context.componentParent.updateRow(rowIndex);
        }
    });
  }

  eliminarCaja(id: string, rowIndex: number){
    // this._reciboService.eliminarRecibo( id )
    // .subscribe( (resp:any) => {
        
    //     if(resp.ok === true){
    //       swal({
    //         title: 'Caja',
    //         text: 'Se ha eliminado la caja seleccionada.',
    //         type: 'success',
    //         confirmButtonText: 'Ok'
    //       })

    //       this.params.context.componentParent.updateRow(rowIndex, true);
    //     }
    // });
  }

  anularUsuario(id: string, rowIndex: number){

    this.anulado = {
      _id: id,
      id_usuario_baja: this.usuario_baja._id
    };

    this._usuarioService.anularUsuario( this.anulado )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Usuario',
                  text: 'Se ha anulado el usuario seleccionado.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });
  }
  
}
