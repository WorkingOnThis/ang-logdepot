import { Injectable } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  usuario: Usuario;
  empresa: Empresa;
  token: string;

  constructor(
    public http: HttpClient
  ) { }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  crearEmpresa( empresa: Empresa ) {

    const URL = URL_SERVICIOS + '/empresa';

    return this.http.post( URL , empresa );

  }

  buscarEmail( email: string ) {

    const URL = URL_SERVICIOS + '/empresa/existemail/' + email;

    return this.http.get( URL );
  }

  buscarNombre( name: string ) {

    const URL = URL_SERVICIOS + '/empresa/existename/' + name;

    return this.http.get( URL );
  }

  cargarEmpresas() {
    
    let url = URL_SERVICIOS + '/empresa/'; 
    
    return this.http.get( url );

  }

  cargarEmpresa( id: string) {
    
    let url = URL_SERVICIOS + '/empresa/' + id; 
    
    return this.http.get( url ).pipe(
                    map( (resp:any) => resp.empresa));

  }

  borrarEmpresa( id: string ) {
    let url = URL_SERVICIOS + '/empresa/' + id;
    url += '?token=' + this.token;
    
    return this.http.delete( url ).pipe(
                    map( resp =>{
                      alert('empresa borrada');
                      return true;
                    }))
  }

  anularEmpresa( empresa: Empresa ){

    let url = URL_SERVICIOS + '/empresa/anular/' + empresa._id; 
    
    return this.http.put( url, empresa );
  }

  desanularEmpresa( id: string ){

    let url = URL_SERVICIOS + '/empresa/desanular/' + id; 
    
    return this.http.put( url, id );
  }

  actualizarEmp( empresa: any ) {

    let url = URL_SERVICIOS + '/empresa/actualizaremp/' + empresa._id;

    return this.http.put( url, empresa )

  }
  
}
