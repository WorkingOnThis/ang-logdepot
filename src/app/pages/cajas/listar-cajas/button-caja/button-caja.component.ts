import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CajaService } from '../../../../services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
import { Caja } from '../../../../models/caja.model';


@Component({
  selector: 'app-button-caja',
  templateUrl: './button-caja.component.html',
  styleUrls: ['./button-caja.component.css'],
})
export class ButtonCajaComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
  params;
  label: string;
  
  caja: Caja;
  usuario_baja: Usuario;
  
  constructor(
    public _cajaService: CajaService
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

  desanularCaja(id: string, rowIndex: number){
    this._cajaService.desanularCaja( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Caja',
            text: 'Se ha restaurado la caja seleccionada.',
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

  anularCaja(id: string, rowIndex: number){

    this.caja = new Caja(null, null, null, null, null, null, null, null, this.usuario_baja._id, null, null, id );

    this._cajaService.anularCaja( this.caja )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Caja',
                  text: 'Se ha anulado la caja seleccionada.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
