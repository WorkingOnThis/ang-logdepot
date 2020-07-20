import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuario' ): any {

    let url = URL_SERVICIOS + '/imagenes';

    if ( !img ) {
      return url + '/usuarios/default';
    }

    switch ( tipo ) {

      case 'usuario':
        url += '/usuarios/' + img;
      break;

      case 'empresa':
        url += '/empresas/' + img;
      break;

      default:
        url += '/usuarios/default';

    }

    return url;
  }

}
