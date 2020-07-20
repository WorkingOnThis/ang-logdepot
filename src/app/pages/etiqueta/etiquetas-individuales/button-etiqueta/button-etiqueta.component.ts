import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
// import { LoteService } from '../../../../services/service.index';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
// import { Lote } from '../../../../models/lote.model';
import { Etiqueta } from '../../../../models/etiqueta.model';
import { EtiquetaService } from '../../../../services/etiqueta/etiqueta.service';


@Component({
  selector: 'app-button-etiqueta',
  templateUrl: './button-etiqueta.component.html',
  styleUrls: ['./button-etiqueta.component.css'],
})
export class ButtonEtiquetaComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
  params;
  label: string;
  
  etiqueta: Etiqueta;
  usuario_baja: Usuario;
  
  constructor(
    public _etiquetaService: EtiquetaService
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

  desanularEtiqueta(id: string, rowIndex: number){
    this._etiquetaService.desanularEtiqueta( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Etiqueta',
            text: 'Se ha restaurado la etiqueta seleccionada.',
            type: 'success',
            confirmButtonText: 'Ok'
          })

          this.params.context.componentParent.updateRow(rowIndex);
        }
    });
  }

  eliminarEtiqueta(id: string, rowIndex: number){
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

  anularEtiqueta(id: string, rowIndex: number){

    // this.etiqueta = new Etiqueta(null, null, null, this.usuario_baja._id, null, id);
    this.etiqueta = new Etiqueta(null, null, null, this.usuario_baja._id, null, id);

    this._etiquetaService.anularEtiqueta( this.etiqueta )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Etiqueta',
                  text: 'Se ha anulado la etiqueta seleccionada.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
