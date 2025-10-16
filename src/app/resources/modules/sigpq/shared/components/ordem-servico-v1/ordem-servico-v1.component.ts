import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AppConfig } from '../../../../../../config/app.config';

@Component({
  selector: 'app-ordem-servico',
  templateUrl: './ordem-servico-v1.component.html',
  styleUrls: ['./ordem-servico-v1.component.css'],
})
export class OrdemServicoV1Component implements OnChanges, OnDestroy {
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

  constructor(private provimentoService: ProvimentoService) {
    this.destory$ = new Subject<void>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['ordem'].previousValue != changes['ordem'] &&
      this.ordem != null
    ) {
      this.buscarAgentes();
    }
  }

  public get getNumero(): string {
    return this.ordem?.ordem_descricao!;
  }

  private buscarAgentes() {
    this.isLoading = true;

    const options = { numero: this.getNumero };
    this.provimentoService
      .listar_promocao_emTempo(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),

        takeUntil(this.destory$)
      )
      .subscribe((response: any) => {
        console.log(response);
        this.orgaos = Object.keys(response[0]?.orgaos);
        this.agentes = response[0]?.orgaos;
      });
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
