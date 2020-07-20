import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Etiqueta } from '../../models/etiqueta.model';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerEtiqueta( id: string) {
    
    let url = URL_SERVICIOS + '/etiqueta/' + id; 
    
    return this.http.get( url ).pipe(
                    map( (resp:any) => resp.etiqueta ));

  }

  existeEtiqueta( codigo: string ) {

    const URL = URL_SERVICIOS + '/etiqueta/existetiqueta/' + codigo;

    return this.http.get( URL );
  }

  existeEtiquetaMov( codigo: string ) {

    const URL = URL_SERVICIOS + '/etiqueta/existetiquetamov/' + codigo;

    return this.http.get( URL );
  }


  etiquetaOcupada( codigo: string ) {

    const URL = URL_SERVICIOS + '/etiqueta/etiquetaocupada/' + codigo;

    return this.http.get( URL );
  }

  obtenerEtiquetas() {
    
    let url = URL_SERVICIOS + '/etiqueta'; 
    
    return this.http.get( url ).pipe(
                    map( (resp:any) => resp.etiquetas ));

  }

  obtenerEtiquetaLote( id: string) {
    
    let url = URL_SERVICIOS + '/etiqueta/lote/' + id; 
    
    return this.http.get( url ).pipe(
                    map( (resp:any) => resp.etiqueta ));

  }

  anularEtiqueta( etiqueta: Etiqueta ){
    
    let url = URL_SERVICIOS + '/etiqueta/anular/' + etiqueta._id; 
    
    return this.http.put( url, etiqueta );

  }

  desanularEtiqueta( id: string ){

    let url = URL_SERVICIOS + '/etiqueta/desanular/' + id; 
    
    return this.http.put( url, id );
  }

}
