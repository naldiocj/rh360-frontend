import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerCorrespondenciaComponent } from './ver-correspondencia/ver-correspondencia.component';
import { MarchaGuiaComponent } from './marcha-guia/marcha-guia.component';
import { HeaderSigpqComponent } from './header-sigpq/header-sigpq.component';
import { PasseProfissionalComponent } from './passe-profissional/passe-profissional.component';
import { CvComponent } from './cv/cv.component';
import { OrdemServicoV1Component } from './ordem-servico-v1/ordem-servico-v1.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { OrdemServicoV1AgenteComponent } from './ordem-servico-v1-agente/ordem-servico-v1-agente.component';




@NgModule({
  declarations: [
    VerCorrespondenciaComponent,
    MarchaGuiaComponent,
    HeaderSigpqComponent,
    PasseProfissionalComponent,
    CvComponent,
    OrdemServicoV1Component,
    OrdemServicoV1AgenteComponent
  ],
  imports: [
    CommonModule,
    LoadingPageModule
  ],
  exports:[
    VerCorrespondenciaComponent,
    MarchaGuiaComponent,
    HeaderSigpqComponent,
    PasseProfissionalComponent,
    CvComponent,
    OrdemServicoV1Component,
    OrdemServicoV1AgenteComponent
  ]
})
export class ComponentsModule { }
