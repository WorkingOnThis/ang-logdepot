import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Documento } from '../../models/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(
    public http: HttpClient
  ) { }

  crearDocumento( formulario: any ) {

    const URL = URL_SERVICIOS + '/documento';

    return this.http.post( URL , formulario );

  }

  obtenerDocumento( id: string ) {

    const url = URL_SERVICIOS + '/documento/' + id; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.documento) );

  }

  obtenerContenidoDocumento( id: string ) {

    const url = URL_SERVICIOS + '/documento/contenido/' + id; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.contenido) );

  }

  cargarDocumentos(){

    const url = URL_SERVICIOS + '/documento'; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.documentos) );

  }

  anularDocumento( documento: Documento ){
    
    let url = URL_SERVICIOS + '/documento/anular/' + documento._id; 
    
    return this.http.put( url, documento );

  }

  desanularDocumento( id: string ){

    let url = URL_SERVICIOS + '/documento/desanular/' + id; 
    
    return this.http.put( url, id );
  }

  actualizarDocumento( formulario: any ) {

    console.log(formulario);

    let url = URL_SERVICIOS + '/documento/' + formulario[0]._id;

    return this.http.put( url, formulario )

  }

}