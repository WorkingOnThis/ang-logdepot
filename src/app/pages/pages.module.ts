import { NgModule } from "@angular/core";

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from "./pages.component";
import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { DataTablesModule } from '../../../node_modules/angular-datatables';

import { ColorPickerModule } from 'ngx-color-picker';

import { AgregarUsuarioComponent } from './usuarios/agregar-usuario/agregar-usuario.component';
import { ListarUsuariosComponent } from './usuarios/listar-usuarios/listar-usuarios.component';
import { ActualizarUsuarioComponent } from './usuarios/actualizar-usuario/actualizar-usuario.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { AgregarEmpresaComponent } from './empresas/agregar-empresa/agregar-empresa.component';
import { ActualizarEmpresaComponent } from './empresas/actualizar-empresa/actualizar-empresa.component';
import { ListarEmpresasComponent } from './empresas/listar-empresas/listar-empresas.component';
import { ModalGenericoComponent } from '../components/modal-generico/modal-generico.component';
import { SeccionesComponent } from './secciones/secciones.component';
import { DepositoComponent } from './deposito/deposito.component';
import { ConfigurarDepositoComponent, DialogCaja } from './deposito/configurar-deposito/configurar-deposito.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material";
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
//
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MAT_DATE_LOCALE} from '@angular/material';

import { ModalDepositoComponent } from '../components/modal-deposito/modal-deposito.component';
import { CajasComponent } from './cajas/cajas.component';
import { ListarCajasComponent } from './cajas/listar-cajas/listar-cajas.component';
import { AgregarCajasComponent, DialogModificarArea } from './cajas/agregar-cajas/agregar-cajas.component';
import { ActualizarCajasComponent } from './cajas/actualizar-cajas/actualizar-cajas.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { ListarDocumentosComponent } from './documentos/listar-documentos/listar-documentos.component';
import { AgregarDocumentosComponent } from './documentos/agregar-documentos/agregar-documentos.component';
import { ActualizarDocumentosComponent } from './documentos/actualizar-documentos/actualizar-documentos.component';

import { EtiquetaComponent } from './etiqueta/etiqueta.component';
import { EtiquetasGenerarComponent } from './etiqueta/etiquetas-generar/etiquetas-generar.component';
import { EtiquetasLotesComponent } from './etiqueta/etiquetas-lotes/etiquetas-lotes.component';
import { EtiquetasIndividualesComponent } from './etiqueta/etiquetas-individuales/etiquetas-individuales.component';

import { AgGridModule } from 'ag-grid-angular';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SignaturePadModule } from 'angular2-signaturepad';

import { ReciboComponent } from './recibo/recibo.component';
import { ListarRecibosComponent } from './recibo/listar-recibos/listar-recibos.component';
import { AgregarReciboComponent, DialogFirma, DialogCodigo, DialogEstado } from './recibo/agregar-recibo/agregar-recibo.component';

import { DialogAgregarArea } from './cajas/agregar-cajas/agregar-cajas.component';

import { RutaComponent } from './ruta/ruta.component';
import { ListarRutasComponent } from './ruta/listar-rutas/listar-rutas.component';
import { AgregarRutaComponent } from './ruta/agregar-ruta/agregar-ruta.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ButtonRendererComponent } from './recibo/listar-recibos/button-renderer/button-renderer.component';
import { ActualizarReciboComponent } from './recibo/actualizar-recibo/actualizar-recibo.component';
import { ButtonCajaComponent } from './cajas/listar-cajas/button-caja/button-caja.component';

import { ButtonEmpresaComponent } from './empresas/listar-empresas/button-empresa/button-empresa.component';

import { ButtonDocumentoComponent } from './documentos/listar-documentos/button-documento/button-documento.component';
import { ButtonLoteComponent } from './etiqueta/etiquetas-lotes/button-lote/button-lote.component';
import { ButtonEtiquetaComponent } from './etiqueta/etiquetas-individuales/button-etiqueta/button-etiqueta.component';
import { ButtonMovimientoComponent } from './movimientos/tabla-movimientos/button-movimiento/button-movimiento.component';

import { MovimientosComponent } from './movimientos/movimientos.component';
import { TablaMovimientosComponent } from './movimientos/tabla-movimientos/tabla-movimientos.component';
// import { SalidasComponent } from './movimientos/salidas/salidas.component';
import { MovimientosGenerarComponent } from './movimientos/movimientos-generar/movimientos-generar.component';
import { PosicionarCajaComponent } from './deposito/posicionar-caja/posicionar-caja.component';
import { ContenidosComponent } from './contenidos/contenidos.component';
import { TablaContenidosComponent } from './contenidos/tabla-contenidos/tabla-contenidos.component';
import { ButtonPosicionComponent, DialogContenido, DialogPosiciones } from "./deposito/posicionar-caja/button-posicion/button-posicion.component";
import { ButtonUsuarioComponent } from "./usuarios/listar-usuarios/button-usuario/button-usuario.component";
import { ImportarContenidosComponent, DialogErrors } from './contenidos/importar-contenidos/importar-contenidos.component';




@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        AccountSettingsComponent,
        ProfileComponent,
        UsuariosComponent,
        ModalUploadComponent,
        AgregarUsuarioComponent,
        ListarUsuariosComponent,
        ActualizarUsuarioComponent,
        EmpresasComponent,
        AgregarEmpresaComponent,
        ActualizarEmpresaComponent,
        ListarEmpresasComponent,
        ModalGenericoComponent,
        SeccionesComponent,
        DepositoComponent,
        ConfigurarDepositoComponent,
        ModalDepositoComponent,
        CajasComponent,
        ListarCajasComponent,
        AgregarCajasComponent,
        ActualizarCajasComponent,
        DocumentosComponent,
        ListarDocumentosComponent,
        AgregarDocumentosComponent,
        ActualizarDocumentosComponent,
        EtiquetaComponent,
        EtiquetasGenerarComponent,
        EtiquetasLotesComponent,
        EtiquetasIndividualesComponent,
        ReciboComponent,
        ListarRecibosComponent,
        AgregarReciboComponent,
        ActualizarReciboComponent,
        RutaComponent,
        ListarRutasComponent,
        AgregarRutaComponent,
        DialogFirma,
        DialogCodigo,
        DialogEstado,
        DialogCaja,
        DialogAgregarArea,
        DialogContenido,
        DialogPosiciones,
        DialogErrors,
        DialogModificarArea,
        ButtonRendererComponent,
        ButtonCajaComponent,
        ButtonEmpresaComponent,
        ButtonUsuarioComponent,
        ButtonDocumentoComponent,
        ButtonLoteComponent,
        ButtonEtiquetaComponent,
        ButtonPosicionComponent,
        ButtonMovimientoComponent,
        MovimientosComponent,
        TablaMovimientosComponent,
        // SalidasComponent,
        MovimientosGenerarComponent,
        PosicionarCajaComponent,
        ContenidosComponent,
        TablaContenidosComponent,
        ImportarContenidosComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        PAGES_ROUTES,
        PipesModule,
        DataTablesModule,
        ColorPickerModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        SignaturePadModule,
        MatDividerModule,
        MatListModule,
        MatTooltipModule,
        MatIconModule,
        MatBadgeModule,
        MatTabsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMenuModule,
        MatRadioModule,
        ZXingScannerModule,
        AgGridModule.withComponents([ButtonRendererComponent, ButtonCajaComponent, 
            ButtonDocumentoComponent, ButtonLoteComponent, ButtonEtiquetaComponent,
            ButtonEmpresaComponent, ButtonUsuarioComponent, ButtonPosicionComponent,
            ButtonMovimientoComponent]),
        // MatMomentDateModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        }),
        NgxQRCodeModule,
        NgxBarcodeModule,
    ],
    entryComponents: [
        DialogFirma,
        DialogCodigo,
        DialogEstado,
        DialogCaja,
        DialogAgregarArea,
        DialogModificarArea,
        DialogContenido,
        DialogPosiciones,
        DialogErrors
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]
})
export class PagesModule { }
