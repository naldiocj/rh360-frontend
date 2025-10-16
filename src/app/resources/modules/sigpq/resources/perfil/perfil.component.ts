import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { AppConfig } from '../../../../../config/app.config';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  fileUrl: any = null;
  public tabCount: number = 0;
  public funcionario: any;
  public provimentos: any;
  public isLoading: boolean = false;
  public totalEventoPendente: number = 0;
  public foto_efectivo: any = null;
  public foto_agente: any = null;
  public abrir: boolean = false;
  public func: any;
  public isEfectivo: boolean = false;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  public optionsExportar: any = {
    extracto: false,
    pessoal: false,
    profissional: false,
    provimento: false,
    funcao: false,
  };

  public ordens: any = {
    pessoal: 1,
    profissional: 1,
    provimento: 1,
    funcao: 1,
  };

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  imgUser = AppConfig.imgUser; /* Ex: Imagem user */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */
  useGradient = AppConfig.useGradient; /* Ex: COR DO GRADIENTE */
  colorPainel = AppConfig.colorPainel; /* Ex: COR DO PAINEL */

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(
    private funcionarioServico: FuncionarioService,
    private ficheiroService: FicheiroService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private location: Location,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.buscarFuncionario();
    /* Configurando a variavel do css com render */
    document.documentElement.style.setProperty('--use-color', AppConfig.useColor);
    document.documentElement.style.setProperty('--use-gradiente', AppConfig.useGradient);
  }

  voltar() {
    this.location.back();
  }

  verFoto(urlAgente: any): boolean | void {
    this.isEfectivo = !this.isEfectivo;
    if (!urlAgente) return false;

    const opcoes = {
      pessoaId: this.funcionario.id,
      url: urlAgente,
    };

    this.isLoading = true;

    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });
  }

  buscarFuncionario() {
    this.isLoading = true;
    this.funcionarioServico
      .buscarUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          const exiteImagem =
            this.funcionario?.foto_efectivo || this.funcionario?.foto_civil;
          this.verFoto(exiteImagem);
        })
      )
      .subscribe((response) => {
        console.log("FUNCIONARIO SELECIONADO:", response)
        this.funcionario = response;
      });
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionario();
  }

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }

  actualizarVisaoDaFoto(opcao: string) {
    this.fileUrl = this.ficheiroService.createImageBlob(opcao);
  }
  public get getTipo() {
    return this.route.snapshot.params['tipo'] as string;
  }

  public async resize() {
    this.abrir = true;
  }

  public changeAbrir(event: any) {
    this.abrir = false;
  }

  setFotoFuncionario(item: any, id: any) {
    this.func = item;
    const image: HTMLDivElement = document.querySelector(
      `#${id}`
    ) as HTMLDivElement;

    image.classList.toggle('d-none');
  }

  setNullFuncionario() {
    this.func = null;
  }

  setDisplayNone(event: any) {
    const image: HTMLDivElement = document.querySelector(
      `#${event}`
    ) as HTMLDivElement;

    image.classList.toggle('d-none');
  }

  public onCheck(event: any) {
    this.optionsExportar[event.target.getAttribute('id')] =
      event.target.checked;
    console.log(this.optionsExportar);
  }

  public get ePerfil() {
    return !this.getTipo;
  }

  public get eMobilidade() {
    return this.getTipo.toString().toLocaleLowerCase().includes('mobilidade');
  }
  public get eProvimento() {
    return this.getTipo.toString().toLowerCase().includes('provimento');
  }

  public get mostraMobilidade() {
    return this.ePerfil || this.eMobilidade
  }
  public get mostraProvimento() {
    return this.ePerfil || this.eProvimento
  }

  public capitalize(text: string) {
    return this.utilService.getCapitalize(text)
  }
}
