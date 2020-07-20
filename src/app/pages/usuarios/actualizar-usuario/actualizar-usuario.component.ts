import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, FormBuilder} from '@angular/forms';
import { UsuarioService } from '../../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styles: []
})
export class ActualizarUsuarioComponent implements OnInit {

  // usuario: Usuario = new Usuario('', '', '', '', '', '');
  // empresas: Empresa[] = [];

  // constructor(
  //   public _usuarioService: UsuarioService,
  //   public activatedRoute: ActivatedRoute
  // ) { 
  //   activatedRoute.params.subscribe( params => {

  //     let id = params['id'];
  //     this.cargarUsuario( id );

  //   });
  // }

  // cargarUsuario( id: string ) {
  //   this._usuarioService.cargarUsuario( id )
  //         .subscribe( resp => this.usuario = resp );
  // }

  // ngOnInit() {

  //   this._usuarioService.cargarEmpresas()
  //           .subscribe( (resp:any) => {
  //             this.empresas = resp.listaodempresas
  //           });
  // }

  // guardar( value: any){
  //   console.log('modificar', value);
  // }

  addregisterspinner: Boolean = false;

  forma: FormGroup;
  usuario: Usuario = new Usuario('','','','','','','','','','','','','','','','','','');
  empresas: any[] = [];
  mensaje: string = '';

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
    public route: Router,
    public fb : FormBuilder,
    public _usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute
  ) { 
    activatedRoute.params.subscribe( params => {

      let id = params['id'];
      this.cargarUsuario( id );

    });
  }


  ngOnInit() {
    this.general = this.fb.group({
      nombre : this.nombre_fc,
      apellido : this.apellido_fc,
      mail : this.mail_fc,
      empresa : this.empresa_fc,
      rol : this.rol_fc
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

  cargarUsuario( id: string ) {
  this._usuarioService.cargarUsuario( id )
        .subscribe( (resp:any) => {
          console.log(resp);
          this.usuario = resp;
        } );
  }

  cargarEmpresas() {

    this._usuarioService.cargarEmpresas()
              .subscribe( (resp: any) => {
                this.empresas = resp.listaodempresas;
              });
  }

  getRequiredErrorMessage(field) {
    return this.general.get(field).hasError('required') ? 'Este campo es requerido' :
            this.general.get(field).hasError('email') ? 'Ingrese un e-mail válido' : 
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
                          if( control.value == this.usuario.email){
                            resolve( null );
                          } else {
                            resolve( {'existMail': true} );
                          }
                        } else {
                          resolve( null );
                        }
                      }
                    )
          }, 700);
      });
  }

  confirmar(){
    console.log('confirmado')
  }
  
  registrarUsuario() {

    this.addregisterspinner = true;

    const usuario = {
      nombre: this.general.value.nombre,
      apellido: this.general.value.apellido,
      email: this.general.value.mail,
      id_empresa: this.general.value.empresa,
      role: this.general.value.rol,
      cargo: this.adicional.value.cargo,
      telefono: this.adicional.value.telefono,
      dni: this.adicional.value.dni,
      cuit: this.adicional.value.cuit,
      direccion: this.adicional.value.direccion,
      observaciones: this.adicional.value.observaciones,
      _id: this.usuario._id
    };

    this._usuarioService.actualizarUsr( usuario )
            .subscribe( resp => {

              this.addregisterspinner = false;
              swal({
                title: 'Actualización exitosa',
                text: 'Se ha creado un nuevo usuario.',
                type: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  this.route.navigate(['/usuarios/listar-usuarios']);
                }
              });

            },
              err => {
              console.log(err);
              this.addregisterspinner = false;
              swal({
                  title: 'Error al actualizar usuario',
                  text: 'Ocurrió un error mientras se procesaba la solicitud.',
                  type: 'error',
                  confirmButtonText: 'Ok'
                });

            });
  }

}
