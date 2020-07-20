import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, FormBuilder} from '@angular/forms';
import { UsuarioService } from '../../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';

import { Observable} from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styles: []
})
export class AgregarUsuarioComponent implements OnInit {

  addregisterspinner: Boolean = false;

  forma: FormGroup ;
  empresas: any[] = [];
  mensaje: string = '';
  usuario_alta: Usuario;

  general: FormGroup ;
  adicional: FormGroup ;

  // General
  nombre_fc = new FormControl( null, Validators.required);
  apellido_fc = new FormControl( null, Validators.required );
  mail_fc = new FormControl( null, [Validators.required, Validators.email], this.emailAvailability.bind( this ));
  empresa_fc = new FormControl( null, Validators.required );
  password_fc = new FormControl( null, [Validators.required, Validators.minLength(6)] );
  password2_fc = new FormControl( null, Validators.required );
  rol_fc = new FormControl( null, Validators.required );

  // Adicional
  cargo_fc = new FormControl();
  dni_fc = new FormControl();
  telefono_fc = new FormControl();
  direccion_fc = new FormControl();
  cuit_fc = new FormControl();
  observaciones_fc = new FormControl();

  // checked = dni.value;
  // checkedNew = checked.replace(/\./g, "");

  constructor(
    public fb : FormBuilder,
    public _usuarioService: UsuarioService
  ) { 
    this.usuario_alta = JSON.parse(localStorage.getItem('usuario'));
  }


  ngOnInit() {
    this.general = this.fb.group({
      nombre : this.nombre_fc,
      apellido : this.apellido_fc,
      mail : this.mail_fc,
      empresa : this.empresa_fc,
      password : this.password_fc,
      password2 : this.password2_fc,
      rol : this.rol_fc
    },{
      validator: this.passwordMatchValidator
    });
    
    this.adicional = new FormGroup({
      cargo : this.cargo_fc,
      dni : this.dni_fc,
      telefono : this.telefono_fc,
      direccion : this.direccion_fc,
      cuit : this.cuit_fc,
      observaciones : this.observaciones_fc
    });

    this.cargarEmpresas();

  }

  cargarEmpresas() {

    this._usuarioService.cargarEmpresas()
              .subscribe( (resp: any) => {
                this.empresas = resp.listaodempresas;
              });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('password2').value;
    if (password !== confirmPassword && confirmPassword !== password) {
      control.get('password2').setErrors({ 'NoPassswordMatch': true });
    } else {
    //Esta validacion me elimina todos los errores. Deberia solo eliminar NoPassword...
      control.get('password2').setErrors(null);
    }
  }

  getRequiredErrorMessage(field) {
    return this.general.get(field).hasError('required') ? 'Este campo es requerido' :
            this.general.get(field).hasError('email') ? 'Ingrese un e-mail válido' : 
            this.general.get(field).hasError('minlength') ? 'Se espera un mínimo de 8 caracteres' : 
            this.general.get(field).hasError('NoPassswordMatch') ? 'Las contraseñas no coinciden' : 
            this.general.get(field).hasError('existMail') ? 'Ya existe una empresa con este e-mail' : '';
  }

  selectNext(index){
    index.selectedIndex += 1;
  }

  selectPrev(index){
    index.selectedIndex -= 1;
  }

  private emailTimeout;

  emailAvailability(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
      clearTimeout(this.emailTimeout);
      return new Promise((resolve, reject) => {
          this.emailTimeout = setTimeout(() => {
              this._usuarioService.buscarEmail(control.value)
                  .subscribe(
                      (response: any) => { 
                        if(response.mensaje == 'El usuario ya existe'){
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

  registrarUsuario() {

    // La validacion no es necesaria. Ya que de ser invalido no habria podido llegar a este punto
    // if ( this.general.invalid ) {
    //   return;
    // }

    this.addregisterspinner = true;

    const usuario = new Usuario(
      this.general.value.nombre,
      this.general.value.apellido,
      this.general.value.mail,
      this.general.value.empresa,
      this.general.value.password,
      this.general.value.rol,
      null,
      this.usuario_alta._id,
      null,
      this.adicional.value.cargo,
      this.adicional.value.telefono,
      this.adicional.value.dni,
      this.adicional.value.cuit,
      this.adicional.value.direccion,
      this.adicional.value.observaciones,
      null,
      null,
      null
    );

    this._usuarioService.crearUsuario( usuario )
            .subscribe( resp => {

              this.addregisterspinner = false;
              swal({
                title: 'Registro exitoso',
                text: 'Se ha creado un nuevo usuario.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

              this.general.reset();
              this.general.markAsPristine();
              this.general.markAsUntouched();
              this.adicional.reset();
              this.adicional.markAsPristine();
              this.adicional.markAsUntouched();
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
