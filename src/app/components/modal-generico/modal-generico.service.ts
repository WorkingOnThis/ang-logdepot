import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalGenericoService {

  public oculto: string = 'oculto';

  public mensaje: string = '';

  constructor() { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.mensaje = '';
  }

  mostrarModal( mensaje: string ) {
    this.oculto = '';
    this.mensaje = mensaje;
  }

}
