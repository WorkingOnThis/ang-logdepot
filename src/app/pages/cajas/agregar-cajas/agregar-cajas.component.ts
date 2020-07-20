import { Component, OnInit, Inject } from '@angular/core';
import { CajaService, EtiquetaService,
         UsuarioService,
         TipoCajaService, DepositoService,
        SeccionesService } from '../../../services/service.index';
import { FormGroup, Validators, FormControl, FormBuilder, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { filter, distinct, map } from 'rxjs/operators';
import { Empresa } from '../../../models/empresa.model';
// import { Estado } from '../../../models/estado.model';
import { TipoCaja } from '../../../models/tipocaja.model';
import { Estante } from '../../../models/estante.model';
import { Lugar } from '../../../models/lugar.model';
import { Area } from '../../../models/area.model';
import { TipoDocumento } from '../../../models/tipo-documento.model';
import { Contenido } from '../../../models/contenido.model';
import { Contenido_vista } from '../../../models/contenido_vista.model';
import { Caja } from '../../../models/caja.model';
import { Usuario } from '../../../models/usuario.model';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogCodigo } from '../../recibo/agregar-recibo/agregar-recibo.component';
import { DOCUMENT } from '@angular/common'; 

import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-cajas',
  templateUrl: './agregar-cajas.component.html',
  styles: []
})
export class AgregarCajasComponent implements OnInit {

  codigo: string;
  btnRegistrar: boolean = true;


  forma: FormGroup ;
  contenido: FormGroup ;
  usuario_alta: Usuario;

  agregarFContenido: boolean = true;

  empresaSelected: string = '';
  empresaSelectedName: string = '';
  
  areaSelected: string = '';

  empresas: Empresa[] = [];
  tiposcaja: TipoCaja[] = [];
  // estados: Estado[] = [];

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

  registrar: Array<any>= [];

  constructor(
    public _fb: FormBuilder,
    public _cajaService: CajaService,
    public _etiquetaService: EtiquetaService,
    public _usuarioService: UsuarioService,
    public _tipoCajaService: TipoCajaService,
    // public _estadoService: EstadoService,
    public _depositoService: DepositoService,
    public _seccionesService: SeccionesService,
    public dialog: MatDialog
  ) { 
    this.usuario_alta = JSON.parse(localStorage.getItem('usuario'));
  }
  
  // x5cyw4hsjwkyscw6
  // 1fxfv7710jqemzzbf
  
  ngOnInit() {

    this.forma = this._fb.group({
      id_codigo: new FormControl ( '', Validators.required, [this.labelExist.bind( this ), this.useLabel.bind( this )]),
      id_tipocaja: new FormControl( '', Validators.required ),
      id_empresa: new FormControl( '', Validators.required ),
      codCaja: new FormControl( '' ),
      precinto: [],
      id_deposito: [],
      id_estante: [],
      id_fila: [],
      id_posicion: new FormControl( '' )
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
          this.empresas = resp.listaodempresas;
    });
    
    // this._estadoService.obtenerEstadosCaja()
    //     .subscribe( (resp:any) => {
    //       this.estados = resp.estados
    // });

    this._tipoCajaService.obtenerTiposCaja()
        .subscribe( (resp:any) => {
          this.tiposcaja = resp.tiposCaja
    });

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

  eliminarContenido( index ){
    this.contenidoArray.splice(index, 1);
    this.contenidoVistaArray.splice(index, 1);
  }

  mostrarForma(){

    if ( this.contenido.invalid ) {
      this.contenido.controls.txt_contenido.markAsTouched();
      return;
    }

    this.areaSelected = '';
    
    from(this.areasytipos)
        .pipe(
        map(ayt => ayt),
        filter(ayt => ayt.id_tipo == this.contenido.value.id_tipo),
        map(ayt => ayt)
        )
        .subscribe(val => {
          this.nombre_area = val.nombre_area;
          this.nombre_tipo = val.nombre_tipo;
        });
    
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
        this.contenido.value.observacion
        );

      const contenido_vista = new Contenido_vista (
        this.contenido.value.txt_contenido,
        this.contenido.value.id_area,
        this.contenido.value.id_tipo,
        this.nombre_area,
        this.nombre_tipo,
        this.contenido.value.desde_n,
        this.contenido.value.hasta_n,
        this.contenido.value.desde_fecha,
        this.contenido.value.hasta_fecha,
        this.contenido.value.desde_letra,
        this.contenido.value.hasta_letra,
        this.contenido.value.observacion,
        null,
        null
        );
        
      this.contenidoArray.push(contenido);
      this.contenidoVistaArray.push(contenido_vista);

      this.tipoSoloSelected = [];
      this.contenido.reset();
      this.contenido.markAsPristine();
      this.contenido.markAsUntouched();
      return;
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

  buscarNombreEmpresa( id ){
    this.empresas.forEach( resp => {
      if(resp._id === id) {
        this.empresaSelectedName = resp.nombre;
      }
    });
  }

  cargarSecciones( id: string ){

    //debo deshabilitar el boton de modificar y eliminar si no tienen el area seleccionada.
    this.empresaSelected = id;
    this.areaSelected = '';
    this.contenido.controls['id_area'].reset();

    this.buscarNombreEmpresa(id);

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
    
    this.areaSelected = id;

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
                        resolve( {'busyLabel': true} )
                      } else {
                        resolve( null )
                      }
                    }
                  )
        }, 600);
    });
  }

  submitForm(){
  
    if ( this.forma.invalid ) {
      return;
    }

    this.btnRegistrar = false;
    this.registrar = [];
  
    const cajita = new Caja(
      this.forma.value.id_codigo,
      this.forma.value.id_tipocaja,
      this.forma.value.id_empresa,
      this.forma.value.precinto,
      this.forma.value.codCaja,
      this.forma.value.id_posicion,
      this.usuario_alta._id,
    );
  
    this.registrar.push(this.contenidoArray);
    this.registrar.unshift(cajita);

    this._cajaService.agregarCaja( this.registrar )
            .subscribe( resp => {

              swal({
                title: 'Registro exitoso',
                text: 'Se ha ingresado una nueva caja.',
                type: 'success',
                confirmButtonText: 'Ok'
              })

              this.btnRegistrar = true;
              this.contenido.reset();
              this.contenidoArray = [];
              this.contenidoVistaArray = [];
              this.forma.reset();
              this.tipo_caja = "";
              this.forma.markAsPristine();
              this.forma.markAsUntouched();
            },
              err => {
              console.log(err);
              this.btnRegistrar = true;
              swal({
                  title: 'Error al registrar caja',
                  text: 'Ocurrió un error mientras se procesaba la solicitud.',
                  type: 'error',
                  confirmButtonText: 'Ok'
                });

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


  openDialogAgregarArea(): void {
    const dialogRef = this.dialog.open(DialogAgregarArea, {
      // height: '800px',
      width: '400px',
      data: {idempresa: this.empresaSelected, nameempresa: this.empresaSelectedName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Agregado'){
        this.cargarSecciones(this.empresaSelected);
      }

    });
  }

  openDialogModificarArea(): void {
    const dialogRef = this.dialog.open(DialogModificarArea, {
      // height: '800px',
      width: '400px',
      data: {idempresa: this.empresaSelected, nameempresa: this.empresaSelectedName, idarea: this.areaSelected}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Modificado'){
        this.cargarSecciones(this.empresaSelected);
      }

    });
  }
  
}


@Component({
  selector: 'dialog-agregar-area',
  templateUrl: 'dialog-agregar-area.component.html',
})
export class DialogAgregarArea {

  forma: FormGroup;
  area_fc = new FormControl( null, Validators.required );
  // tipos_fc = new FormArray([]);

  addsectionspinner: Boolean = false;

  idempresa: string = this.data.idempresa;
  nombre_empresa: string = this.data.nameempresa;

  formulario: any[] = [];
  

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarArea>,
    public _seccionesService: SeccionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    ngOnInit(): void {

      this.forma = new FormGroup({
        area: this.area_fc,
        tipos: new FormArray([])
      });

    }

    // girarspinner(){
    //   this.addsectionspinner = !this.addsectionspinner;
    // }

    getRequiredErrorMessage(field) {
              return this.forma.get(field).hasError('required') ? 'Este campo es requerido' : '';
    }

    agregartipos(){
        (<FormArray>this.forma.get('tipos')).push(new FormControl( null, Validators.required ));
    }

    eliminartipos( index ){
      (<FormArray>this.forma.get('tipos')).removeAt(index);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    guardarArea() {

      this.addsectionspinner = true;
    
      const area = new Area (
        this.forma.value.area,
        this.idempresa
      );
  
      this.formulario.push(area);
  
      for (let entry of this.forma.value.tipos) {
        const tipos = new TipoDocumento (
          entry
        )
        this.formulario.push(tipos);
      }
  
      this._seccionesService.crearArea( this.formulario )
                .subscribe( resp => { 
                  this.dialogRef.close('Agregado');
                  swal({
                    title: 'Sección creada',
                    text: 'Se ha generado una nueva sección.',
                    type: 'success',
                    confirmButtonText: 'Ok'
                  })
      });
      
    }

}

@Component({
  selector: 'dialog-modificar-area',
  templateUrl: 'dialog-modificar-area.component.html',
})
export class DialogModificarArea {

  forma: FormGroup;
  area_fc = new FormControl( null, Validators.required );
  // tipos_fc = new FormArray([]);

  addsectionspinner: Boolean = false;

  idempresa: string = this.data.idempresa;
  nombre_empresa: string = this.data.nameempresa;

  formulario: any[] = [];
  
  area = {id_area: null, nombre_area: null};
  tipos: any[] = [];

  modificar: any[] = [];

  todo: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarArea>,
    public _seccionesService: SeccionesService,
    @Inject(DOCUMENT) document,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.cargarAreasTipos(this.data.idarea);
    }
  
    ngOnInit(): void {
      
      this.forma = new FormGroup({
        area: this.area_fc,
        tipos_existentes: new FormArray([]),
        tipos: new FormArray([])
      });

    }

    cargarAreasTipos( id: string ) {
      this._seccionesService.obtenerAreaTipos( id )
            .subscribe( (resp:any) => {

              this.area = {
                id_area: resp.area[0].id_area,
                nombre_area: resp.area[0].nombre_area,
              }

              resp.area.forEach( resp => {

                let tipo = {
                  id_tipo: resp.id_tipo,
                  nombre_tipo: resp.nombre_tipo,
                }
                
                this.tipos.push(tipo);
                this.agregartiposexistentes();
              });

              

            });
    }

    getRequiredErrorMessage(field) {
              return this.forma.get(field).hasError('required') ? 'Este campo es requerido' : '';
    }

    agregartipos(){
        (<FormArray>this.forma.get('tipos')).push(new FormControl( null, Validators.required ));
    }

    agregartiposexistentes(){
      (<FormArray>this.forma.get('tipos_existentes')).push(new FormControl( null, Validators.required ));
    }

    eliminartipos( index ){
      (<FormArray>this.forma.get('tipos')).removeAt(index);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    guardarArea(){

      this.addsectionspinner = true;

      const m_area = new Area (
        this.forma.value.area,
        this.data.idempresa,
        this.area.id_area
      )

      
      this.modificar.push(m_area);
      
      var i = 0;
      this.forma.value.tipos_existentes.forEach( resp => {

          const m_tipo = new TipoDocumento(
              resp,
              this.area.id_area,
              this.tipos[i].id_tipo,
          )
          i++;

          this.modificar.push(m_tipo);
      });

      for (let entry of this.forma.value.tipos) {
        const tipos = new TipoDocumento (
          entry,
          this.area.id_area
        )
        this.formulario.push(tipos);
      }

      if(this.formulario.length !== 0){

        this.todo.push(this.modificar, this.formulario);

        this._seccionesService.modificarAgregarSeccion( this.todo )
                  .subscribe( resp => { 
                    this.dialogRef.close('Modificado');
                    swal({
                      title: 'Sección modificada',
                      text: 'Se ha actualizado la sección.',
                      type: 'success',
                      confirmButtonText: 'Ok'
                    })
        });
        
      } else {

        this._seccionesService.modificarSeccion( this.modificar )
                  .subscribe( resp => { 
                    this.dialogRef.close('Modificado');
                    swal({
                      title: 'Sección modificada',
                      text: 'Se ha actualizado la sección.',
                      type: 'success',
                      confirmButtonText: 'Ok'
                    })
        });

      }

    }

    // guardarArea() {

    //   this.addsectionspinner = true;
    
    //   const area = new Area (
    //     this.forma.value.area,
    //     this.idempresa
    //   );
  
    //   this.formulario.push(area);
  
    //   for (let entry of this.forma.value.tipos) {
    //     const tipos = new TipoDocumento (
    //       entry
    //     )
    //     this.formulario.push(tipos);
    //   }
  
    //   this._seccionesService.crearArea( this.formulario )
    //             .subscribe( resp => { 
    //               this.dialogRef.close('Agregado');
    //               swal({
    //                 title: 'Sección creada',
    //                 text: 'Se ha generado una nueva sección.',
    //                 type: 'success',
    //                 confirmButtonText: 'Ok'
    //               })
    //   });
      
    // }

}