import { Component, OnInit } from '@angular/core';
import { ModalDepositoService } from './modal-deposito.service';
import { Caja } from './caja';

@Component({
  selector: 'app-modal-deposito',
  templateUrl: './modal-deposito.component.html',
  styles: []
})
export class ModalDepositoComponent implements OnInit {

  public id_caja: Caja;

  constructor(
    public _modalDepositoService: ModalDepositoService
  ) { }

  cerrarModal(){
    this._modalDepositoService.ocultarModal();
  }

  ngOnInit() {

  }

}
