import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Lote } from '../../../models/lote.model';
import { Etiqueta } from '../../../models/etiqueta.model';
import { LoteService } from '../../../services/service.index';

import swal from 'sweetalert2';

import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Empresa } from '../../../models/empresa.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-etiquetas-generar',
  templateUrl: './etiquetas-generar.component.html',
  styles: []
})
export class EtiquetasGenerarComponent implements OnInit {

  barra: boolean = true;
  addregisterspinner: Boolean = false;

  id_empresa_fc = new FormControl( null, Validators.required);
  tipo_fc = new FormControl( null, Validators.required );
  cantidad_fc = new FormControl( null, [Validators.required, Validators.min(1), Validators.max(40)] );
  
  empresas: Empresa[] = [];
  usuario_alta: Usuario;

  forma: FormGroup;
  matriz: Array<any> = [];

  etiquetas_vista: Etiqueta[] = [];

  loteSeleccionado: string;
  cantidadSeleccionada: number;

  defaulTipo: string = "barras";

  lotes: Array<Lote> = [];

  constructor(
    public _fb: FormBuilder,
    public _loteService: LoteService,
    public _usuarioService: UsuarioService
  ) {
    this.usuario_alta = JSON.parse(localStorage.getItem('usuario'));
   }

  ngOnInit() {
    this.forma = this._fb.group({
      cantidad: this.cantidad_fc,
      id_empresa: this.id_empresa_fc,
      tipo: this.tipo_fc
    });

    this._usuarioService.cargarEmpresas()
    .subscribe( (resp:any) => {
      this.empresas = resp.listaodempresas
    });

    this.cargarLotes();
  }
  
  getRequiredErrorMessage(field) {
    return this.forma.get(field).hasError('required') ? 'Este campo es requerido' :
            (this.forma.get(field).hasError('min') || this.forma.get(field).hasError('max'))? 'Se espera un mínimo de 1 y máximo de 40' : ''
  }

  cargarLotes(){    
    this._loteService.infolote()
      .subscribe( (resp:any) => {
         this.lotes = resp.lote;
         this.loteSeleccionado = this.lotes[0]._id;
         this.cantidadSeleccionada = this.lotes[0].cantidad;
         this.lotebyid( this.lotes[0]._id );
      });
  }

  lotebyid( id: string ){
    this._loteService.lotebyid( id )
    .subscribe( (resp:any) => {
      this.etiquetas_vista = resp.lote;
    });
  }

  cambioLote( id: string ){
    
    this.cantidadSeleccionada = 0;

    from(this.lotes)
        .pipe(
        filter(depo => depo._id == id)
        )
        .subscribe(val => {
          this.cantidadSeleccionada = val.cantidad;
          this.lotebyid( id );
        });
  }

  cambioTipo( valor: string ){
    
    if( valor == "barras"){
      this.barra = true;
      return
    }

    if( valor == "qr" ){
      this.barra = false;
      return
    }
  }

  ultimolote(){
    this._loteService.ultimolote()
      .subscribe( (resp:any) => {
        //  this.etiquetas_vista = [];
         this.etiquetas_vista = resp.lote;
      });
  };


  submitForma(){

      if ( this.forma.invalid ) {
        return;
      }
  
      this.addregisterspinner = true;

      this.matriz = []
  
      const lote = new Lote (
        this.forma.value.cantidad,
        this.forma.value.id_empresa,
        this.forma.value.tipo,
        this.usuario_alta._id
      );
  
      for (let i=1; i <= this.forma.value.cantidad; i++) {
          let lugarcito = new Etiqueta ();
          this.matriz.push(lugarcito);
      }
      
      this.matriz.unshift(lote);

      this._loteService.crearLote( this.matriz )
              .subscribe( resp => { 

                this.addregisterspinner = false;

                swal({
                  title: 'Etiquetas creadas',
                  text: 'Se han generado las etiquetas.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.forma.reset();
                this.forma.markAsPristine();
                this.forma.markAsUntouched();

                this.cargarLotes();
                this.ultimolote();

              },
                err => {
                console.log(err);
                this.addregisterspinner = false;
                swal({
                    title: 'Error al registrar lote',
                    text: 'Ocurrió un error mientras se procesaba la solicitud.',
                    type: 'error',
                    confirmButtonText: 'Ok'
                  });
            });
  }


  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Etiquetas para cajas</title>
          <style>
              body {
                width: 8.5in;
                margin: 0in .1875in;
                }
              @page{
                margin: 0px;
              }
              .etiqueta {
                border-radius: 7px;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
                width: 188px;
                height: 105px;
                margin: 5px;
                float: left;
                text-align: center;
                overflow: hidden;
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
