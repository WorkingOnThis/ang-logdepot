import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LoginGuardGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuard } from '../services/service.index';
//Usuarios
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AgregarUsuarioComponent } from './usuarios/agregar-usuario/agregar-usuario.component';
import { ListarUsuariosComponent } from './usuarios/listar-usuarios/listar-usuarios.component';
import { ActualizarUsuarioComponent } from './usuarios/actualizar-usuario/actualizar-usuario.component';
//Empresas
import { EmpresasComponent } from './empresas/empresas.component';
import { AgregarEmpresaComponent } from './empresas/agregar-empresa/agregar-empresa.component';
import { ActualizarEmpresaComponent } from './empresas/actualizar-empresa/actualizar-empresa.component';
import { ListarEmpresasComponent } from './empresas/listar-empresas/listar-empresas.component';
//Cajas
import { CajasComponent } from './cajas/cajas.component';
import { AgregarCajasComponent } from './cajas/agregar-cajas/agregar-cajas.component';
import { ActualizarCajasComponent } from './cajas/actualizar-cajas/actualizar-cajas.component';
import { ListarCajasComponent } from './cajas/listar-cajas/listar-cajas.component';
//Secciones
import { SeccionesComponent } from './secciones/secciones.component';
//Deposito
import { DepositoComponent } from './deposito/deposito.component';
import { ConfigurarDepositoComponent } from './deposito/configurar-deposito/configurar-deposito.component';
//Documentos
import { DocumentosComponent } from './documentos/documentos.component';
import { AgregarDocumentosComponent } from './documentos/agregar-documentos/agregar-documentos.component';
import { ActualizarDocumentosComponent } from './documentos/actualizar-documentos/actualizar-documentos.component';
import { ListarDocumentosComponent } from './documentos/listar-documentos/listar-documentos.component';
// //Tipos de caja
// import { TiposCajaComponent } from './tipos-caja/tipos-caja.component';
// //Estados
// import { EstadosComponent } from './estados/estados.component';

//Etiquetas
import { EtiquetaComponent } from './etiqueta/etiqueta.component';
import { EtiquetasGenerarComponent } from './etiqueta/etiquetas-generar/etiquetas-generar.component';
import { EtiquetasIndividualesComponent } from './etiqueta/etiquetas-individuales/etiquetas-individuales.component';

import { EtiquetasLotesComponent } from './etiqueta/etiquetas-lotes/etiquetas-lotes.component';

import { ReciboComponent } from './recibo/recibo.component';
import { ListarRecibosComponent } from './recibo/listar-recibos/listar-recibos.component';
import { AgregarReciboComponent } from './recibo/agregar-recibo/agregar-recibo.component';
import { ActualizarReciboComponent } from './recibo/actualizar-recibo/actualizar-recibo.component';
import { RutaComponent } from './ruta/ruta.component';
import { ListarRutasComponent } from './ruta/listar-rutas/listar-rutas.component';
import { AgregarRutaComponent } from './ruta/agregar-ruta/agregar-ruta.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { TablaMovimientosComponent } from './movimientos/tabla-movimientos/tabla-movimientos.component';
// import { SalidasComponent } from './movimientos/salidas/salidas.component';
import { MovimientosGenerarComponent } from './movimientos/movimientos-generar/movimientos-generar.component';
import { PosicionarCajaComponent } from './deposito/posicionar-caja/posicionar-caja.component';
import { ContenidosComponent } from './contenidos/contenidos.component';
import { TablaContenidosComponent } from './contenidos/tabla-contenidos/tabla-contenidos.component';
import { ImportarContenidosComponent } from './contenidos/importar-contenidos/importar-contenidos.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            //Todos
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Inicio' } },
            //Generico
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Preferencias' } },
            { path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil del usuario' } },
            //Secciones
            { path: 'areas', component: SeccionesComponent, data: { titulo: 'Areas y tipos' } },
            //Mantenimiento
            //Usuarios
            { path: 'usuarios', component: UsuariosComponent, canActivate:[ AdminGuard ],
                children: [
                             { path: '', redirectTo: 'listar-usuarios', pathMatch: 'full'},
                             { path: 'agregar-usuario', component: AgregarUsuarioComponent, data: { titulo: 'Agregar usuario' } },
                             { path: 'actualizar-usuario/:id', component: ActualizarUsuarioComponent, data: { titulo: 'Actualizar usuario' } },
                             { path: 'listar-usuarios', component: ListarUsuariosComponent, data: { titulo: 'Listar usuarios' } }
                           ],
                data: { titulo: 'Usuarios'}
            },
            //Empresas
            { path: 'empresas', component: EmpresasComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'listar-empresas', pathMatch: 'full'},
                    { path: 'agregar-empresa', component: AgregarEmpresaComponent, data: { titulo: 'Agregar empresa' } },
                    { path: 'actualizar-empresa/:id', component: ActualizarEmpresaComponent, data: { titulo: 'Actualizar empresa' } },
                    { path: 'listar-empresas', component: ListarEmpresasComponent, data: { titulo: 'Listar empresas' } }
                          ],
               data: { titulo: 'Empresas'}
            },
            //Cajas
            { path: 'cajas', component: CajasComponent, canActivate:[ AdminGuard ],
            children: [
                { path: '', redirectTo: 'listar-cajas', pathMatch: 'full'},
                { path: 'agregar-caja', component: AgregarCajasComponent, data: { titulo: 'Agregar caja' } },
                { path: 'actualizar-caja/:id', component: ActualizarCajasComponent, data: { titulo: 'Actualizar caja' } },
                { path: 'listar-cajas', component: ListarCajasComponent, data: { titulo: 'Listar cajas' } }
                      ],
               data: { titulo: 'Cajas'}
            },
            //Documentos
            { path: 'documentos', component: DocumentosComponent, canActivate:[ AdminGuard ],
            children: [
                { path: '', redirectTo: 'listar-documentos', pathMatch: 'full'},
                { path: 'agregar-documento/:id', component: AgregarDocumentosComponent, data: { titulo: 'Agregar documento' } },
                { path: 'actualizar-documento/:id', component: ActualizarDocumentosComponent, data: { titulo: 'Actualizar documento' } },
                { path: 'listar-documentos', component: ListarDocumentosComponent, data: { titulo: 'Listar documentos' } }
                      ],
               data: { titulo: 'Documentos'}
            },
            // Deposito
            { path: 'deposito', component: DepositoComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'configurar-deposito', pathMatch: 'full'},
                    { path: 'configurar-deposito', component: ConfigurarDepositoComponent, data: { titulo: 'Configurar deposito' } },
                    { path: 'posicionar-cajas', component: PosicionarCajaComponent, data: { titulo: 'Posicionar cajas' } }
                          ],
               data: { titulo: 'Ubicaciones'}
            },
            //Etiquetas
            { path: 'etiquetas', component: EtiquetaComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'etiquetas-lotes', pathMatch: 'full'},
                    { path: 'etiquetas-generar', component: EtiquetasGenerarComponent, data: { titulo: 'Generar etiquetas' } },
                    { path: 'etiquetas-lotes', component: EtiquetasLotesComponent, data: { titulo: 'Lotes de etiquetas' } },
                    { path: 'etiquetas-individuales', component: EtiquetasIndividualesComponent, data: { titulo: 'Listado de etiquetas' } }
                      ],
               data: { titulo: 'Etiquetas'}
            },

            //Movimientos
            { path: 'movimientos', component: MovimientosComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'listado-salidas', pathMatch: 'full'},
                    { path: 'tabla-movimientos', component: TablaMovimientosComponent, data: { titulo: 'Tabla de movimientos' } },
                    // { path: 'listado-salidas', component: SalidasComponent, data: { titulo: 'Listado de salidas' } },
                    { path: 'movimientos-generar', component: MovimientosGenerarComponent, data: { titulo: 'Generar movimientos' } }
                        ],
                data: { titulo: 'Movimientos'}
            },
            // // Tipos de caja
            // { path: 'tipos-de-caja', component: TiposCajaComponent, data: { titulo: 'Tipos de caja' } },
            // //Estados
            // { path: 'estados', component: EstadosComponent, data: { titulo: 'Estados' } },

            //Recibos
            { path: 'recibos', component: ReciboComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'listar-recibos', pathMatch: 'full'},
                    { path: 'agregar-recibo', component: AgregarReciboComponent, data: { titulo: 'Agregar recibo' } },
                    { path: 'actualizar-recibo/:id', component: ActualizarReciboComponent, data: { titulo: 'Actualizar recibo' } },
                    { path: 'listar-recibos', component: ListarRecibosComponent, data: { titulo: 'Listar recibos' } }
                    ],
                data: { titulo: 'Recibos'}
            },

            //Rutas
            { path: 'rutas', component: RutaComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'listar-rutas', pathMatch: 'full'},
                    { path: 'agregar-ruta', component: AgregarRutaComponent, data: { titulo: 'Agregar ruta' } },
                    { path: 'listar-rutas', component: ListarRutasComponent, data: { titulo: 'Listar rutas' } }
                    ],
                data: { titulo: 'Rutas'}
            },

            //Importar
            { path: 'contenidos', component: ContenidosComponent, canActivate:[ AdminGuard ],
                children: [
                    { path: '', redirectTo: 'tabla-contenidos', pathMatch: 'full'},
                    { path: 'tabla-contenidos', component: TablaContenidosComponent, data: { titulo: 'Tabla de contenidos' } },
                    { path: 'importar-contenidos', component: ImportarContenidosComponent, data: { titulo: 'Importar contenidos' } }
                    ],
                data: { titulo: 'Contenidos'}
            },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
