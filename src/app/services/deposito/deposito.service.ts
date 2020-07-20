import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  constructor(
    public http: HttpClient
  ) { }

  crearEstante( formulario: any ) {

    const URL = URL_SERVICIOS + '/deposito';

    return this.http.post( URL , formulario );

  }

  obtenerEstantes() {

    const url = URL_SERVICIOS + '/deposito'; 
    
    return this.http.get( url );

  }

  obtenerLugares( id: string ) {

    const url = URL_SERVICIOS + '/lugar/' + id;  
    
    return this.http.get( url );

  }

  obtenerLugaresVacios( id: string ) {

    const url = URL_SERVICIOS + '/lugar/vacio/' + id;  
    
    return this.http.get( url );

  }

  lugarEspecifico( id: string ) {

    const url = URL_SERVICIOS + '/lugar/especifico/' + id;  
    
    return this.http.get( url );

  }

  liberarLugar( id: string ){

    let url = URL_SERVICIOS + '/lugar/' + id; 
    
    return this.http.put( url, id );
  }

  crearEstado( formulario: any){

    const URL = URL_SERVICIOS + '/estados';

    return this.http.post( URL , formulario );
  }

  intercambiarLugares( arrLugares: any ) {

    const URL = URL_SERVICIOS + '/deposito/intercambiar';

    return this.http.put( URL , arrLugares );

  }


}
