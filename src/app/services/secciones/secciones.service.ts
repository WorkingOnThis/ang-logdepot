import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeccionesService {

  constructor(
    public http: HttpClient
  ) { }

  crearArea( formulario: any ) {

    const URL = URL_SERVICIOS + '/secciones';

    return this.http.post( URL , formulario );

  }

  obtenerAreas( id: string ) {

    const url = URL_SERVICIOS + '/secciones/' + id; 
    
    return this.http.get( url );

  }

  obtenerAreaTipos( id: string ) {

    const url = URL_SERVICIOS + '/secciones/areaytipos/' + id; 
    
    return this.http.get( url );

  }


  obtenerAreasPorDocumento( id: string ) {

    const url = URL_SERVICIOS + '/secciones/documento/' + id; 
    
    return this.http.get( url );

  }

  modificarSeccion( modificar: any ) {

    const url = URL_SERVICIOS + '/secciones/modificarseccion/' + modificar[0]._id; 
    return this.http.put( url, modificar );

  }

  modificarAgregarSeccion( modificar: any ) {

    const url = URL_SERVICIOS + '/secciones/modificaragregarseccion/' + modificar[0][0]._id; 
    
    return this.http.put( url, modificar );

  }

}
