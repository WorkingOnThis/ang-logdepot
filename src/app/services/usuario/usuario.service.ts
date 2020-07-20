import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

import swal from 'sweetalert2';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    ) {
    this.cargarStorage();
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = []

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  login( usuario: Usuario, recordar: boolean = false  ) {

    const URL = URL_SERVICIOS + '/login';

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post( URL , usuario).pipe(
                map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                  return true;
                }),
                catchError( err => {
                  swal( 'Error en el login', err.error.mensaje, 'error' );
                  return throwError(err);
                }));

  }

  crearUsuario( usuario: Usuario ) {

    const URL = URL_SERVICIOS + '/usuario';

    return this.http.post( URL , usuario );

  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario ).pipe(
                map( (resp: any) => {

                  let usuarioDB: Usuario = resp.usuario;

                  this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
                  alert('Usuario actualizado: ' + usuario.nombre);

                  return true;
                }));

  }

  actualizarUsr( usuario: any ) {

    let url = URL_SERVICIOS + '/usuario/actualizarusr/' + usuario._id;

    return this.http.put( url, usuario )

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
          .then( (resp: any) => {

            this.usuario.img = resp.usuarioActualizado.img;
            this.guardarStorage( id, this.token, this.usuario, this.menu );

          })
          .catch( resp => {
            console.log( resp );
          });

  }

  cargarUsuarios() {
    
    let url = URL_SERVICIOS + '/usuario/'; 
    
    return this.http.get( url );

  }

  cargarUsuario( id: string) {
    
    let url = URL_SERVICIOS + '/usuario/' + id; 
    
    return this.http.get( url ).pipe(
                    map( (resp:any) => resp.usuario));

  }

  cargarEmpresas() {
    
    let url = URL_SERVICIOS + '/usuario/listadoempresas'; 
    
    return this.http.get( url );

  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    
    return this.http.delete( url ).pipe(
                    map( resp =>{
                      return resp;
                    }))
  }

  usuariosPorEmpresa( id: string ){

    let url = URL_SERVICIOS + '/usuario/usuariosporempresa/' + id; 
    
    return this.http.get( url );
  }

  anularUsuario( usuario: Usuario ){

    let url = URL_SERVICIOS + '/usuario/anular/' + usuario._id; 
    
    return this.http.put( url, usuario );
  }

  desanularUsuario( id: string ){

    let url = URL_SERVICIOS + '/usuario/desanular/' + id; 
    
    return this.http.put( url, id );
  }

  buscarEmail( email: string ) {

    const URL = URL_SERVICIOS + '/usuario/existemail/' + email;

    return this.http.get( URL );
  }

}
