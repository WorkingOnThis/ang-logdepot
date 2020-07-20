import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { EtiquetaService, CajaService, SeccionesService, DocumentoService } from '../../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Contenido } from '../../../models/contenido.model';
import { Documento } from '../../../models/documento.model';
import { Area } from '../../../models/area.model';
import { TipoDocumento } from '../../../models/tipo-documento.model';
import { Caja } from '../../../models/caja.model';
import { filter } from 'rxjs/operators';

import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';

@Component({
  selector: 'app-actualizar-documentos',
  templateUrl: './actualizar-documentos.component.html',
  styles: []
})
export class ActualizarDocumentosComponent implements OnInit {

  codigo: string;
  btnActualizar: boolean = true;
  registrar: Array<any> = [];
  id_doc: string;

  documentoGuardado: Documento = new Documento('', '', '', '', '', '', '', '', '');
  contenidoGuardado: Contenido = new Contenido('', '', '', '', '', '', '', '', '', '', '', '', '');
  // SOLO LO UTILIZO PARA OBTENER LA EMPRESA Y ASI OBTENER LAS AREAS (PUEDE MEJORAR CON SERVICIO);
  cajaSelec: Caja = new Caja('', '', '', '', '', '', '', '', '', '', '', '');

  forma: FormGroup;
  contenido: FormGroup;

  areasytipos: any[] = [];
  areasola: Array<Area> = [];
  temp: any[] = [];
  tiposolo: Array<TipoDocumento> = [];
  tipoSoloSelected: Array<TipoDocumento> = [];

  constructor(
    public _fb: FormBuilder,
    public _etiquetaService: EtiquetaService,
    public _cajaService: CajaService,
    public activatedRoute: ActivatedRoute,
    public _seccionesService: SeccionesService,
    public _documentoService: DocumentoService,
    public route: Router,
    public dialog: MatDialog
  ) { 
    activatedRoute.params.subscribe( params => {

      let id = params['id'];

      this.cargarDocumento( id );
      this.cargarSecciones( id );
      this.cargarContenido( id );

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
  }

  cargarDocumento( id: string){
    this.id_doc = id;
    this._documentoService.obtenerDocumento( id )
        .subscribe( (resp:any) => {
          this.documentoGuardado = resp;

    });
  }

  cargarContenido( id: string ){
    this._documentoService.obtenerContenidoDocumento( id )
        .subscribe( (resp:any) => {
          this.contenidoGuardado = resp;

          this.cargarTipos( this.contenidoGuardado.id_area );

    });
  }

  cargarSecciones( id: string ){

    this.areasytipos = [];
    this.areasola = []; 
    this.tiposolo = [];
    this.temp = [];
    this.tipoSoloSelected = [];

    this._seccionesService.obtenerAreasPorDocumento( id )
          .subscribe( (resp:any) => {

            console.log(resp);

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

  }

  cargarTipos( id: string ){
    
    this.tipoSoloSelected = [];

    from(this.tiposolo)
      .pipe(
      filter(tipo => tipo.id_area == id),
      )
      .subscribe(val => {
        this.tipoSoloSelected.push(val);
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
                        if( control.value == this.documentoGuardado.id_codigo){
                          resolve( null );
                        } else {
                          resolve( {'busyLabel': true} );
                        }
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
      undefined,
      this.forma.value.id_codigo,
      this.forma.value.id_solicitud,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.documentoGuardado._id
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
      this.contenidoGuardado.id_caja,
      this.contenidoGuardado.id_documento,
      this.contenidoGuardado._id
      );
  
    this.registrar.push(seccion);
    this.registrar.unshift(documento);

    this.btnActualizar = false;
      
    this._documentoService.actualizarDocumento( this.registrar )
    .subscribe( resp => {
      
              this.btnActualizar = true;
              swal({
                title: 'Documento',
                text: 'Se han efectuado los cambios satisfactoriamente.',
                type: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  this.route.navigate(['/documentos/listar-documentos']);
                }
              });

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
