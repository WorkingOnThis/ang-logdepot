import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [];

  // menu: any = [
  //   {
  //     titulo: 'Inicio',
  //     icono: 'fas fa-home',
  //     submenu: [
  //       { titulo: 'Inicio', url: '/dashboard' },
  //       { titulo: 'Registrar', url: '/register' }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'fas fa-cogs',
  //     submenu: [
  //       { titulo: 'Usuarios', url: '/usuarios' },
  //       { titulo: 'Empresas', url: '/empresas' },
  //       { titulo: 'Cajas', url: '/cajas' },
  //     ]
  //   }
  // ];

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  cargarMenu() {
      this.menu = this._usuarioService.menu;
  }
}
