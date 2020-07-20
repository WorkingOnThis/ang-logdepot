import { Component, OnInit } from '@angular/core';
import { ModalGenericoService } from './modal-generico.service';

@Component({
  selector: 'app-modal-generico',
  templateUrl: './modal-generico.component.html',
  styles: []
})
export class ModalGenericoComponent implements OnInit {

  constructor(
    public _modalGenericoService: ModalGenericoService
  ) { }

  cerrarModal(){
    this._modalGenericoService.ocultarModal();
  }

  ngOnInit() {
  }

}
