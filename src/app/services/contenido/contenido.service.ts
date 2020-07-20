import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerContenidos() {

    const URL = URL_SERVICIOS + '/contenido';

    return this.http.get( URL ).pipe(
      map((resp:any) => resp.contenidos));

  }

  obtenerContenido( id: string ) {

    const URL = URL_SERVICIOS + '/contenido/individuales/' + id;

    return this.http.get( URL ).pipe(
      map( (resp:any) => resp.contenidos) );

  }
  
  obtenerCajasSecciones( id: string ) {

    const URL = URL_SERVICIOS + '/contenido/cajasysecciones/' + id;

    return this.http.get( URL );

  }

  importarContenido( contenido: any ) {

    const URL = URL_SERVICIOS + '/contenido/importarcontenidos/';

    return this.http.post( URL, contenido );

  }

}
