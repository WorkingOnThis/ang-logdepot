import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmpresaService } from '../../../services/service.index';
import { Empresa } from '../../../models/empresa.model';
import { ModalGenericoService } from 'src/app/components/modal-generico/modal-generico.service';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';

// SE DEBE AGRUPAR CADA BLOQUE DEL FORMULARIO: GENERAL // JURIDICO // ADICIONAL
// CONTROL DE ERRORES EN TODO LOS CAMPOS
// ALERTA DE ERROR DE FORMA GENERAL

@Component({
  selector: 'app-agregar-empresa',
  templateUrl: './agregar-empresa.component.html',
  styles: []
})
export class AgregarEmpresaComponent implements OnInit {

  // forma: FormGroup ;
    addregisterspinner: Boolean = false;
    usuario_alta: Usuario;

    general: FormGroup ;
    juridica: FormGroup ;
    contable: FormGroup ;

  // date = new FormControl(new Date());

    mensaje: string = '';

    nombre_fc = new FormControl( null, Validators.required, this.nameAvailability.bind( this ) );
    razon_social_fc = new FormControl();
    direccion_fc = new FormControl( null, Validators.required );
    cod_localidad_fc = new FormControl();
    telefono_fc = new FormControl( null, Validators.required );
    fax_fc = new FormControl();
    mail_fc = new FormControl( null, [Validators.required, Validators.email], this.emailAvailability.bind( this ));
    sitioWeb_fc = new FormControl();
    responsable_fc = new FormControl( null, Validators.required );
    cuit_fc = new FormControl();
    condicion_iva_fc = new FormControl();
    dgr_fc = new FormControl();
    municipalidad_fc = new FormControl();
    tipo_factura_fc = new FormControl();
    costo_caja_fc = new FormControl();
    costo_mensual_fc = new FormControl();
    forma_pago_fc = new FormControl();
    // direccion_envio_fc = new FormControl();
    observaciones_fc = new FormControl();

  
  constructor(
    public _empresaService: EmpresaService,
    public _modalGenericoService: ModalGenericoService
  ) {
    this.usuario_alta = JSON.parse(localStorage.getItem('usuario'));
  }

  ngOnInit() {

    this.general = new FormGroup({
      nombre: this.nombre_fc, 
      razon_social: this.razon_social_fc, 
      direccion: this.direccion_fc, 
      cod_localidad: this.cod_localidad_fc, 
      telefono: this.telefono_fc, 
      fax: this.fax_fc, 
      mail: this.mail_fc, 
      sitioWeb: this.sitioWeb_fc, 
      responsable: this.responsable_fc 
    });
    
    this.juridica = new FormGroup({
      cuit : this.cuit_fc,
      condicion_iva : this.condicion_iva_fc,
      dgr : this.dgr_fc,
      municipalidad : this.municipalidad_fc
    });
    
    this.contable = new FormGroup({
      tipo_factura : this.tipo_factura_fc,
      costo_caja : this.costo_caja_fc,
      costo_mensual : this.costo_mensual_fc,
      forma_pago : this.forma_pago_fc,
      // direccion_envio : this.direccion_envio_fc,
      observaciones : this.observaciones_fc  
    });  
  }

  getRequiredErrorMessage(field) {
    return this.general.get(field).hasError('required') ? 'Este campo es requerido' : 
            this.general.get(field).hasError('existName') ? 'Ya existe una empresa con este nombre' : 
            this.general.get(field).hasError('email') ? 'Ingrese un e-mail válido' : 
            this.general.get(field).hasError('existMail') ? 'Ya existe una empresa con este e-mail' : '';
            // this.general.get(field).hasError('existMail') ? 'Ya existe una empresa con este e-mail' : '';
  }


  private nameTimeout;

  nameAvailability(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    clearTimeout(this.nameTimeout);
    return new Promise((resolve, reject) => {
        this.nameTimeout = setTimeout(() => {
            this._empresaService.buscarNombre(control.value)
                .subscribe(
                    (response: any) => { 
                      if(response.mensaje == 'La empresa ya existe'){
                        resolve( {'existName': true} )
                      } else {
                        resolve( null )
                      }
                    }
                  )
        }, 700);
    });
  }


  private emailTimeout;

  emailAvailability(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    clearTimeout(this.emailTimeout);
    return new Promise((resolve, reject) => {
        this.emailTimeout = setTimeout(() => {
            this._empresaService.buscarEmail(control.value)
                .subscribe(
                    (response: any) => { 
                      if(response.mensaje == 'La empresa ya existe'){
                        resolve( {'existMail': true} )
                      } else {
                        resolve( null )
                      }
                    }
                  )
        }, 700);
    });
  }

  prueba(){
    console.log(this.general.status);
  }


  selectNext(index){
    index.selectedIndex += 1;
  }

  selectPrev(index){
    index.selectedIndex -= 1;
  }

  registrarEmpresa() {

    this.addregisterspinner = true;

    const empresa = new Empresa(
      this.general.value.nombre,
      this.general.value.razon_social,
      this.general.value.direccion,
      this.general.value.telefono,
      this.general.value.fax,
      this.juridica.value.cuit,
      this.juridica.value.condicion_iva,
      this.juridica.value.dgr,
      this.juridica.value.municipalidad,
      this.general.value.mail,
      this.general.value.sitioWeb,
      this.general.value.cod_localidad,
      this.contable.value.observaciones,
      this.general.value.responsable,
      this.contable.value.forma_pago,
      this.contable.value.tipo_factura,
      this.contable.value.costo_caja,
      this.contable.value.costo_mensual,
      null,
      null,
      this.usuario_alta._id,    
      null,
      null,
      null,
      null
    );

    this._empresaService.crearEmpresa( empresa )
            .subscribe( resp => {

              this.addregisterspinner = false;
              swal({
                title: 'Registro exitoso',
                text: 'Se ha ingresado una nueva empresa.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

              this.general.reset();
              this.general.markAsPristine();
              this.general.markAsUntouched();

              this.juridica.reset();
              this.juridica.markAsPristine();
              this.juridica.markAsUntouched();

              this.contable.reset();
              this.contable.markAsPristine();
              this.contable.markAsUntouched();

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                  title: 'Error al registrar usuario',
                  text: 'Ocurrió un error mientras se procesaba la solicitud.',
                  type: 'error',
                  confirmButtonText: 'Ok'
                });

            });
  }


}