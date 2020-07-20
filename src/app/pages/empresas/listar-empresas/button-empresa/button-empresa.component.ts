import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { EmpresaService } from '../../../../services/service.index';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';
import { Usuario } from '../../../../models/usuario.model';
import { MatMenuTrigger } from '@angular/material';

import swal from 'sweetalert2';
import { Empresa } from '../../../../models/empresa.model';


@Component({
  selector: 'app-button-empresa',
  templateUrl: './button-empresa.component.html',
  styleUrls: ['./button-empresa.component.css'],
})
export class ButtonEmpresaComponent implements ICellRendererAngularComp {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  params;
  label: string;
  
  empresa: Empresa;
  usuario_baja: Usuario;
  
  constructor(
    public _empresaService: EmpresaService
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

  desanularEmpresa(id: string, rowIndex: number){
    this._empresaService.desanularEmpresa( id )
    .subscribe( (resp:any) => {
        if(resp.ok === true){
          
          swal({
            title: 'Empresa',
            text: 'Se ha restaurado la empresa seleccionada.',
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

  anularEmpresa(id: string, rowIndex: number){

    this.empresa = new Empresa(null, null, null, null, null, null, null, null, null, null, null, null, null,
                   null, null, null, null, null, null, null, null, null, this.usuario_baja._id, null, id);

    this._empresaService.anularEmpresa( this.empresa )
          .subscribe( (borrado:any) => {
              
              if(borrado.ok === true){
                
                swal({
                  title: 'Empresa',
                  text: 'Se ha anulado la empresa seleccionada.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.params.context.componentParent.updateRow(rowIndex);
                
              }
          });

  }
  
}
