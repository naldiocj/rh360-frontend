import { Injectable } from '@angular/core';
import { ArmaService } from './arma.service';
import { AtribuicaoArmasService } from './atribuicao-armas.service';
import { CalibreService } from './calibre.service';
import { ClassificacaoArmasService } from './classificacao-armas.service';
import { ComandoService } from './comando.service';
import { EsquadrasService } from './esquadras.service';
import { MarcaService } from '@resources/modules/sigt/core/service/configuracao/marca.service';
import { RelatorioService } from './relatorio.service';
import { TiposArmasService } from './tipos-armas.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseSigaeService {
link:any;
  constructor(private porta:HttpClient ) { 
this.link='http://localhost:3334/api/v1/sigae/armas';
              //importei todas as armas para uma unica classe para poder ter aceso a todos seus metodos
            }


adicionar (item:any){
this.porta.post<any>('${link}/',item)
  .subscribe(arg => console.log(arg));


}


















            
}
