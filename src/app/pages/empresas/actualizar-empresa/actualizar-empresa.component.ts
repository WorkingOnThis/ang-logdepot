import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmpresaService } from 'src/app/services/service.index';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-empresa',
  templateUrl: './actualizar-empresa.component.html',
  styles: []
})
export class ActualizarEmpresaComponent implements OnInit {

  // forma: FormGroup ;
  addregisterspinner: Boolean = false;
  empresa: Empresa = new Empresa(null,null,null,null,null,null,null,
                                null,null,null,null,null,null,null,
                                null,null,null,null,null,null,null,
                                null,null,null,null);
  general: FormGroup;
  juridica: FormGroup;
  contable: FormGroup;

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
    public activatedRoute: ActivatedRoute,
    public route: Router
  ) {

    activatedRoute.params.subscribe( params => {

      let id = params['id'];
      this.cargarEmpresa( id );

    });

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

  cargarEmpresa( id: string ) {
    this._empresaService.cargarEmpresa( id )
          .subscribe( (resp:any) => {
            console.log(resp);
            this.empresa = resp;
          } );
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
                      if( control.value == this.empresa.nombre){
                        resolve( null );
                      } else {
                        resolve( {'existName': true} );
                      }
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
                      if( control.value == this.empresa.mail){
                        resolve( null );
                      } else {
                        resolve( {'existMail': true} );
                      }
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

  actualizarEmpresa() {

    this.addregisterspinner = true;

    const empresa = {
      nombre : this.general.value.nombre,
      razon_social : this.general.value.razon_social,
      direccion : this.general.value.direccion,
      telefono : this.general.value.telefono,
      fax : this.general.value.fax,
      cuit : this.juridica.value.cuit,
      condicion_iva : this.juridica.value.condicion_iva,
      dgr : this.juridica.value.dgr,
      municipalidad : this.juridica.value.municipalidad,
      mail : this.general.value.mail,
      sitioWeb : this.general.value.sitioWeb,
      cod_localidad : this.general.value.cod_localidad,
      observaciones : this.contable.value.observaciones,
      responsable : this.general.value.responsable,
      forma_pago : this.contable.value.forma_pago,
      tipo_factura : this.contable.value.tipo_factura,
      costo_caja : this.contable.value.costo_caja,
      costo_mensual : this.contable.value.costo_mensual,
      _id : this.empresa._id
    };

    this._empresaService.actualizarEmp( empresa )
            .subscribe( resp => {

              this.addregisterspinner = false;
              swal({
                title: 'Actualización exitosa',
                text: 'Se ha actualizado la empresa seleccionada.',
                type: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  this.route.navigate(['/empresas/listar-empresas']);
                }
              });

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                  title: 'Error al actualizar empresa',
                  text: 'Ocurrió un error mientras se procesaba la solicitud.',
                  type: 'error',
                  confirmButtonText: 'Ok'
                });

            });
  }
}
