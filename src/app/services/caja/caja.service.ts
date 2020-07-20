import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Caja } from '../../models/caja.model';
import { Contenido } from '../../models/contenido.model';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(
    public http: HttpClient
  ) { }

  agregarCaja( formulario: any ) {

    const URL = URL_SERVICIOS + '/caja';

    return this.http.post( URL , formulario );

  }

  agregarContenido( contenido: Contenido ) {

    const URL = URL_SERVICIOS + '/caja/contenido';

    return this.http.post( URL , contenido );

  }

  obtenerContenidoVista( id: string ) {

    const URL = URL_SERVICIOS + '/caja/contenido/' + id;

    return this.http.get( URL ).pipe(
      map( (resp:any) => resp.contenidos) );

  }

  obtenerTodosLosContenidos() {

    const URL = URL_SERVICIOS + '/caja/contenidos';

    return this.http.get( URL ).pipe(
      map((resp:any) => resp.contenidos));

  }

  eliminarContenido( id: string ) {

    const URL = URL_SERVICIOS + '/caja/contenido/' + id;

    return this.http.delete( URL ).pipe(
      map( (resp:any) => resp.contenido) );

  }

  obtenerCaja( id: string ) {

    const url = URL_SERVICIOS + '/caja/' + id; 
    
    return this.http.get( url );

  }

  obtenerCajaParaModal( id: string ) {

    const url = URL_SERVICIOS + '/caja/modaldeposito/' + id; 
    
    return this.http.get( url );

  }
  
  cargarCajas(){

    const url = URL_SERVICIOS + '/caja'; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.cajas) );

  }

  anularCaja( caja: Caja ){
    
    let url = URL_SERVICIOS + '/caja/anular/' + caja._id; 
    
    return this.http.put( url, caja );

  }

  posicionar( caja: any ){
    
    let url = URL_SERVICIOS + '/caja/posicionar/' + caja._id; 
    
    return this.http.put( url, caja );

  }

  desanularCaja( id: string ){

    let url = URL_SERVICIOS + '/caja/desanular/' + id; 
    
    return this.http.put( url, id );
  }

  cambiarNumero( intercambio: any ){

    let url = URL_SERVICIOS + '/caja/cambiarnumero/' + intercambio.id_caja; 
    
    return this.http.put( url, intercambio );
  }

  actualizarCaja( caja: any ) {

    let url = URL_SERVICIOS + '/caja/' + caja._id;

    return this.http.put( url, caja )

  }

}
