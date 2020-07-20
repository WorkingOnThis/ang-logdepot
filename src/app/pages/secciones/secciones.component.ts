import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
// import { UsuarioService, SeccionesService } from 'src/app/services/service.index';
import { EmpresaService, UsuarioService, SeccionesService } from '../../services/service.index';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Area } from '../../models/area.model';
import { TipoDocumento } from '../../models/tipo-documento.model';

import swal from 'sweetalert2';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styles: []
})
export class SeccionesComponent implements OnInit {

  areaexpanded: boolean = true;

  forma: FormGroup;

  empresas: Empresa[] = [];

  empresaSelec: Empresa = new Empresa('');

  formulario: any[] = [];

  areasytipos: any[] = [];

  areasola: Array<Area> = [];

  temp: any[] = [];

  tiposolo: Array<TipoDocumento> = [];

  constructor(
    public _usuarioService: UsuarioService,
    public _empresaService: EmpresaService,
    public _seccionesService: SeccionesService
  ) { }

  ngOnInit() {

    this.forma = new FormGroup({
      area: new FormControl,
      tipos: new FormArray([])  });

    this._usuarioService.cargarEmpresas()
    .subscribe( (resp:any) => {
      this.empresas = resp.listaodempresas
    });

  }

  cambioEmpresa( id: string ){
    this._empresaService.cargarEmpresa( id )
                .subscribe( empresa => {
                  this.areasola = [];
                  this.empresaSelec = empresa;
                  this.cargarAreas(id)
                });

  }

  agregartipos(){
      (<FormArray>this.forma.get('tipos')).push(new FormControl);
  }

  eliminartipos( index ){
    (<FormArray>this.forma.get('tipos')).removeAt(index);
  }

  cargarAreas( id: string ) {
    this._seccionesService.obtenerAreas( id )
          .subscribe( (resp:any) => {
            this.areasytipos = [];
            this.areasola = []; 
            this.tiposolo = [];
            this.temp = []; 

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

  guardarArea( id: string) {

    this.formulario = [];
  
    const area = new Area (
      this.forma.value.area,
      id
    );

    this.formulario.push(area);

    for (let entry of this.forma.value.tipos) {

      const tipos = new TipoDocumento (
        entry
      )

      this.formulario.push(tipos);
    }

    console.log( this.formulario );

    this._seccionesService.crearArea( this.formulario )
              .subscribe( resp => { 
                this.formulario = [];
                console.log( resp );
                this.cargarAreas(id);

                swal({
                  title: 'Sección creada',
                  text: 'Se ha generado una nueva sección.',
                  type: 'success',
                  confirmButtonText: 'Ok'
                })

                this.forma.reset();
                this.forma.markAsPristine();
                this.forma.markAsUntouched();
               });
    
  }

  // formData() { return this.forma.get('tipos'); }

}
