import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { ModalGenericoService } from '../components/modal-generico/modal-generico.service';


import {
         SettingsService,
         SidebarService,
         SharedService,
         UsuarioService,
         LoginGuardGuard,
         EmpresaService,
         SubirArchivoService,
         AdminGuard,
         SeccionesService,
         DepositoService,
         CajaService,
         DocumentoService,
         EstadoService,
         TipoCajaService,
         EtiquetaService,
         LoteService,
         ReciboService,
         MovimientosService,
         ContenidoService
  } from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
    ModalGenericoService,
    EmpresaService,
    AdminGuard,
    SeccionesService,
    DepositoService,
    CajaService,
    DocumentoService,
    EstadoService,
    TipoCajaService,
    EtiquetaService,
    LoteService,
    ReciboService,
    MovimientosService,
    ContenidoService
  ],
  declarations: []
})
export class ServiceModule { }
