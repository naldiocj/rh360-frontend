import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapComponent } from './map/map.component';
import { FichaOcorrenciasComponent } from './ficha-ocorrencias/ficha-ocorrencias.component';
import { RelatorioOcorrenciasComponent } from './relatorio-ocorrencias/relatorio-ocorrencias.component';
import { ImagemViewerComponent } from './imagem-viewer/imagem-viewer.component';
import { PreviewImgComponent } from './preview-img/preview-img.component';
import { BoletimDelituosoComponent } from './delituoso/boletim-delituoso/boletim-delituoso.component';
import { ProcuradosComponent } from './delituoso/procurados/procurados.component';
import { MinMapComponent } from './map/min-map/min-map.component';
import { DelituosoPreviewComponent } from './delituoso/delituoso-preview/delituoso-preview.component';
import { MapPiqueteComponent } from './map/map-piquete/map-piquete.component';
import { GuiaApresentacaoComponent } from './guia-apresentacao/guia-apresentacao.component';
import { TelefoneMaskDirective } from '../directives/telefone-mask.directive';
import { ZonaCizentaComponent } from './map/zona-cizenta/zona-cizenta.component';
import { FileSizePipe } from '../Pipe/file-size/file-size.pipe';
import { BuscasComponent } from './buscas/buscas.component';
import { BuscaBiometricasComponent } from './buscas/busca-biometrica/busca-biometrica.component';
import { BuscaBiComponent } from './buscas/busca-delituoso-bi/busca-delituoso-bi.component';
import { BuscaVozComponent } from './buscas/busca-delituoso-voz/busca-delituoso-voz.component';
import { BuscaFacialComponent } from './buscas/busca-facial-delituoso/busca-facial-delituoso.component';
 

@NgModule({
  declarations: [
    FichaOcorrenciasComponent,
    RelatorioOcorrenciasComponent,
    MapComponent,
    ImagemViewerComponent,
    PreviewImgComponent,
    BoletimDelituosoComponent,
    ProcuradosComponent,
    MinMapComponent,
    DelituosoPreviewComponent,
    MapPiqueteComponent,
    GuiaApresentacaoComponent,
    TelefoneMaskDirective,
    ZonaCizentaComponent,
    BuscaBiometricasComponent,
    BuscaBiComponent,
    BuscaFacialComponent,
    BuscaVozComponent,
    BuscasComponent,
    FileSizePipe
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module
  ]
  , exports: [
    FichaOcorrenciasComponent,
    RelatorioOcorrenciasComponent,
    ImagemViewerComponent,
    PreviewImgComponent,
    BoletimDelituosoComponent,
    ProcuradosComponent,
    MapComponent,
    MinMapComponent,
    MapPiqueteComponent,
    DelituosoPreviewComponent,
    GuiaApresentacaoComponent,
    TelefoneMaskDirective,
    ZonaCizentaComponent,
    FileSizePipe
  ]
})
export class SharedcomponentsModule { }
