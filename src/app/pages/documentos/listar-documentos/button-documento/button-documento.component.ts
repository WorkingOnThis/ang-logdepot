import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DocumentoService } from '../../../../services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
import { Documento } from '../../../../models/documento.model';


@Component({
  selector: 'app-button-documento',
  templateUrl: './button-documento.component.html',
  styleUrls: ['./button-documento.component.css'],
})
export class ButtonDocumentoComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  
  params;
  label: string;

  documento: Documento;
  usuario_baja: Usuario;
  
  constructor(
    public _documentoService: DocumentoService
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

  desanularDocumento(id: string, rowIndex: number){
    this._documentoService.desanularDocumento( id )
      .subscribe( (resp:any) => {
          if(resp.ok === true){
            
            swal({
              title: 'Documento',
              text: 'Se ha restaurado el documento seleccionado.',
              type: 'success',
              confirmButtonText: 'Ok'
            })
  
            this.params.context.componentParent.updateRow(rowIndex);
          }
      });
  }

  eliminarDocumento(id: string, rowIndex: number){
    // this._documentoService.eliminarRecibo( id )
    // .subscribe( (resp:any) => {
        
    //     if(resp.ok === true){
    //       swal({
    //         title: 'Documento',
    //         text: 'Se ha eliminado la documento seleccionada.',
    //         type: 'success',
    //         confirmButtonText: 'Ok'
    //       })

    //       this.params.context.componentParent.updateRow(rowIndex, true);
    //     }
    // });
  }

  anularDocumento(id: string, rowIndex: number){

    this.documento = new Documento(null, null, null, null, null, this.usuario_baja._id, null, null, id);

    this._documentoService.anularDocumento( this.documento )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Documento',
                  text: 'Se ha anulado la documento seleccionada.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
