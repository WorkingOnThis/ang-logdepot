import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LoteService } from '../../../../services/service.index';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
import { Lote } from '../../../../models/lote.model';


@Component({
  selector: 'app-button-lote',
  templateUrl: './button-lote.component.html',
  styleUrls: ['./button-lote.component.css'],
})
export class ButtonLoteComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
  params;
  label: string;
  
  lote: Lote;
  usuario_baja: Usuario;
  
  constructor(
    public _loteService: LoteService
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

  desanularLote(id: string, rowIndex: number){
    this._loteService.desanularLote( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Caja',
            text: 'Se ha restaurado el lote seleccionado.',
            type: 'success',
            confirmButtonText: 'Ok'
          })

          this.params.context.componentParent.updateRow(rowIndex);
        }
    });
  }

  eliminarLote(id: string, rowIndex: number){
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

  anularLote(id: string, rowIndex: number){

    this.lote = new Lote(null, null, null, null, this.usuario_baja._id, null,null, null, id );

    this._loteService.anularLote( this.lote )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Lote',
                  text: 'Se ha anulado el lote seleccionado.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
