import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { CargosService } from '@resources/modules/sigpq/core/service/Cargos.service';
import { FuncaoService } from '@resources/modules/sigpq/core/service/Funcao.service';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';

@Component({
  selector: 'app-relatorio-ocorrencias',
  templateUrl: './relatorio-ocorrencias.component.html',
  styleUrls: ['./relatorio-ocorrencias.component.css']
})
export class RelatorioOcorrenciasComponent implements OnChanges{
  @Input() public ocorrenciaId: any;
  @Input() public options: any
  public isLoading: boolean = false;
  public isLoadingCivil: boolean = false;
  public isLoadingEfectivo: boolean = false;
  public fileUrl: any;
  public fileUrlCivil: any;
  public funcaos: any
  public cargos: any
  public mobilidades:any
  public provimentos: any

  public indexes: any = []

  public funcionario: any

  public optionsExportar: any = {
    extracto: false,
    pessoal: false,
    profissional: false,
    provimento: false,
    funcao: false,
    cargo: false,
    mobilidade: false,
  }

  public ordens: any = {
    pessoal: 1,
    profissional: 1,
    provimento: 1,
    funcao: 1
  }

  constructor(private secureService: SecureService, private ficheiroService: FicheiroService, private formatarData: FormatarDataHelper, private mobilidadeService:MobilidadeService,private funcionarioService: FuncionarioService, private funcaoService: FuncaoService, public formatarDataHelper: FormatarDataHelper, private cargoService: CargosService, private provimentoService: ProvimentoService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  get orgao_nome() {
    return this.secureService.getTokenValueDecode().orgao.nome_completo
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaId'].previousValue != changes['pessoaId'].currentValue) {
      // this.imprimir()
      this.buscarFuncionario()
      this.buscarFuncao()
      this.buscarProvimento()
      this.buscarCargos()
      this.buscarMobilidade();


    }
  }


  private buscarMobilidade() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.mobilidadeService
      .listarPorPessoa(opcao)
      .subscribe((response: any) => {

        
        this.mobilidades = response;


      })
  }

  private buscarFuncao() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.funcaoService
      .listarTodos(opcao)
      .subscribe((response: any) => {

        this.funcaos = response;


      })
  }
  private buscarProvimento() {
    const options = {

      pessoa_id: this.getPessoaId
    }
    this.provimentoService
      .listarTodos(options)
      .subscribe((response: any) => {
        this.provimentos = response;
      })

  }
  private buscarCargos() {
    const opcao = {

      pessoafisicaId: this.getPessoaId
    }
    this.cargoService
      .listarTodos(opcao)
      .subscribe((response: any) => {


        this.cargos = response
      })
  }
  private buscarFuncionario() {
    this.isLoading = true;
    this.funcionarioService.buscarFicha(this.getPessoaId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.verFoto(this.funcionario?.foto_efectivo)
        this.verFotoCivil(this.funcionario?.foto_civil)
        // const exiteImagem = this.funcionario?.foto_efectivo || this.funcionario?.foto_civil
        // this.verFoto(exiteImagem)
      })
    ).subscribe((response: any) => {
      this.funcionario = response;
      // console.log(response)
    });
  }
  verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoadingEfectivo = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingEfectivo = false;
      })
    ).subscribe((file: any) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }
  verFotoCivil(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoadingCivil = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingCivil = false;
      })
    ).subscribe((file: any) => {
      this.fileUrlCivil = this.ficheiroService.createImageBlob(file);
    });
  }
  public get getPessoaId() {
    return this.ocorrenciaId
  }

  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


  public  eData(data: any): boolean {
    return data == null ? false: data != '0000-00-00' ? true : false
  }



  public imprimir = (cv: any) => {
    const paraImprir: any = document.querySelector(`#${cv}`)
    if (paraImprir) {
      setTimeout(()=>{
        document.body.innerHTML = paraImprir.outerHTML
        window.print()
        window.location.reload()
      }, 500)
     
    }
  }

  public onCheck(event: any) {

    this.optionsExportar[event.target.getAttribute('id')] = event.target.checked

    if (event.target.getAttribute('id').toString().toLowerCase() == 'extracto') {
      const checks: Array<HTMLInputElement> = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      if (!checks) return
      checks.forEach((input: any) => {
        if (event.target.getAttribute('id') != input.getAttribute('id')) {
          if (event.target.checked == true) {

            this.optionsExportar[input?.getAttribute('id')] = input.checked = true;
          } else {
            this.optionsExportar[input?.getAttribute('id')] = input.checked = false;
          }
        }
      })
    } else {
      const check: HTMLInputElement = document.querySelector('input[id="extracto"]') as HTMLInputElement

      if (!check) return
      check.checked = true;
      this.optionsExportar['extracto'] = true;

    }
   

  }

  public getGenero(genero: any): any {
    const gender = genero.toString().toLowerCase()
    return gender == 'm' ? 'Masculino' : gender == 'f' ? 'Femenino' : null || undefined;
  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }



}

function finalize(arg0: () => void): any {
  throw new Error('Function not implemented.');
}

