import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { CargosService } from '@resources/modules/sigpq/core/service/Cargos.service';
import { FuncaoService } from '@resources/modules/sigpq/core/service/Funcao.service';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';

import { finalize } from 'rxjs';
import { CursoFuncionarioService } from '../../../../../sigpq/core/service/Curso-Funcionario.service';
import { ProcessoIndividualService } from '../../../../../sigpq/core/service/Processo-Individual.service';
import { AgregadoFamiliarService } from '../../../../../sigpq/core/service/Agregado-Familiar.service';

@Component({
  selector: 'app-extrato-agente',
  templateUrl: './extrato-agente.component.html',
  styleUrls: ['./extrato-agente.component.css']
})
export class ExtratoAgenteComponent implements OnChanges {



  @Input() public pessoaId: any;
  @Input() public options: any
  public isLoading: boolean = false;
  public isLoadingCivil: boolean = false;
  public isLoadingEfectivo: boolean = false;
  public fileUrl: any;
  public fileUrlCivil: any;
  public funcaos: any
  public cargos: any
  public cursos:any
  public cursosAcademicos:any
  public cursosPoliciais:any
  public documentos: any = []
  public mobilidades:any
  public provimentos: any
  public agregadosFamiliares: any = []

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

  constructor(private readonly secureService: SecureService,
    private ficheiroService: FicheiroService,
    private formatarData: FormatarDataHelper,
    private mobilidadeService:MobilidadeService,
    private funcionarioService: FuncionarioService,
    private processoService: ProcessoIndividualService,
    private funcaoService: FuncaoService, public formatarDataHelper: FormatarDataHelper,
    private agregadoFamiliarService: AgregadoFamiliarService,
    private cargoService: CargosService, private provimentoService: ProvimentoService,private cursoFuncionariosService: CursoFuncionarioService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaId'].previousValue != changes['pessoaId'].currentValue) {
      // this.imprimir()
      this.buscarFuncionario()
      this.buscarFuncao()
      this.buscarProvimento()
      this.buscarCargos()
      this.buscarMobilidade();
      this.buscarCursos();
      this.buscarProcessoIndividual();
      this.buscarAgregadoFamiliares();

    }
  }


  private buscarMobilidade() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.mobilidadeService
      .listarPorPessoa(opcao)
      .subscribe((response) => {

        this.mobilidades = response;

      })
  }

  private buscarAgregadoFamiliares() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.agregadoFamiliarService.listar(opcao).pipe().subscribe({
      next: (response: any) => {


        this.agregadosFamiliares = response
      }
    });

  }


  private buscarProcessoIndividual() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }

    this.processoService.listar(opcao).pipe(
      finalize(() => {
      })
    )
      .subscribe((response) => {

        this.documentos = response.filter((documento: any) => {
          // Use includes para verificar se o valor está presente no array
          if (['Pessoal', 'Profissional'].includes(documento.nid)) {
            return true; // Retorna true para incluir o documento no resultado
          } else {
            return false; // Retorna false para excluir o documento do resultado
          }
        });


      })

  }

  private buscarFuncao() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.funcaoService
      .listarTodos(opcao)
      .subscribe((response) => {

        this.funcaos = response;


      })
  }
  private buscarProvimento() {
    const options = {

      pessoa_id: this.getPessoaId
    }
    this.provimentoService
      .listarTodos(options)
      .subscribe((response) => {
        this.provimentos = response;
      })

  }
  private buscarCargos() {
    const opcao = {

      pessoafisicaId: this.getPessoaId
    }
    this.cargoService
      .listarTodos(opcao)
      .subscribe((response) => {


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
    ).subscribe((file) => {
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
    ).subscribe((file) => {
      this.fileUrlCivil = this.ficheiroService.createImageBlob(file);
    });
  }
  public get getPessoaId() {
    return this.pessoaId
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
    return gender == 'm' ? 'Masculino' : gender == 'f' ? 'Femenino' :   undefined;
  }

  private buscarCursos() {
    const opcao = {

      pessoafisica_id: this.getPessoaId
    }

    this.cursoFuncionariosService.listar(opcao).pipe(
      finalize(() => {
      })
    )
      .subscribe((response) => {
        this.cursos = response
        this.cursosAcademicos = this.cursos.filter((curso: any) => curso.sigpq_tipo_curso_id === 22);
        this.cursosPoliciais = this.cursos.filter((curso: any) => curso.sigpq_tipo_curso_id === 98);

      })



  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }

  public getCurrentDate()
  {
    const now = new Date();

// Obter horas, minutos e segundos
const hours = String(now.getHours()).padStart(2, '0'); // Horas
const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutos
const seconds = String(now.getSeconds()).padStart(2, '0'); // Segundos

const date=new Date().toLocaleDateString('pt-BR');
// Formatar a hora no formato HH:MM:SS
const formattedTime = `${date} ${hours}:${minutes}:${seconds}`;
    return formattedTime
  }

  public getNameUser()
  {
    const user=this.secureService.getTokenValueDecode().user
    return user?.nome_completo;
  }


  isDropdownOpen = true;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  carta_conducao:boolean=false
  morada:boolean=false
  filiacao:boolean=false
  onOptionCheck(option: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    switch (option)
    {
      case 'FILIACAO':this.filiacao=isChecked; break;
      case 'MORADA': this.morada=isChecked; break;
      case 'CARTA-DE-CONDUCAO': this.carta_conducao=isChecked; break;
    }
    // Lógica para lidar com a seleção da opção
    //console.log(`${option} is ${isChecked ? 'checked' : 'unchecked'}`);
    // Você pode armazenar o estado em um array ou objeto, se necessário
}

}

