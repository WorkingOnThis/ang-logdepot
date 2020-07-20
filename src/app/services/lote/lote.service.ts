import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Lote } from '../../models/lote.model';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(
    public http: HttpClient
  ) { }

  crearLote( formulario: any ) {
    
    const URL = URL_SERVICIOS + '/lote';

    return this.http.post( URL , formulario );
    
  }

  ultimolote( ) {
    
    let url = URL_SERVICIOS + '/lote/'; 
    
    return this.http.get( url );
    
  }

  infolote( ) {
    
    let url = URL_SERVICIOS + '/lote/infolote'; 
    
    return this.http.get( url );
    
  }

  lotebyid( id: string ) {
    
    let url = URL_SERVICIOS + '/lote/' + id; 
    
    return this.http.get( url );
    
  }

  obtenerLotes() {
    
    let url = URL_SERVICIOS + '/lote/tabla'; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.lote) );;
    
  }

  obtenerLote( id: string ) {

    const url = URL_SERVICIOS + '/lote/tabla' + id; 
    
    return this.http.get( url );

  }

  anularLote( lote: Lote ){
    
    let url = URL_SERVICIOS + '/lote/anular/' + lote._id; 
    
    return this.http.put( url, lote );

  }

  desanularLote( id: string ){

    let url = URL_SERVICIOS + '/lote/desanular/' + id; 
    
    return this.http.put( url, id );
  }

}
