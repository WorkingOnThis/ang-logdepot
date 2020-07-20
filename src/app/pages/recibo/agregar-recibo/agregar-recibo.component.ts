import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Empresa } from '../../../models/empresa.model';
import { EmpresaService, EtiquetaService, ReciboService } from '../../../services/service.index';
import { UsuarioService } from '../../../services/service.index';

import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { Recibo } from '../../../models/recibo.model';
import { Renglon } from '../../../models/renglon.model';


export interface DialogData {
  firma: Blob;
  btnVerFirma: boolean;
  imgDir: string
}

export interface Code {
  codigo: string;
}

export interface Notificacion {
  tipo: string;
  mensaje: string;
}

export interface Renglon {
  select_accion: string;
  select_unidad: string;
  codigo: string;
  estado: string;
}

export const markFormGroupUntouched = (formGroup) => {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsUntouched();
    control.markAsPristine();

    if (control.controls) {
      markFormGroupUntouched(control);
    }
  });
};

export const markFormGroupTouched = (formGroup) => {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control.controls) {
      markFormGroupTouched(control);
    }
  });
};

@Component({
  selector: 'app-agregar-recibo',
  templateUrl: './agregar-recibo.component.html',
  styles: []
})
export class AgregarReciboComponent implements OnInit {

  usuario_creador:any;

  //EMPRESA
  date = new FormControl(new Date());
  
  empresas: Empresa[] = [];
  empresaSelec: Empresa = new Empresa('','','', null, null, null,'','','','','', null,'','','','', null, null,'','','','','','');

  // VALIDACIONES DE EMPRESA
  form_empresa: FormGroup;

  empresa_nombre_fc = new FormControl( null, [Validators.required]);
  empresa_razon_fc = new FormControl( null, []);
  empresa_direccion_fc = new FormControl( null, []);
  empresa_telefono_fc = new FormControl( null, []);
  empresa_responsable_fc = new FormControl( null, []);
  empresa_email_fc = new FormControl( null, [Validators.required, Validators.email]);
  empresa_envio_fc = new FormControl( null, [Validators.required]);
  empresa_fecha_fc = new FormControl( new Date(), [Validators.required]);

  // VALORES DE FIRMA
  firma: Blob;
  btnVerFirma: boolean = false;
  imgDir: string = '';

  form_firma: FormGroup;

  firma_nombre_fc = new FormControl( null, [Validators.required]);
  nom_empresa: string = '';
  firma_apellido_fc = new FormControl( null, [Validators.required]);

  // VALORES DE NUEVA LINEA
  select_accion = 'retiro';
  select_unidad = '';
  codigo: string = '';
  estado: string = '';
  renglon: Renglon;
  // array_renglones = [];
  renglones_validate: boolean = false; 

  count_retiros_box: number = 0;
  count_retiros_doc: number = 0;
  count_entregas_box: number = 0;
  count_entregas_doc: number = 0;
  array_retiros = [];
  array_entregas = [];
  
  //VALORES FORMULARIO DE RENGLON
  form_renglon: FormGroup;

  accion_formControl = new FormControl( null, [Validators.required]);
  unidad_formControl = new FormControl( null, [Validators.required]);
  codigo_formControl = new FormControl( null, [Validators.required]);

  //VALORES FORMULARIO FINALIZACION
  observaciones: string = '';
  enviar_email: boolean = true;
  btnGenerar: boolean = true;
  notificaciones = [];

  // GENERAL  ------------------------------------------------------------------------------------
  // ACORDEON PARA LOS CAMPOS
  // TITLE ROJO VERDE Y NARANJA PARA LOS ESTADOS DE CADA UNO DE LOS FORMULARIOS 
  // ---------------------------------------------------------------------------------------------
  // TODOS PARA DATOS DE LA EMPRESA  -------------------------------------------------------------
  // EL NOMBRE DE LA EMPRESA DEBE SER DE AUTOCOMPLETADO PARA EL CASO EN EL QUE EL NOMBRE NO SE
  // ENCUENTE EN EN LA LISTA.
  // AGREGAR UN CAMPO DE FECHA Y HORA (UNO REAL Y OTRO MODIFICABLE)
  // MODIFICAR EL SERVICIO DE EMPRESAS PARA QUE TRAIGA MENOS CAMPOS Y LAS EMPRESAS QUE NO ESTEN
  // DADAS DE BAJA
  // ---------------------------------------------------------------------------------------------
  // TODOS PARA CUERPO DEL RECIBO ----------------------------------------------------------------
  // VALIDAR QUE NO ESTE DUPLICADO
  // VER EL RESPONSIVE
  // PONER A FUNCIONAR EL MODAL - VER DE AGREGARLE SNACKBAR
  // AGREGAR EL MODAL PARA VISUALIZAR LA ETIQUETA O SUS PROBLEMAS
  // ---------------------------------------------------------------------------------------------
  // TODOS LA FIRMA ------------------------------------------------------------------------------
  // MEJORAR EL ASPECTO DEL MODAL
  // ---------------------------------------------------------------------------------------------
  // TODOS PARA EL CIERRE ----------------------------------------------------------------------
  // GENERAR HTML CON LOS CAMPOS NECESARIOS
  // GENERAR PDF
  // VER TRANSACCIONES
  // 
  // ---------------------------------------------------------------------------------------------


  constructor(
    public dialog: MatDialog,
    public _empresaService: EmpresaService,
    public _usuarioService: UsuarioService,
    public _etiquetaService: EtiquetaService,
    public _reciboService: ReciboService
    ) {}

  ngOnInit() {

    this.usuario_creador = JSON.parse(localStorage.getItem('usuario'));

    this.form_empresa = new FormGroup({
      empresa_nombre: this.empresa_nombre_fc,
      empresa_razon: this.empresa_razon_fc,
      empresa_direccion: this.empresa_direccion_fc,
      empresa_telefono: this.empresa_telefono_fc,
      empresa_responsable: this.empresa_responsable_fc,
      empresa_email: this.empresa_email_fc,
      empresa_envio: this.empresa_envio_fc,
      empresa_fecha: this.empresa_fecha_fc
    });

    this.form_renglon = new FormGroup({
      accion: this.accion_formControl,
      unidad: this.unidad_formControl,
      codigo: this.codigo_formControl
    });

    this.form_firma = new FormGroup({
      firma_nombre: this.firma_nombre_fc,
      firma_apellido: this.firma_apellido_fc,
    });

    this._usuarioService.cargarEmpresas()
    .subscribe( (resp:any) => {
      this.empresas = resp.listaodempresas
    });

  }

  /// --------- ESTO PUEDE SER SOLO 1 FUNCION ------------ ///
  getRequiredErrorMessage(field) {
    return this.form_renglon.get(field).hasError('required') ? 'Este campo es requerido' : '';
  }

  getRequiredErrorMessageForm2(field) {
    return this.form_empresa.get(field).hasError('required') ? 'Este campo es requerido' : 
              this.form_empresa.get(field).hasError('email') ? 'Ingrese un e-mail válido' : '';
  }

  getRequiredErrorMessageForm3(field) {
    return this.form_firma.get(field).hasError('required') ? 'Este campo es requerido' : '';
  }
  /// ---------       FIN DEL COMENTARIO       ------------ ///


  cambioEmpresa( id: string ){ 
    this._empresaService.cargarEmpresa( id )
                .subscribe( empresa => {
                  this.nom_empresa = empresa.nombre;
                  this.empresaSelec = empresa;
                });
  }
  
  mostrarDatosEmpresa(){

    if( this.form_empresa.invalid || this.form_firma.invalid){
      markFormGroupTouched(this.form_empresa);
      markFormGroupTouched(this.form_firma);
      return;
    }

    if(this.array_retiros.length == 0 && this.array_entregas.length == 0){
      this.renglones_validate = true;
      return;
    }

    this.btnGenerar = false; 

    let array_renglones = [];

    this.array_retiros.forEach(function(element) {
      let renglon = new Renglon(
        element.select_accion, 
        element.select_unidad, 
        element.codigo, 
        element.estado,
        null,
        null,
        null,
        null
      );
      array_renglones.push(renglon);
    });

    this.array_entregas.forEach(function(element) {
      let renglon = new Renglon(
        element.select_accion, 
        element.select_unidad, 
        element.codigo, 
        element.estado,
        null,
        null,
        null,
        null
      );
      array_renglones.push(renglon);
    });

    const recibo = new Recibo(
      this.nom_empresa, // 
      this.form_empresa.controls.empresa_email.value, //
      this.form_empresa.controls.empresa_envio.value, //
      this.form_empresa.controls.empresa_fecha.value.toISOString().slice(0, 19).replace('T', ' '), //
      array_renglones, //
      this.form_firma.controls.firma_nombre.value, //
      this.form_firma.controls.firma_apellido.value, //
      this.firma, //
      this.form_empresa.controls.empresa_telefono.value, //
      this.form_empresa.controls.empresa_responsable.value, //
      this.form_empresa.controls.empresa_direccion.value, //
      this.form_empresa.controls.empresa_razon.value, //
      this.form_empresa.controls.empresa_nombre.value, //
      this.observaciones, //
      this.enviar_email,
      this.usuario_creador._id,
      null //
    );

    
    this._reciboService.crearRecibo( recibo )
        .subscribe( (resp:any) => {
      
                this.btnGenerar = true; 
                console.log(resp);

                if(resp.Recibo.affectedRows === 1){
                  this.notificaciones.push({tipo: "exito", mensaje:"Se ingresó el recibo con exito."});
                } else {
                  this.notificaciones.push({tipo: "error", mensaje:"Ocurrió un error al ingresar el recibo."});
                }

                if (typeof resp.email_info !== "undefined") {
  
                  if(resp.email_info.accepted.length === 1){
                    this.notificaciones.push({tipo: "exito", mensaje:"Se envió el recibo al e-mail con exito."});
                  } else {
                    this.notificaciones.push({tipo: "error", mensaje:"Ocurrió un error al enviar el recibo al e-mail."});
                  }

                }

                this.openDialogEstado( this.notificaciones );
                this.notificaciones = [];

                this.form_empresa.reset();
                this.form_empresa.markAsPristine();
                this.form_empresa.markAsUntouched();
                this.eliminarFirma();
                this.form_firma.reset();
                this.form_firma.markAsPristine();
                this.form_firma.markAsUntouched();
                this.array_retiros = [];
                this.array_entregas = [];
                this.count_retiros_box = 0;
                this.count_retiros_doc = 0;
                this.count_entregas_box = 0;
                this.count_entregas_doc = 0;
                this.observaciones = '';
                this.renglones_validate = false; 

              });

  }

  openDialogEstado( mensajes: Array<any>): void {
    const dialogRef = this.dialog.open(DialogEstado, {
      width: '400px',
      data: mensajes
    });

  }


  openDialogCodigo(): void {
    const dialogRef = this.dialog.open(DialogCodigo, {
      // height: '800px',
      width: '400px',
      data: {codigo: this.codigo}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codigo = result; // se puede agregar result al arreglo directamente.
    });
  }

  agregarRenglon( codigo ){

    if( this.form_renglon.invalid ){
      markFormGroupTouched(this.form_renglon);
      return;
    }
         
    this.estado = '';

    this._etiquetaService.obtenerEtiquetaLote( codigo )
                .subscribe( (resp:any) => {

        if(resp === undefined){
          this.estado = 'sinCoincidencia';
        } else {
          if (resp.fecha_baja_lote === null && resp.fecha_baja === null && resp.tipo == this.select_unidad){
            this.estado = 'sinProblemas';          
          }else {
            this.estado = 'algunosProblemas';          
          }
        }
      
        this.renglon = { select_accion: this.select_accion, select_unidad: this.select_unidad, codigo: this.codigo, estado: this.estado };
    
        if(this.renglon.select_accion == "retiro"){
          this.renglones_validate = false; 
          this.array_retiros.push(this.renglon);
          if(this.renglon.select_unidad == "Caja"){
            this.count_retiros_box++;      
          } else {
            this.count_retiros_doc++;
          }
        }
        
        if(this.renglon.select_accion == "entrega") {
          this.renglones_validate = false; 
          this.array_entregas.push(this.renglon);
          if(this.renglon.select_unidad == "Documento"){
            this.count_entregas_doc++;      
          } else {
            this.count_entregas_box++;
          }
        }
        
        this.codigo = '';
        this.codigo_formControl.markAsUntouched();
        this.codigo_formControl.markAsPristine();
                  
    });

  }

  eliminarRenglon( tipoAccion:string , tipoUnidad: string, index:number ){

    if( tipoAccion == "tipoEntrega"){
      this.array_entregas.splice( index, 1 );
      if(tipoUnidad == "Caja"){
        this.count_entregas_box--;
      } else {
        this.count_entregas_doc--;
      }
    }
    
    if(tipoAccion == "tipoRetiro") {
      this.array_retiros.splice( index, 1 );
      if(tipoUnidad == "Documento"){
        this.count_retiros_doc--;      
      } else {
        this.count_retiros_box--;
      }
    }

    if(this.array_retiros.length == 0 && this.array_entregas.length == 0){
      this.renglones_validate = true;
    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFirma, {
      // height: '500px',
      width: '400px',
      data: {firma: this.firma, btnVerFirma: this.btnVerFirma, imgDir: this.imgDir}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result != undefined  || result == ''){
        this.btnVerFirma = true;
      }
      this.firma = result;
      this.imgDir = URL.createObjectURL(this.firma);
    });
  }

  openDialogFirma(): void {
    this.dialog.open(DialogFirma, {
      // height: '500px',
      width: '400px',
      data: {firma: this.firma, btnVerFirma: this.btnVerFirma, imgDir: this.imgDir}
    });
  }
  
  eliminarFirma(){
    this.btnVerFirma = false;
    this.firma = undefined;
    this.imgDir = '';
  }

}

@Component({
  selector: 'dialog-firma',
  templateUrl: 'dialog-firma.component.html',
})
export class DialogFirma {

  imgDir: string;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions = {
    'minWidth': 2,
    penColor: 'rgb(66, 133, 244)',
    backgroundColor: 'rgb(243,235,235)',
    canvasWidth: 270,
    canvasHeight: 300
  };
  
  constructor(
    public dialogRef: MatDialogRef<DialogFirma>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer:DomSanitizer
    ) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    sanitize(url:string){
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    verImagen( imagen ){
      URL.createObjectURL(imagen);
    }
    
    eliminarFirma(){
      this.signaturePad.clear();
    }
    
    generarFirma(){
      const base64 = this.signaturePad.toDataURL('image/png', 0.5);

      const blob = this.base64toBlob(base64);

      this.data.firma = blob;
  
      this.dialogRef.close(this.data.firma);
    }
  
  base64toBlob( b64Data ){
    
    const byteCharacters = atob(b64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    return new Blob([byteArray], {type: "image/png;base64"});
  }
  
}


@Component({
  selector: 'dialog-codigo',
  templateUrl: 'dialog-codigo.component.html',
})
export class DialogCodigo {

  estado_escaner: boolean = false;
  noTieneCodigo: boolean = true;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;
  
  constructor(
    public dialogRef: MatDialogRef<DialogCodigo>,
    @Inject(MAT_DIALOG_DATA) public data: Code
    ) {}
  
    ngOnInit(): void {

      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasDevices = true;
        this.availableDevices = devices;
      });
  
      this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
      this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
      this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
    }
  
    displayCameras(cameras: MediaDeviceInfo[]) {
      console.debug('Devices: ', cameras);
      this.availableDevices = cameras;
    }
  
    handleQrCodeResult(resultString: string) {
      console.debug('Result: ', resultString);
      this.qrResultString = resultString;
      // VER ESTE AGREGADO
      this.data.codigo = resultString;
      this.noTieneCodigo = false;
    }
  
    onDeviceSelectChange(selectedValue: string) {
      console.debug('Selection changed: ', selectedValue);
      this.currentDevice = this.scanner.getDeviceById(selectedValue);
    }
  
    stateToEmoji(state: boolean): string {
  
      const states = {
        // not checked
        undefined: '❔',
        // failed to check
        null: '⭕',
        // success
        true: '✔',
        // can't touch that
        false: '❌'
      };
  
      return states['' + state];
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    state(){

      if(this.estado_escaner){
        this.estado_escaner = false;
      } else {
        this.estado_escaner = true;
      }

    }

}

@Component({
  selector: 'dialog-estado',
  templateUrl: 'dialog-estado.component.html',
})
export class DialogEstado {

  constructor(
    public dialogRef: MatDialogRef<DialogEstado>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    ngOnInit(): void {

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
