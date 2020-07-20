import { Injectable, EventEmitter } from '@angular/core';
import { CajaService } from '../../services/service.index';
import { Caja } from './caja';

@Injectable({
  providedIn: 'root'
})
export class ModalDepositoService {

  public oculto: string = 'oculto';
  public id: string;
  public notificacion = new EventEmitter<any>();
  public color: string;
  public id_caja: Caja;


  constructor(
    public _cajaService: CajaService
  ) { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.id = null;
  }

  mostrarModal( id: string ) {

    this.oculto = '';
    this.id = id;
      this._cajaService.obtenerCajaParaModal( this.id )
      .subscribe( (resp:any) => {
        this.id_caja = resp.cajas[0]
        console.log( this.id_caja.color );
      });
  }

}
