import { FormGroup, Validators, FormControl, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CajaService, EtiquetaService, UsuarioService, EstadoService, TipoCajaService, SeccionesService, DocumentoService } from '../../../services/service.index';
import { Caja } from '../../../models/caja.model';
import { Area } from '../../../models/area.model';
import { TipoDocumento } from '../../../models/tipo-documento.model';
import { Documento } from '../../../models/documento.model';
import { Contenido } from '../../../models/contenido.model';
import { Usuario } from '../../../models/usuario.model';
import { MatDialog } from '@angular/material';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';

import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-documentos',
  templateUrl: './agregar-documentos.component.html',
  styles: []
})
export class AgregarDocumentosComponent implements OnInit {

  btnActualizar: boolean = true;
  id: string;
  codigo: string;

  forma: FormGroup ;
  contenido: FormGroup ;

  caja: Caja = new Caja('', '', '', '', '', '', '','');

  // solicitantes: Array<any> = [];

  areasytipos: any[] = [];
  areasola: Array<Area> = [];
  temp: any[] = [];
  tiposolo: Array<TipoDocumento> = [];
  tipoSoloSelected: Array<TipoDocumento> = [];

  registrar: Array<any> = [];

  usuario_alta: Usuario;

  constructor(
    public _fb: FormBuilder,
    public _etiquetaService: EtiquetaService,
    public activatedRoute: ActivatedRoute,
    public _cajaService: CajaService,
    public _usuarioService: UsuarioService,
    public _estadoService: EstadoService,
    public _tipoCajaService: TipoCajaService,
    public _seccionesService: SeccionesService,
    public _documentoService: DocumentoService,
    public dialog: MatDialog
  ) { 
    this.usuario_alta = JSON.parse(localStorage.getItem('usuario'));

    activatedRoute.params.subscribe( params => {
      this.id = params['id'];
    });

  }
  
  ngOnInit() {
    
    this.forma = this._fb.group({
      id_codigo: new FormControl ( '', Validators.required, [this.labelExist.bind( this ), this.useLabel.bind(this)]),
      id_solicitud: [],
    });
    
    this.contenido = this._fb.group({
      txt_contenido: new FormControl( '', Validators.required ),
      id_area: [],
      id_tipo: [],
      desde_n: [],
      hasta_n: [],
      desde_letra: [],
      hasta_letra: [],
      desde_fecha: [],
      hasta_fecha: [],
      observacion: []
    });
    
    this._cajaService.obtenerCaja( this.id )
          .subscribe( (resp:any) => {
              this.caja = resp.caja;

              this.areasytipos = [];
              this.areasola = []; 
              this.tiposolo = [];
              this.temp = [];
              this.tipoSoloSelected = [];

              this._seccionesService.obtenerAreas( this.caja.id_empresa )
              .subscribe( (resp:any) => {
    
                for (let each in resp.area) {
                    this.areasytipos.push(resp.area[each]);    
                }
    
                for (let cada in this.areasytipos) {
                  
                  if( this.temp.indexOf(this.areasytipos[cada].nombre_area) === -1){
    
                    this.temp.push(this.areasytipos[cada].nombre_area);
    
                    const area = new Area (
                      this.areasytipos[cada].nombre_area,
                      null,
                      this.areasytipos[cada].id_area
                    );
                    
                    this.areasola.push(area);
                  }
                }
    
                for (let tipos in this.areasytipos) {
                  const tipo = new TipoDocumento (
                    this.areasytipos[tipos].nombre_tipo,
                    this.areasytipos[tipos].id_area,
                    this.areasytipos[tipos].id_tipo,
                  );
                  this.tiposolo.push(tipo);
                }
    
              });

              // this._usuarioService.usuariosPorEmpresa( this.caja.id_empresa )
              //     .subscribe( (resp:any) => {
              //       this.solicitantes = resp.usuario;
              // });
    });

  }
  
  cargarTipos( id: string ){
    
    this.tipoSoloSelected = [];

    from(this.tiposolo)
      .pipe(
      filter(tipo => tipo.id_area == id),
      )
      .subscribe(val => {
        this.tipoSoloSelected.push(val)
      });

  }

  private labelTimeout;

  labelExist(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    clearTimeout(this.labelTimeout);
    return new Promise((resolve, reject) => {
        this.labelTimeout = setTimeout(() => {
            this._etiquetaService.existeEtiqueta(control.value)
                .subscribe(
                    (response: any) => { 
                      if(response.mensaje == 'La etiqueta no existe'){
                        resolve( {'existLabel': true} )
                      } else {
                        resolve( null )
                      }
                    }
                  )
        }, 400);
    });
  }

  private uselabelTimeout;

  useLabel(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    clearTimeout(this.uselabelTimeout);
    return new Promise((resolve, reject) => {
        this.uselabelTimeout = setTimeout(() => {
            this._etiquetaService.etiquetaOcupada(control.value)
                .subscribe(
                    (response: any) => { 
                      if(response.mensaje == 'La etiqueta ya esta en uso'){
                        resolve( {'busyLabel': true} );
                      } else {
                        resolve( null )
                      }
                    }
                  )
        }, 600);
    });
  }

  openDialogCodigo(): void {
    const dialogRef = this.dialog.open(DialogCodigo, {
      // height: '800px',
      width: '400px',
      data: {codigo: this.codigo}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result != undefined ){
        // this.codigo = result; // se puede agregar result al arreglo directamente.
        this.forma.controls.id_codigo = result;
      }
    });
  }


  submitForm(){

    if ( this.forma.invalid ) {
      return;
    }

    if ( this.contenido.invalid) {
      return;
    }

    this.registrar = [];
  
    const documento = new Documento(
      this.caja._id,
      this.forma.value.id_codigo,
      this.forma.value.id_solicitud,
      this.usuario_alta._id
    );

    const seccion = new Contenido (
      this.contenido.value.txt_contenido,
      this.contenido.value.id_area,
      this.contenido.value.id_tipo,
      this.contenido.value.desde_n,
      this.contenido.value.hasta_n,
      this.contenido.value.desde_fecha,
      this.contenido.value.hasta_fecha,
      this.contenido.value.desde_letra,
      this.contenido.value.hasta_letra,
      this.contenido.value.observacion,
      this.caja._id,      
      null,
      null
      );
  
    this.registrar.push(seccion);
    this.registrar.unshift(documento);

    this._documentoService.crearDocumento( this.registrar )
            .subscribe( resp => {
              // console.log( resp );

              this.btnActualizar = true;
              swal({
                title: 'Documento',
                text: 'Generación satisfactoria.',
                type: 'success',
                confirmButtonText: 'Ok'
              });

              this.contenido.reset();
              this.forma.reset();
              this.forma.markAsPristine();
              this.forma.markAsUntouched();
            },
              err => {
              console.log(err);
              this.btnActualizar = true;              
              swal({
                  title: 'Error al actualizar el documento',
                  text: 'Ocurrió un error mientras se procesaba la solicitud.',
                  type: 'error',
                  confirmButtonText: 'Ok'
                });

            });

  }
  
}
