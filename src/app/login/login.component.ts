import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  form_login: FormGroup ;
  email: string;
  recordarme: boolean = false;

  constructor( 
    public _usuarioService: UsuarioService,
    public router: Router ) { }

  ngOnInit() {
    init_plugins();

    this.form_login = new FormGroup({
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required ),
      recordar: new FormControl( false )
    });

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recordarme = true;
    }
  }

  ingresar() {

    if ( this.form_login.invalid ) {
      return;
    }

    const usuario = new Usuario(null, null, this.form_login.value.correo, null, this.form_login.value.password, null);

    this._usuarioService.login(usuario, this.form_login.value.recordar)
                  .subscribe( resp => this.router.navigate(['/dashboard']));

  }

}
