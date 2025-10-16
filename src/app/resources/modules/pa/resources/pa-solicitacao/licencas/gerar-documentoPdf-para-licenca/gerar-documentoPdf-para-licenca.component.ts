import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TipoPessoajuridicaService } from '../../../../../../../shared/services/config/TipoPessoafisica.service';
import { LicencaParaFuncionarioService } from '../../../../../sigpq/core/service/Licenca-funcionario.service';

@Component({
  selector: 'pa-sigpq-documentoPdf-para-licenca',
  templateUrl: './gerar-documentoPdf-para-licenca.component.html',
  styleUrls: ['./gerar-documentoPdf-para-licenca.component.css']
})
export class GerarDocumentoPdfParaLicencaComponent implements OnInit,OnChanges  {

  constructor(private licencaParaFunncionarios:LicencaParaFuncionarioService,private tipoPessoaJuridica:TipoPessoajuridicaService) { }
  @Input()agenteSelecionado:any
  @Input()dadosParaPesquisa!:{'tipo_licenca_id':number|string,'pessoafisica_id':number|string,'pessoajuridica_id':number|string,'ano':number|string}
  email_instituicao:string='dpq@pn.gov.ao'
  year:number=new Date().getFullYear();
  day:number=new Date().getDate()
  comandante!:{cargo_nome:string,patente_nome:string,nome_completo:string,apelido:string}
  quantidadeDeDiasDeFerias:number=0
  diaInicioDeFerias:string=''
  diaFimDeFerias:string=''
  isLoading:boolean=true
  diasSelecionadosParaFerias:any
  filtro={
    tipo_licenca_id:'null',
    pessoafisica_id:'null',
    ano:'null',
    pessoajuridica_id:'null'
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se o modalData foi alterado
    if (changes['agenteSelecionado']) {
      this.checkModalData();
    }

    if (changes['dadosParaPesquisa']) {
      this.loadingDadosDaPesquisa();
    }
  }

  ngOnInit() {

  }

  private checkModalData(): void {
    if (this.agenteSelecionado) {
      this.isLoading=false
      this.SaberQuemMandaNoOrgaoComBaseNaPessoaFisica()
      // Aqui você pode adicionar o código que deseja executar quando modalData estiver disponível
    }
  }

  private loadingDadosDaPesquisa()
  {
    if(this.dadosParaPesquisa?.pessoafisica_id && this.dadosParaPesquisa?.ano && this.dadosParaPesquisa?.tipo_licenca_id)
    {
      this.filtro.tipo_licenca_id=this.dadosParaPesquisa.tipo_licenca_id.toString()
      this.filtro.pessoafisica_id=this.dadosParaPesquisa.pessoafisica_id.toString()
      this.filtro.ano=this.dadosParaPesquisa.ano.toString()
      this.licencaParaFunncionarios.saberDiasDeFerias(this.filtro).pipe().subscribe({
        next: (response: any) => {
          this.diasSelecionadosParaFerias=response
          this.ajustarTotalDeDiasParaFeriasInicioEFimDeFerias()
        }
      })
    }
  }

  public atualizarTodosOsDados()
  {
    this.loadingDadosDaPesquisa()
    this.SaberQuemMandaNoOrgaoComBaseNaPessoaFisica()
  }

  private SaberQuemMandaNoOrgaoComBaseNaPessoaFisica()
  {

    if(this.agenteSelecionado)
    {
      const filtro={
        pessoajuridica_id:this.agenteSelecionado.sigpq_tipo_orgao.id
      }

      this.tipoPessoaJuridica.saberEntidadeMaximaDoOrgaoPorIntermedioDoId(filtro).pipe().subscribe({
        next: (response: any) => {
         this.comandante=response
        }
      })
    }

  }


  ajustarTotalDeDiasParaFeriasInicioEFimDeFerias()
  {
    this.quantidadeDeDiasDeFerias=this.diasSelecionadosParaFerias.length
    if(this.quantidadeDeDiasDeFerias>0)
    {
     this.diaInicioDeFerias=this.formatDateToExtenso(this.diasSelecionadosParaFerias[0].dia_selecionado)
     this.diaFimDeFerias = this.formatDateToExtenso(this.diasSelecionadosParaFerias[this.diasSelecionadosParaFerias.length - 1].dia_selecionado);
    }

  }

  calcularTempoDeServico(dataAdesao: string): number {
    // Dividindo a data pela barra para obter o dia, mês e ano
    const [dia, mes, ano] = dataAdesao.split('/').map(Number);

    // Criando um objeto Date com a data de adesão
    const dataInicio = new Date(ano, mes - 1, dia); // mes - 1 porque os meses começam do 0
    const dataAtual = new Date();

    // Calculando a diferença em anos, meses e dias
    let anos = dataAtual.getFullYear() - dataInicio.getFullYear();
    let meses = dataAtual.getMonth() - dataInicio.getMonth();
    let dias = dataAtual.getDate() - dataInicio.getDate();

    // Ajustando os valores se a diferença de meses ou dias não for válida
    if (dias < 0) {
      meses--;
      const ultimoDiaDoMesAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0).getDate();
      dias += ultimoDiaDoMesAnterior;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }
    return anos;
  }

  obterDiasAdicionais(anos: number): string {
    if (anos >= 10 && anos < 20) {
      return 'três';
    } else if (anos >= 20 && anos < 30) {
      return 'seis';
    } else if (anos >= 30 && anos < 40) {
      return 'nove';
    }else if (anos >= 40 && anos < 50) {
      return 'doze';
    }else if (anos >= 50 && anos < 60) {
      return 'quinze';
    } else {
      return 'zero'; // Para anos fora dos intervalos
    }
  }

  converterParaNumber(data:string):number{
    return Number(data)
  }

  getYear(data:string,pretende:'ANO'|'TOTALDIAS_ADICIONAIS'|'TOTAL_ANO'='ANO'):string
  {
    if(pretende=='ANO')return data.split('/')[2]
    if(pretende=='TOTAL_ANO')return this.calcularTempoDeServico(data).toString()
    else return this.obterDiasAdicionais(this.calcularTempoDeServico(data));
  }

  formatDateToExtenso(dateString: string): string {
    // Cria um objeto Date a partir da string
    const date = new Date(dateString);

    // Array com os nomes dos meses
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Obtém o dia, mês e ano
    const dia = String(date.getDate()).padStart(2, '0'); // Formata o dia para ter 2 dígitos
    const mes = meses[date.getMonth()]; // Obtém o nome do mês
    const ano = date.getFullYear(); // Obtém o ano

    // Retorna a data formatada por extenso
    return `${dia} de ${mes} de ${ano}`;
}

closeModal(modalName:string) {
  const modal = document.getElementById(modalName);
  if (modal) {
    modal.style.display = 'none'; // Fecha o modal
    this.quantidadeDeDiasDeFerias=0
    this.diaInicioDeFerias=''
    this.diaFimDeFerias = ''
  }
}




}
