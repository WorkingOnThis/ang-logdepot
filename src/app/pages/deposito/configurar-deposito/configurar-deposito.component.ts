import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Estante } from '../../../models/estante.model';
import { Lugar } from '../../../models/lugar.model';
import { DepositoService, CajaService } from '../../../services/service.index';
import { from } from 'rxjs';
import { map, filter, distinct, bufferCount } from 'rxjs/operators';

import swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Component({
  selector: 'app-configurar-deposito',
  templateUrl: './configurar-deposito.component.html',
  styles: []
})
export class ConfigurarDepositoComponent implements OnInit {

  // TODO:
  // cambiar el armar y no tomar como parametro al color para definir si mostrar el detalle de la caja.

  index: number;
  color: string;
  iconChange: string = 'compare_arrows';

  agregarEstante: boolean = true;

  // selectA: boolean = true;
  // selectB: boolean = false;

  //
  selected = 'CA';
  arrBoxSelectAB: Array<any> = [];
  //

  depositos: Estante[] = [];
  estantes: Array<any> = [];
  posiciones: Array<any> = [];

  estante: FormGroup ;
  matriz: Array<any> = [];

  depositoSeleccionado: string;
  estanteSeleccionado: string;
  posicionSeleccionado: number;

  lugares: Lugar[] = [];
  lugarBuscado: string = '';
  filas: number;
  columnas: number;

  armar: Array<any> = [];

  boxSelectA: Array<any> = [];
  boxSelectB: Array<any> = [];

  cajaSelec: Array<any> = [];
  // cajita: boolean = false;

  constructor(
    @Inject(DOCUMENT) document,
    public dialog: MatDialog,
    public _fb: FormBuilder,
    public _depositoService: DepositoService,
    public _cajaService: CajaService
  ) { }

  ngOnInit() {

    this.estante = this._fb.group({
      deposito: new FormControl( '', Validators.required ),
      nombre: new FormControl( '', Validators.required ),
      posicion: new FormControl( '', Validators.required ),
      filas: new FormControl( '', Validators.required ),
      columnas: new FormControl( '', Validators.required )
    });

    this.obtenerEstantes();

  }
  
  cargarCaja( id: string, nombre: string ){

    this._cajaService.obtenerCajaParaModal( id )
        .subscribe( (resp:any) => {
          if (resp.cajas[0] == undefined){
            console.log("No se ha encontrado cajas con ese id.");
            return
          } else {
            // this.cajaSelec.push(resp.cajas[0]);
            this.openDialogCaja(resp.cajas[0], nombre);
          }
        });
  }

  applyChanges(){

    this.obtenerEstantes();
    
    if(this.boxSelectA.findIndex(x => x === 'vacio') != -1 || this.boxSelectB.findIndex(x => x === 'vacio') != -1){
      swal({
        title: 'Verificar selección',
        text: 'No pueden existir campos sin seleccionar en la tupla',
        type: 'error',
        confirmButtonText: 'Ok'
      })
      return
    }

    for (let i=0; i < this.boxSelectA.length; i++) {

      if(this.boxSelectA[i].color == "#ec6262" && this.boxSelectB[i].color == "#ec6262"){
        swal({
          title: 'Verificar selección',
          text: 'Una de las tuplas hace referencia a lugares vacios',
          type: 'error',
          confirmButtonText: 'Ok'
        })
        return
      }

    }

    this.arrBoxSelectAB.push(this.boxSelectA);
    this.arrBoxSelectAB.push(this.boxSelectB);


    this._depositoService.intercambiarLugares( this.arrBoxSelectAB )
          .subscribe( resp => { 

            this.arrBoxSelectAB = [];

            swal({
              title: 'Intercambio satisfactorio',
              text: 'Se han efectivizado los cambios seleccionados',
              type: 'success',
              confirmButtonText: 'Ok'
            });
        
            this.cancelSelectChange();
            this.obtenerMatriz();

    });

  }

  addSelectChange( lugar: any ){
    
    if(this.boxSelectA.findIndex(x => x._id === lugar._id) != -1 || this.boxSelectB.findIndex(x => x._id === lugar._id) != -1){
      //falta el sweetalert
      console.log("ya se encuentra");
      return
    }

    if(this.selected == 'CA') {

      let indexA = this.boxSelectA.findIndex(x => x === 'vacio');
      if( indexA != -1 ){
        this.boxSelectA[indexA] = lugar;
      } else {
        this.boxSelectA.push(lugar);
        this.boxSelectB.push('vacio');
      }

    } else {
      let index = this.boxSelectB.findIndex(x => x === 'vacio');
      this.boxSelectB[index] = lugar;
    }

  }

  rmSelectChangeBtn( evento: string , index: number ){

    let ident = 'btnChange' + index;

    if(evento == 'mover'){
      let m = document.getElementById(ident);
      m.innerHTML = 'close';
    } else {
      let m = document.getElementById(ident);
      m.innerHTML = 'compare_arrows';
    }

  }

  clearSelect( letra: string, index: number ){

    if(letra == 'A'){
      this.boxSelectA[index] = 'vacio';
    } else{
      this.boxSelectB[index] = 'vacio';
    }

  }

  rmSelectChange( index ){
    this.boxSelectA.splice(index, 1);
    this.boxSelectB.splice(index, 1);
  }

  cancelSelectChange(){
    this.boxSelectA = [];
    this.boxSelectB = [];
    this.selected = 'CA';
  }

  btnAgregarEstante(){
    this.agregarEstante = !this.agregarEstante;
  }

  selectIntercambio(){
    this.agregarEstante = true;
  }
  
  obtenerEstantes(){    
    this._depositoService.obtenerEstantes()
          .subscribe( (resp:any) => {
            this.depositos = resp.Estantes;
    });
  }

  liberarLugar( id: string ){
    this._depositoService.liberarLugar( id)
            .subscribe( resp => {
              console.log(resp);
              this.cajaSelec = [];
              // this.cajita = false;
  
              this._depositoService.obtenerLugares( this.lugarBuscado )
              .subscribe( (resp:any) => {
                this.lugares = resp.lugares;
    
                this.armar = [];
      
                from(this.lugares)
                    .pipe(
                      bufferCount(this.columnas),
                      )
                    .subscribe((x) => { this.armar.push(x) } );
                  });
            })
  }

  guardarEstante() {

    if ( this.estante.invalid ) {
      return;
    }

    this.matriz = []

    const estanteria = new Estante(
      this.estante.value.deposito,
      this.estante.value.nombre,
      this.estante.value.posicion,
      this.estante.value.filas,
      this.estante.value.columnas
    );

    let nombre: string = this.estante.value.nombre + "-" + this.estante.value.posicion + "-"; 

    var m = 1;

    for (let i=1; i <= this.estante.value.filas; i++) {

      for (let j=1; j <= this.estante.value.columnas; j++) {

        let lugarcito = new Lugar(
          nombre + m
        );

        this.matriz.push(lugarcito);

        m++;
      }
      
    }
    
    this.matriz.unshift(estanteria);

    this._depositoService.crearEstante( this.matriz )
            .subscribe( resp => { 
              this.matriz = [];

              swal({
                title: 'Estante creado',
                text: 'Se ha generado un nuevo estante .',
                type: 'success',
                confirmButtonText: 'Ok'
              })

              this.estante.reset();
              this.estante.markAsPristine();
              this.estante.markAsUntouched();

              this.obtenerEstantes();
    });

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

  cambioPosicion(posicion: number){

    this.posicionSeleccionado = posicion;
    this.lugarBuscado = '';
    this.filas = 0;
    this.columnas = 0;
    this.lugares = [];

    from(this.depositos)
        .pipe(
        filter(depo => depo.deposito == this.depositoSeleccionado && depo.nombre == this.estanteSeleccionado && depo.posicion == this.posicionSeleccionado ),
        map( depo => depo )
        )
        .subscribe( (val) => { 
          this.lugarBuscado = val._id;
          this.filas = val.filas;
          this.columnas = val.columnas;
        });
    
    this.obtenerMatriz();

    
  }

  obtenerMatriz(){
    this._depositoService.obtenerLugares( this.lugarBuscado )
          .subscribe( (resp:any) => {
            this.lugares = resp.lugares;

            this.armar = [];
  
            from(this.lugares)
                .pipe(
                  bufferCount(this.columnas),
                  )
                .subscribe((x) => {
                  this.armar.push(x);
                  console.log(this.armar);
                });
    });
  }

  openDialogCaja( caja: any, lugar: string ): void {
    const dialogRef = this.dialog.open(DialogCaja, {
      // height: '500px',
      maxWidth: '900px',
      minWidth: '250px',
      panelClass: 'm-3',
      data: {caja: caja, nombre: lugar}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.obtenerMatriz();
      }
    });
  }
  
  guardarEstado(){

  }

}

@Component({
  selector: 'dialog-caja',
  templateUrl: 'dialog-caja.component.html',
})
export class DialogCaja {

  @ViewChild('num_caja') num_caja: ElementRef;

  modificacion: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCaja>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _cajaService: CajaService
    ) {}
  
    ngOnInit(): void {
    }

    onNoClick(): void {
      this.dialogRef.close( this.modificacion );
    }

    modificarNro(){

      const objIntercambio = { 
        id_caja: this.data.caja._id,
        num_caja: this.num_caja.nativeElement.value
      }

      this._cajaService.cambiarNumero( objIntercambio )
            .subscribe( (resp:any) => {

                //spinner de boton.
                //actualizar tabla. - Devolver una respuesta, si es verdadero se actualiza la tabla.
                // console.log(resp);

                this.modificacion = true;
                this.dialogRef.close( this.modificacion );

            });

    }



}
