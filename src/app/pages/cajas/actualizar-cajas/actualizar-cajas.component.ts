import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { CajaService, EtiquetaService, UsuarioService, TipoCajaService, DepositoService, SeccionesService } from '../../../services/service.index';
import { Empresa } from '../../../models/empresa.model';
import { TipoCaja } from '../../../models/tipocaja.model';
import { Estante } from '../../../models/estante.model';
import { Lugar } from '../../../models/lugar.model';
import { Area } from '../../../models/area.model';
import { TipoDocumento } from '../../../models/tipo-documento.model';
import { Contenido } from '../../../models/contenido.model';
import { Caja } from '../../../models/caja.model';
import { from, Observable } from 'rxjs';
import { map, filter, distinct } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Contenido_vista } from '../../../models/contenido_vista.model';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';

import swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-cajas',
  templateUrl: './actualizar-cajas.component.html',
  styles: []
})
export class ActualizarCajasComponent implements OnInit {

  tipoPos: any;
  btnActualizar: boolean = true;

  agregarFContenido: boolean = true;
  mostrarEstante: boolean = true;
  posicionString: string = '';
  codigo: string;

  forma: FormGroup ;
  contenido: FormGroup ;
  
  cajaSelec: Caja = new Caja('', '', '', '', '', '', '', '', '', '', '', '');
  cajaPosicion: string = '';
  
  empresas: Empresa[] = [];
  tiposcaja: TipoCaja[] = [];

  depositos: Estante[] = [];

  estantes: Array<any> = [];
  posiciones: Array<any> = [];

  depositoSeleccionado: string;
  estanteSeleccionado: string;
  posicionSeleccionado: number;

  lugares: Lugar[] = [];
  lugarBuscado: string = '';

  areasytipos: any[] = [];
  areasola: Array<Area> = [];
  temp: any[] = [];
  tiposolo: Array<TipoDocumento> = [];
  tipoSoloSelected: Array<TipoDocumento> = [];

  contenidoArray: Array<Contenido> = [];
  contenidoVistaArray: Array<Contenido_vista> = [];

  nombre_area: string;
  nombre_tipo: string;

  tipo_caja: string;


  constructor(
    public _fb: FormBuilder,
    public _cajaService: CajaService,
    public _etiquetaService: EtiquetaService,
    public _usuarioService: UsuarioService,
    public _tipoCajaService: TipoCajaService,
    public _depositoService: DepositoService,
    public _seccionesService: SeccionesService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) { 
    activatedRoute.params.subscribe( params => {

      let id = params['id'];

      this.cargarCaja( id );

      this.cargarContenido( id );

    });
  }

  ngOnInit() {

    this.forma = this._fb.group({
      id_codigo: new FormControl ( '', Validators.required, [this.labelExist.bind( this ), this.useLabel.bind(this)]),
      id_tipocaja: new FormControl( '', Validators.required ),
      id_empresa: new FormControl( '', Validators.required ),
      codCaja: new FormControl( '' ),
      precinto: [],
      id_deposito: [],
      id_estante: [],
      id_fila: [],
      id_posicion: []
    });

    this.contenido = this._fb.group({
      txt_contenido: new FormControl( '', Validators.required ),
      id_area: [],
      id_tipo: [],
      desde_n: [],
      hasta_n: [],
      desde_fecha: [],
      hasta_fecha: [],
      desde_letra: [],
      hasta_letra: [],
      observacion: []
    });

    this._usuarioService.cargarEmpresas()
        .subscribe( (resp:any) => {
          this.empresas = resp.listaodempresas
    });
    
    this._tipoCajaService.obtenerTiposCaja()
        .subscribe( (resp:any) => {
          this.tiposcaja = resp.tiposCaja
    });

    // VER DE TRAER EL ACTUAL (ESTO TRAE SOLO LOS LIBRES)
    this._depositoService.obtenerEstantes()
          .subscribe( (resp:any) => {
            this.depositos = resp.Estantes;
    });
  }

  onEvent(event) {
    event.stopPropagation();
  }

  btnAgregarFContenido(){
    this.agregarFContenido = !this.agregarFContenido;
    console.log("btnAgregarFContenido");
  }

  cargarCaja( id: string){

      this._cajaService.obtenerCaja( id )
          .subscribe( (resp:any) => {
            this.cajaSelec = resp.caja;
            this.tipo_caja = this.cajaSelec.id_tipo_caja;
            this.cargarSecciones( this.cajaSelec.id_empresa );
            if(this.cajaSelec.id_posicion == null){
              this.mostrarEstante = true; 
            } else {
              this.mostrarEstante = false;
              this.buscarPosicion( this.cajaSelec.id_posicion );
            }
            console.log(this.cajaSelec);
      });
  }

  buscarPosicion( id: string ){

      this._depositoService.lugarEspecifico( id )
          .subscribe( (resp: any)  => {
            this.posicionString = resp.lugar.nombre;
          });
  }

  cargarContenido( id: string ){

    this._cajaService.obtenerContenidoVista( id )
        .subscribe( (resp:any) => {
          this.contenidoVistaArray = resp;
          
    });

  }

  cargarTipoCaja( id: string){
    this.tipo_caja = id;
    const precinto = this.forma.get('precinto');
    if(this.tipo_caja == '1fxfv72gcjr711f9h'){
      precinto.reset();
      precinto.markAsPristine();
      precinto.markAsUntouched();
      precinto.setValidators([Validators.required]);
      precinto.updateValueAndValidity();
    } else {
      precinto.reset();
      precinto.markAsPristine();
      precinto.markAsUntouched();
      precinto.clearValidators();
      precinto.updateValueAndValidity();
    }
  }


  eliminarContenido( index, j ){

    this._cajaService.eliminarContenido( index )
        .subscribe( (resp:any) => {
        this.contenidoVistaArray.splice(j, 1);
    });

  }

  //REVISAR
  agregarContenido(){

    if ( this.contenido.invalid ) {
      this.contenido.controls.txt_contenido.markAsTouched();
      return;
    }


    if ( this.contenido.valid ) {

      const contenido = new Contenido (
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
        this.cajaSelec._id,
        null,
        null
        );

      this._cajaService.agregarContenido( contenido )
          .subscribe( (resp:any) => {

            swal({
              title: 'Contenido agregado',
              text: 'Se ha añadido contenido a la caja',
              type: 'success',
              confirmButtonText: 'Ok'
            })

            this.cargarContenido( this.cajaSelec._id );
            this.tipoSoloSelected = [];
            this.contenido.reset();
            this.contenido.markAsPristine();
            this.contenido.markAsUntouched();
      });

    }
  }

  cambioDeposito( id: string ){
    
    this.estantes = [];
    this.posiciones = [];

    this.estanteSeleccionado = '';
    this.posicionSeleccionado = 0;

    from(this.depositos)
        .pipe(
        filter(depo => depo.deposito == id),
        distinct( depo => depo.nombre)
        )
        .subscribe(val => {this.estantes.push(val)});
  }

  cambioEstante( nombre: string ){

    this.posiciones = [];

    this.posicionSeleccionado = 0;

    from(this.depositos)
        .pipe(
        filter(depo =>  depo.deposito == this.depositoSeleccionado && depo.nombre == nombre),
        distinct( depo => depo.posicion)
        )
        .subscribe(val => this.posiciones.push(val));
  }

  cambioPosicion( posicion: number ){

    this.posicionSeleccionado = posicion;
    this.lugarBuscado = '';
    this.lugares = [];

    from(this.depositos)
        .pipe(
        filter(depo => depo.deposito == this.depositoSeleccionado && depo.nombre == this.estanteSeleccionado && depo.posicion == this.posicionSeleccionado ),
        map( depo => depo )
        )
        .subscribe( (val) => { 
          this.lugarBuscado = val._id;
        });

    this._depositoService.obtenerLugaresVacios( this.lugarBuscado )
          .subscribe( (resp:any) => {
            this.lugares = resp.lugares;
    });
    
  }

  cargarSecciones( id: string ){

    this.areasytipos = [];
    this.areasola = []; 
    this.tiposolo = [];
    this.temp = [];
    this.tipoSoloSelected = [];

    this._seccionesService.obtenerAreas( id )
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
                        if( control.value == this.cajaSelec.id_codigo){
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

  // this.cajaSelec


  openDialogCodigo(): void {
    const dialogRef = this.dialog.open(DialogCodigo, {
      // height: '800px',
      width: '400px',
      data: {codigo: this.codigo}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result != undefined ){
        // this.codigo = result; // se puede agregar result al arreglo directamente.
        this.cajaSelec.id_codigo = result;
      }
    });
  }

  submitForm(){
    
    if ( this.forma.invalid ) {

      swal({
        title: 'Error',
        text: 'Compruebe los campos del formulario.',
        type: 'error',
        confirmButtonText: 'Ok'
      })

      return;
    }
    
    const cajita = {
      id_codigo: this.forma.value.id_codigo,
      id_tipo_caja: this.forma.value.id_tipocaja,
      id_empresa: this.forma.value.id_empresa,
      precinto: this.forma.value.precinto,
      _id: this.cajaSelec._id
    };
      
    this.btnActualizar = false;
      
    this._cajaService.actualizarCaja( cajita )
        .subscribe( resp => {
          
                  this.btnActualizar = true;
                  
                  swal({
                    title: 'Caja',
                    text: 'Se han efectuado los cambios satisfactoriamente.',
                    type: 'success',
                    confirmButtonText: 'Ok'
                  })

        });

  }

}
