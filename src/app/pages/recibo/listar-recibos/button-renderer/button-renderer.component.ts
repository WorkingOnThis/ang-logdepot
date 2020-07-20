import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Recibo } from 'src/app/models/recibo.model';
import { ReciboService } from 'src/app/services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';


@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.css'],
})
export class ButtonRendererComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
  params;
  label: string;
  
  recibo: Recibo;
  usuario_baja: Usuario;
  
  constructor(
    private _reciboService: ReciboService,
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
      html: "<h2><b>Información</1></h2><hr><div>Anulado por el usuario: </div><br />" + data.usuario_baja +  "<br /><br />Fecha: " + data.fecha_baja ,
      confirmButtonText: 'Ok'
    })
  }

  desanularRecibo(id: string, rowIndex: number){
    this._reciboService.desanularRecibo( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Recibo',
            text: 'Se ha restaurado el recibo seleccionado.',
            type: 'success',
            confirmButtonText: 'Ok'
          })

          this.params.context.componentParent.updateRow(rowIndex);
        }
    });
  }

  eliminarRecibo(id: string, rowIndex: number){
    this._reciboService.eliminarRecibo( id )
    .subscribe( (resp:any) => {
        
        if(resp.ok === true){
          swal({
            title: 'Recibo',
            text: 'Se ha eliminado el recibo seleccionado.',
            type: 'success',
            confirmButtonText: 'Ok'
          })

          this.params.context.componentParent.updateRow(rowIndex, true);
        }
    });
  }

  anularRecibo(id: string, rowIndex: number){

    console.log(rowIndex);

    this.recibo = new Recibo(null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, id, null, this.usuario_baja._id);

    this._reciboService.anularRecibo( this.recibo )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Recibo',
                  text: 'Se ha anulado el recibo seleccionado.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
