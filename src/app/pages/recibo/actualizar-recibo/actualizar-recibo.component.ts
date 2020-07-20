import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa.model';
import { Renglon, markFormGroupTouched, DialogEstado, DialogCodigo, DialogFirma } from '../agregar-recibo/agregar-recibo.component';
import { MatDialog } from '@angular/material';
import { EmpresaService, UsuarioService, EtiquetaService, ReciboService } from 'src/app/services/service.index';
import { Renglon as RenglonModel} from 'src/app/models/renglon.model';
import { ReciboModificado } from 'src/app/models/recibomodificado.model';
import { Recibo } from 'src/app/models/recibo.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-actualizar-recibo',
  templateUrl: './actualizar-recibo.component.html',
  styles: []
})
export class ActualizarReciboComponent implements OnInit {

  usuario_creador:any;
  reciboId: Recibo = new Recibo('', '', '', '', null, '', '', null, '', '', '', '', '', '', null, '', '', '', '');

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

  constructor(
    public dialog: MatDialog,
    public _empresaService: EmpresaService,
    public _usuarioService: UsuarioService,
    public _etiquetaService: EtiquetaService,
    public _reciboService: ReciboService,
    public _activatedRoute: ActivatedRoute,
    private sanitizer:DomSanitizer
    ) {

      _activatedRoute.params.subscribe( params => {
        let id = params['id'];
        this.cargarReciboId( id );
        this.cargarRenglones( id );
      });

    }

  cargarReciboId( id: string ) {
    this._reciboService.obtenerRecibo( id )
          .subscribe( (resp:any) => { 
                this.reciboId = resp

                if(this.reciboId.firma !== null){
                  this.btnVerFirma = true;
                  // VER
                }
          });
  }
  
  cargarRenglones( id: string ) {
    this._reciboService.obtenerRenglones( id )
          .subscribe( (resp:any) => { 

            var entregas = [];
            var retiros = [];

            var retiros_box = 0;
            var retiros_doc = 0;
            var entregas_box = 0;
            var entregas_doc = 0;

            resp.forEach(function(element, index) {

              if(element.select_accion == "entrega"){
                entregas.push(element);
                if(element.select_unidad == "Caja"){
                  entregas_box++;
                } else{
                  entregas_box++;
                }
              }

              if(element.select_accion == "retiro"){
                retiros.push(element);
                if(element.select_unidad == "Caja"){
                  retiros_box++;
                } else{
                  retiros_doc++;
                }
              }
              
            });

            this.array_entregas = entregas;
            this.array_retiros = retiros;

            this.count_retiros_box = retiros_box;
            this.count_retiros_doc = retiros_doc;
            this.count_entregas_box = entregas_box;
            this.count_entregas_doc = entregas_doc;

          });
  }


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

    
  }

  anularRenglon( tipoAccion:string , tipoUnidad: string, index:number ){
    
    if( tipoAccion == "tipoEntrega"){
      this.array_entregas[index].usuario_baja = "dstorres"
      if(tipoUnidad == "Caja"){
        this.count_entregas_box--;
      } else {
        this.count_entregas_doc--;
      }
    }
    
    if(tipoAccion == "tipoRetiro") {
      this.array_entregas[index].usuario_baja = "dstorres"
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

  restaurarRenglon( tipoAccion:string , tipoUnidad: string, index:number ){

    // if( tipoAccion == "tipoEntrega"){
    //   this.array_entregas.splice( index, 1 );
    //   if(tipoUnidad == "Caja"){
    //     this.count_entregas_box++;
    //   } else {
    //     this.count_entregas_doc++;
    //   }
    // }
    
    // if(tipoAccion == "tipoRetiro") {
    //   this.array_retiros.splice( index, 1 );
    //   if(tipoUnidad == "Documento"){
    //     this.count_retiros_doc++;      
    //   } else {
    //     this.count_retiros_box++;
    //   }
    // }

    // if(this.array_retiros.length == 0 && this.array_entregas.length == 0){
    //   this.renglones_validate = true;
    // }

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

    const recibo = new ReciboModificado(
      this.form_empresa.controls.empresa_fecha.value.toISOString().slice(0, 19).replace('T', ' '), //
      this.observaciones,
      this.enviar_email
    );

    
    this._reciboService.actualizarRenglon( this.reciboId._id, recibo )
        .subscribe( (resp:any) => {
      
                this.btnGenerar = true; 

                console.log(resp);

                // if(resp.Recibo.affectedRows === 1){
                //   this.notificaciones.push({tipo: "exito", mensaje:"Se ingresó el recibo con exito."});
                // } else {
                //   this.notificaciones.push({tipo: "error", mensaje:"Ocurrió un error al ingresar el recibo."});
                // }

                // if (typeof resp.email_info !== "undefined") {
  
                //   if(resp.email_info.accepted.length === 1){
                //     this.notificaciones.push({tipo: "exito", mensaje:"Se envió el recibo al e-mail con exito."});
                //   } else {
                //     this.notificaciones.push({tipo: "error", mensaje:"Ocurrió un error al enviar el recibo al e-mail."});
                //   }

                // }

                this.openDialogEstado( this.notificaciones );
                this.notificaciones = [];

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

  openDialogFirma(): void {
    this.dialog.open(DialogFirma, {
      // height: '500px',
      width: '400px',
      data: {firma: this.firma, btnVerFirma: this.btnVerFirma, imgDir: this.imgDir}
    });
  }

}
