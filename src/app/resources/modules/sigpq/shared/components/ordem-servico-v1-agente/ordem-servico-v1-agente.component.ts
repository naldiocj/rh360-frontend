import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../../../../../../config/app.config';

@Component({
  selector: 'app-ordem-servico-v1-agente',
  templateUrl: './ordem-servico-v1-agente.component.html',
  styleUrls: ['./ordem-servico-v1-agente.component.css'],
})
export class OrdemServicoV1AgenteComponent implements OnChanges, OnDestroy {
  @Input() ordem: any | null = null;
  private destory$: Subject<void>;
  public isLoading: boolean = false;
  public agentes: any = [];
  public orgaos: any = [];
  public patentes: { [key: string]: any[] } = {};

   tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
    introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
    siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
    logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
    logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
    useColor = AppConfig.useColor; /* Ex: COR DO TEMA */

  constructor() {
    this.destory$ = new Subject<void>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['ordem'].previousValue != changes['ordem'].currentValue &&
      this.ordem != null
    ) {
      console.log(this.ordem);
      this.buscarAgentes();
    }
  }

  public get getNumero(): string {
    return this.ordem?.ordem_descricao!;
  }

  private buscarAgentes() {
    this.orgaos = Object.keys(this.ordem.orgaos);
    this.agentes = this.ordem?.orgaos;
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  public getPatentes(key: any): any {
    if (!key) return;
    const patentes: { [key: string]: any[] } = {};
    function adicionarParaPatentes(key: string, value: object) {
      if (!patentes[key]) {
        patentes[key] = [];
      }

      patentes[key].push(value);
    }

    this.agentes[key].forEach((item: any) => {
      adicionarParaPatentes(`${item?.patente_nome}-${key}`, item);
    });

    this.patentes = patentes;

    return Object.keys(patentes);
  }

  public getAgentes(key: any): any {
    if (!key) return;

    return this.patentes[key];
  }
}
