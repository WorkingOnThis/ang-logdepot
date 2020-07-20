import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';
import { Movimiento } from '../../../models/movimiento.model';
import { Mov_renglon } from '../../../models/mov_renglon.model';
import { MatDialog } from '@angular/material';
import { DialogCodigo, markFormGroupTouched } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { EtiquetaService, MovimientosService } from '../../../services/service.index';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { DialogContenido } from '../../deposito/posicionar-caja/button-posicion/button-posicion.component';

@Component({
  selector: 'app-movimientos-generar',
  templateUrl: './movimientos-generar.component.html',
  styles: []
})
export class MovimientosGenerarComponent implements OnInit {

  usuario_creador: Usuario;

  addregisterspinner: Boolean = false;

  set_move_type: string = '';
  habilitar_accion: Boolean = false;
  
  set_type: string = '';
  habilitar_unidad: Boolean = false;

  renglon_estado = []; // ME SIRVE PARA IR AGREGANDO UN ESTADO Y ESTABLECER UN COLOR DE ADVERTENCIA AL USUARIO.
  codigo: string = ''; // 

  array_renglones_salida: Array<Mov_renglon> = [];
  array_renglones_entrada: Array<Mov_renglon> = [];

  array_S_C: Array<Movimiento> = [];
  array_S_D: Array<Movimiento> = [];
  array_E_C_0: Array<Movimiento> = [];
  array_E_C_1: Array<Movimiento> = [];
  array_E_D: Array<Movimiento> = [];

  // MODELO MOVIMIENTO.
  // codigo
  // accion
  // tipo_prod
  // asociacion
  // observacion
  // id_usuario_alta
  // fecha_alta
  // id_usuario_baja
  // fecha_baja
  // _id

  form_mov: FormGroup;  

  mov_codigo_fc = new FormControl( null, [Validators.required], [this.labelExist.bind( this )]);
  mov_accion_fc = new FormControl( null, [Validators.required]);
  mov_tipo_prod_fc = new FormControl( null, [Validators.required]);
  mov_asociacion_fc = new FormControl( null, []);
  mov_observacion_fc = new FormControl( null, []);


  constructor(
    public dialog: MatDialog,
    public _etiquetaService: EtiquetaService,
    public _movimientoService: MovimientosService
  ) { }

  ngOnInit() {

    this.usuario_creador = JSON.parse(localStorage.getItem('usuario'));

    this.form_mov = new FormGroup({
      mov_codigo: this.mov_codigo_fc,
      mov_accion: this.mov_accion_fc,
      mov_tipo_prod: this.mov_tipo_prod_fc,
      mov_asociacion: this.mov_asociacion_fc,
      mov_observacion: this.mov_observacion_fc,
    });

  }

  private labelTimeout;

  labelExist(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    clearTimeout(this.labelTimeout);
    return new Promise((resolve, reject) => {
        this.labelTimeout = setTimeout(() => {
            this._etiquetaService.existeEtiquetaMov(control.value)
                .subscribe(
                    (response: any) => { 
                      if(response.mensaje == 'La etiqueta no existe'){
                        this.set_move_type = "";
                        this.set_type = "";
                        this.habilitar_accion = false;
                        this.habilitar_unidad = false;
                        resolve( {'existLabel': true} )
                      } else {
                        if(response.etiqueta.tipo == 'Caja'){
                          if(response.etiqueta.estado == 0){
                            if(response.etiqueta.accion == null){
                              this.set_move_type = "1";
                            } else if(response.etiqueta.accion == 0){
                              this.set_move_type = "1";
                            } else {
                              this.set_move_type = "0";
                            }
                          } else {
                            if(response.etiqueta.accion == 0){
                              this.set_move_type = "1";
                            } else {
                              this.set_move_type = "0";
                            }
                          } 
                        }

                        if(response.etiqueta.tipo == 'Documento'){
                          if(response.etiqueta.estado == 0){
                            if(response.etiqueta.accion == null){
                              this.set_move_type = "0";
                            } else if(response.etiqueta.accion == 0){
                              this.set_move_type = "1";
                            } else {
                              this.set_move_type = "0";
                            }
                          } else {
                            if(response.etiqueta.accion == 0){
                              this.set_move_type = "1";
                            } else {
                              this.set_move_type = "0";
                            }
                          }
                        }

                        this.set_type = response.etiqueta.tipo;
                        this.habilitar_accion = true;
                        this.habilitar_unidad = true;
                        resolve( null )
                      }
                    }
                  )
        }, 400);
    });
  }

  /// --------- Funcion de validacion ------------ ///
  getRequiredErrorMessage(field) {
    return this.form_mov.get(field).hasError('required') ? 'Este campo es requerido' :
           this.form_mov.get(field).hasError('existLabel') ? 'Código inválido' : '';

  }

  
  agregarRenglon( codigo ){

    if( this.form_mov.invalid ){
      markFormGroupTouched(this.form_mov);
      return;
    }

    this.renglon_estado = [];

    let renglon = new Movimiento(
      this.form_mov.value.mov_codigo,
      Number(this.form_mov.value.mov_accion),
      this.form_mov.value.mov_tipo_prod,
      this.form_mov.value.mov_asociacion,
      this.form_mov.value.mov_observacion,
      this.usuario_creador._id,
      null,
      null,
      null,
      null
    );

    this._etiquetaService.obtenerEtiquetaLote( codigo )
      .subscribe( (resp:any) => {
        
        if (!(resp.fecha_baja_lote === null && resp.fecha_baja === null)){
          this.renglon_estado.push('lote o etiqueta anulados');
        }
        
        // Existencia de duplicados
        let existeSalida = this.array_renglones_salida.find( ob => ob['movimiento'].codigo == resp._id ? true : false );
        let existeEntrada = this.array_renglones_entrada.find( ob => ob['movimiento'].codigo == resp._id ? true : false );

        if(existeSalida || existeEntrada ){

          swal({
            title: 'Error',
            text: 'El código ingresado ya se encuentra en la tabla de pendientes.',
            type: 'error',
            confirmButtonText: 'Ok'
          })

          return
        }
        // FIN existencia de duplicados

        let renglon_intermedio = new Mov_renglon(
          this.renglon_estado,
          renglon,
          resp.estado,
          resp.nom_empresa,
          resp.num_etiqueta,
          resp.numero
        );

        if( renglon.accion == 0){
          this.array_renglones_salida.push(renglon_intermedio);
        } else {
          this.array_renglones_entrada.push(renglon_intermedio);
        }

        // console.log(this.array_renglones_entrada);
        // console.log(this.array_renglones_salida);

        this.codigo = '';
        this.set_type = '';
        this.habilitar_accion = false;
        this.habilitar_unidad = false;
        this.set_move_type = undefined;
        this.form_mov.reset();
        this.form_mov.markAsPristine();
        this.form_mov.markAsUntouched();
    });

  }

  eliminarContenido(tipo: string, indice: number){

    if( tipo == "salida"){
      this.array_renglones_salida.splice( indice, 1 );
    }
    
    if( tipo == "entrada") {
      this.array_renglones_entrada.splice( indice, 1 );
    }

  }
  
  /// --------- Modal para obtener codigo ------------ ///
  openDialogCodigo(): void {
    const dialogRef = this.dialog.open(DialogCodigo, {
      width: '400px',
      data: {codigo: this.codigo}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result != undefined ){
        this.codigo = result;
      }
    });
  }

  insertarRegistros(){

    var errorSalida = false;
    var errorEntrada = false;

    this.array_S_C = [];
    this.array_S_D = [];
    this.array_E_C_0 = [];
    this.array_E_C_1 = [];
    this.array_E_D = [];

    for (let entrada in this.array_renglones_entrada) {
      if((this.array_renglones_entrada[entrada].estado).length !== 0){
        var errorEntrada = true;
      }
    }

    for (let salida in this.array_renglones_salida) {
      if((this.array_renglones_salida[salida].estado).length !== 0){
        var errorEntrada = true;
      }
    }

    if( errorSalida || errorEntrada ){

      swal({
        title: 'Error',
        text: 'Para continuar debe solucionar los problemas en los codigos marcados en rojo.',
        type: 'error',
        confirmButtonText: 'Ok'
      })
      return
      
    }


    for (let entrada in this.array_renglones_entrada) {
      if(this.array_renglones_entrada[entrada].movimiento.tipo_prod == 'Caja'){
        
        if(this.array_renglones_entrada[entrada].etiq == 0){
          this.array_E_C_0.push(this.array_renglones_entrada[entrada].movimiento);
        } else {
          this.array_E_C_1.push(this.array_renglones_entrada[entrada].movimiento);
        }

      } else {
        this.array_E_D.push(this.array_renglones_entrada[entrada].movimiento)
      }
    }

    for (let salida in this.array_renglones_salida) {
      if(this.array_renglones_salida[salida].movimiento.tipo_prod == 'Caja'){

          this.array_S_C.push(this.array_renglones_salida[salida].movimiento);

      } else {
        this.array_S_D.push(this.array_renglones_salida[salida].movimiento)
      }
    }

    this.addregisterspinner = true;
    // ENTRADA 

      // CAJA
        // ETIQUETA EN 0
          // debo hacer insert del movimiento - update de la etiqueta. 
          if( this.array_E_C_0.length != 0 ){

            this._movimientoService.agregarMovimientoECE0( this.array_E_C_0 )
            .subscribe( resp => {
              this.addregisterspinner = false;

              swal({
                title: 'Registro exitoso',
                text: 'Se han insertado los movimientos en la tabla.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                title: 'Error al registrar movimiento',
                text: 'Ocurrió un error mientras se procesaba la solicitud.',
                type: 'error',
                confirmButtonText: 'Ok'
              });

            });

          }

        // ETIQUETA EN 1
          // debo hacer insert del movimiento - update del estado de la caja
          if( this.array_E_C_1.length != 0 ){

            this._movimientoService.agregarMovimientoECE1( this.array_E_C_1 )
            .subscribe( resp => {
              this.addregisterspinner = false;

              swal({
                title: 'Registro exitoso',
                text: 'Se han insertado los movimientos en la tabla.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                title: 'Error al registrar movimiento',
                text: 'Ocurrió un error mientras se procesaba la solicitud.',
                type: 'error',
                confirmButtonText: 'Ok'
              });

            });

          }

      // DOCUMENTO
          // debo hacer insert del movimiento - update del estado del documento 
          if( this.array_E_D.length != 0 ){

            this._movimientoService.agregarMovimientoED( this.array_E_D )
            .subscribe( resp => {
              this.addregisterspinner = false;

              swal({
                title: 'Registro exitoso',
                text: 'Se han insertado los movimientos en la tabla.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                title: 'Error al registrar movimiento',
                text: 'Ocurrió un error mientras se procesaba la solicitud.',
                type: 'error',
                confirmButtonText: 'Ok'
              });

            });

          }

    // SALIDA

      // CAJA
        // debo hacer insert del movimiento - update del estado de la caja.
        if( this.array_S_C.length != 0 ){

          this._movimientoService.agregarMovimientoSC( this.array_S_C )
          .subscribe( resp => {
            this.addregisterspinner = false;

            swal({
              title: 'Registro exitoso',
              text: 'Se han insertado los movimientos en la tabla.',
              type: 'success',
              confirmButtonText: 'Ok'
            })

          },
            err => {
            console.log(err);
            this.addregisterspinner = false;
            swal({
              title: 'Error al registrar movimiento',
              text: 'Ocurrió un error mientras se procesaba la solicitud.',
              type: 'error',
              confirmButtonText: 'Ok'
            });

          });

        }

      // DOCUMENTO
        // debo hacer insert del movimiento - update del estado del documento - update de la etiqueta en 1. 
        if( this.array_S_D.length != 0 ){

          this._movimientoService.agregarMovimientoSD( this.array_S_D )
          .subscribe( resp => {
            this.addregisterspinner = false;

            swal({
              title: 'Registro exitoso',
              text: 'Se han insertado los movimientos en la tabla.',
              type: 'success',
              confirmButtonText: 'Ok'
            })

          },
            err => {
            console.log(err);
            this.addregisterspinner = false;
            swal({
              title: 'Error al registrar movimiento',
              text: 'Ocurrió un error mientras se procesaba la solicitud.',
              type: 'error',
              confirmButtonText: 'Ok'
            });

          });

        }

        this.codigo = '';
        this.form_mov.reset();
        this.form_mov.markAsPristine();
        this.form_mov.markAsUntouched();
        this.array_S_C = [];
        this.array_S_D = [];
        this.array_E_C_0 = [];
        this.array_E_C_1 = [];
        this.array_E_D = [];
        this.array_renglones_salida = [];
        this.array_renglones_entrada = [];

  }

  vercontenidos( id: string, nom_empresa: string ){

    this.dialog.open(DialogContenido, {
      height: '550px',
      width: '1200px',
      panelClass: 'dialog-contenido',
      data: {codigo: id, empresa: nom_empresa}
    });

  }

}
