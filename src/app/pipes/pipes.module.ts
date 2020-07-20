import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { NombreLugarPipe } from './nombre-lugar.pipe';

@NgModule({
  imports: [],
  declarations: [
    ImagenPipe,
    NombreLugarPipe
  ],
  exports: [
    ImagenPipe,
    NombreLugarPipe
  ]
})
export class PipesModule { }
