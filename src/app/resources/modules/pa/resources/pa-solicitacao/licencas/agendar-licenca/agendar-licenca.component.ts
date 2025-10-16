import { Component, OnInit, Input, ViewChild, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { Select2OptionData } from 'ng-select2';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { GerarDocumentoPdfParaLicencaComponent } from '../gerar-documentoPdf-para-licenca/gerar-documentoPdf-para-licenca.component';
import { TipoLicencaParaFuncionarioService } from '../../../../../sigpq/core/service/config/TipoLicenca-para-funcionario.service';
import { LicencaParaFuncionarioService } from '../../../../../sigpq/core/service/Licenca-funcionario.service';
import { FeriadosService } from '../../../../../sigpq/core/service/config/Feriados.service';
import { RelatorioLicencaService } from '../../../../../sigpq/core/service/Relatorio-licenca.service';
import { finalize, first } from 'rxjs';
import { FormatarDataHelper } from '../../../../../../../core/helper/formatarData.helper';
import { calcularDiasUteis } from '../../../../../sigpq/core/helper/calcularDiasUteis';

interface IInputDay{
  day:string,
  descricao:string;
}

interface IInputDay_v2{
  date:string,
  title:string;
}

interface Utilizacao {
  ano: number;
  diasUsados: number;
}

@Component({
  selector: 'pa-agendar-licenca',
  templateUrl: './agendar-licenca.component.html',
  styleUrls: ['./agendar-licenca.component.css'],
})
export class AgendarLicencaComponent implements OnInit,AfterViewInit {

  @ViewChild('licenca_disciplinar_pa', { static: false }) licenca_disciplinarComponent!: GerarDocumentoPdfParaLicencaComponent;
   constructor(private formatDate:FormatarDataHelper, private relatorioService: RelatorioLicencaService,private tipoLicencaFuncionario:TipoLicencaParaFuncionarioService,private licencaparaFuncionario:LicencaParaFuncionarioService,private feriadosService:FeriadosService) {
  }
  fileUrl: any = null
  mensagem_caso_atinja_limite:string="Infelizmente, excedeste ou não há mais dias disponíveis para selecionar nesta licença."
  mais_informacoes:string=''
  resposta_supervisor:string=''
  dispensas_gastas:number=0

  ngOnDestroys(): void {
    this.events= [];
    this.possuiErroNumaAtualizacaoDaBd=false;
    this.zerarEventosDoClaendario()
  }

  async ngOnInit(): Promise<void> {
    this.preencherMesesEAno();
   const today = new Date();
   this.anoAtual = today.getFullYear();
   this.mesAtual = today.getMonth();
   this.zerarEventosDoClaendario()
   this.buscarTipoLicencasParaFuncionarios()
   this.buscarFeriadosEAplicarNosEventos()
 }

 ngAfterViewInit() {
  if (this.licenca_disciplinarComponent) {
    this.licenca_disciplinarComponent.atualizarTodosOsDados();
  }
}


  filtro = {
    pessoafisica_id: 'null',
    dia_selecionado: 'null',
    tipo_licenca_id: 'null',
    pessoajuridica_id:'null',
    estado: 'null',
  }

  possuiErroNumaAtualizacaoDaBd:boolean=false
  pretendoAbrirEsteModalPara:'aprovar'|'regeitar'='aprovar'

  zerarDados(){
    this.ngOnDestroys()
    this.licencaSelecionada=null
    this.notificarPai()
  }

  notificarPai()
  {
     //this.agendeSelecionadoChange.emit(true)
  }

  feriasevents:any;
  buscarFeriadosEAplicarNosEventos(){
    this.feriadosService.listar({}).pipe(
    ).subscribe((response:any) => {
      const eventos=response;
      console.log("Feriados:",response)
      eventos.forEach((element:any) => {
        const newEvent = {
          title: element.nome,
          date: this.formatDate.formatDate(element.dia_selecionado), // Formata a data
           extendedProps: {
            description: element.licenca_aplicada==1?'feriado':'indisponivel',
            obs:element.observacoes
          }
        };
        this._feriasevents.push(newEvent)
      });
    });
  }

  async buscarDias() {
    this.licencaparaFuncionario.listar(this.filtro).pipe(
    ).subscribe((response:any) => {
      this.zerarEventosDoClaendario()
      this._auxevents=[]
      const eventos=response;
      eventos.forEach((element:any) => {
        const newEvent = {
          title: element.motivo_rejeicao?element.motivo_rejeicao:element.descricao,
          date: this.formatDate.formatDate(element.dia_selecionado),
           extendedProps: {
            description: element.situacao,
            identificador:element.id
          }
        };
        this._auxevents.push(newEvent)
      });
      this._auxevents.push(...this._feriasevents)///Carregando todos os feriados
      this.calendarOptions.events=this._auxevents

    });

    await this.buscarDetalhesDestaLicenca()
  }

  planejarLicenca()
  {
    let Eventos:any=this.calendarOptions.events;
    if(!this.verificarSeEaLicenca('Disciplinar'))Eventos=Eventos.filter(
            (event: any) => event.extendedProps.description !== 'pendente' && event.extendedProps.description !== 'aprovado' && event.extendedProps.description !== 'rejeitado' && event.extendedProps.description !== 'feriado' && event.extendedProps.description !== 'indisponivel'
          );
    /* if(Eventos.length>0) */this.insertMultipleDays(Eventos)
  }
  @Input() agenteSelecionado:any
  @Input() informacao:'planificar'|'analisar'|'rejeitar'|'visualizar'|string='planificar'
  @Input() local:'licenca'|'falta'|string='licenca'

  public licencas: Array<any> = [];
public licencasSelect2: Array<Select2OptionData> = [];
  public anosDisponiveis: Array<Select2OptionData> = []
  public mesesDisponiveis: Array<Select2OptionData> = []
  infinity = Infinity;
  anoAtual!: number;
  mesAtual!: number;
  selectedStartDate: any;
  selectedEndDate: any;
  gerarDocumentoParaLicencaDoTipo:'DISCIPLINAR'|'FALTAS'='DISCIPLINAR'

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  diasAdicionais:number=0
  @ViewChild('fullCalendar') calendarComponent!: FullCalendarComponent;


 calcularDiasUteis:calcularDiasUteis=new calcularDiasUteis();
  buscarNomeDaLicenca():string
  {
    const aux = this.licencas
      .find((item: any) => item.id ==this.licencaSelecionada)
      return aux.nome;
  }

  buscarTipoLicencasParaFuncionarios()
 {
  this.tipoLicencaFuncionario.listarTodos({}).pipe().subscribe({
    next: (response: any) => {
      let aux
      if (this.local === 'licenca') {
        aux = response.filter((item: any) =>
          item.nome.toLowerCase() !== "falta" &&
          item.nome.toLowerCase() !== "faltas"
        );
      } else if (this.local === 'falta') {
        aux = response.filter((item: any) =>
          item.nome.toLowerCase() === "falta" ||
          item.nome.toLowerCase() === "faltas"
        );
      }
      this.licencas = aux;
      this.licencasSelect2 = this.licencas.map(licenca => {
        return { id: licenca.id, text: licenca.nome };
      });
    }

  })
 }

 async buscarDetalhesDestaLicenca()
 {
  const selectedMonth = this.mesAtual+1;
  const filtro={
    ano: this.anoAtual.toString(),
    mes: selectedMonth.toString(),
    tipo_licenca_id: this.filtro.tipo_licenca_id.toString(),
    pessoafisica_id:this.agenteSelecionado.id,
  }
  this.licencaparaFuncionario.listarTodosAnoMes(filtro).pipe().subscribe({
    next: (response: any) => {
      this.mais_informacoes=response[0].motivo,
      this.resposta_supervisor=response[0].resposta
    }
  })
 }

 carregando:boolean=false
 visualizarDocumento(type:'DISCIPLINAR')
 {
  this.carregando=true
   /*  this.gerarDocumentoParaLicencaDoTipo=type
    this.showModal('modalVisualizarFichaDoEfectivoComBaseALicenca')
    this.licenca_disciplinarComponent.atualizarTodosOsDados() */
    const licenca_disciplinar=this.verificarSeEaLicenca('Disciplinar');
    this.showModal('modalGerarRelarorio')
    const options = {
      ...this.filtro,
      ano:this.anoAtual,
      mes:this.mesAtual+1,
      licenca_disciplinar
    }
    this.relatorioService.gerarModelo(options)
          .pipe(
            first(),
            finalize(() => {
              this.carregando = false;
            })
          ).subscribe((response:any) => {
            console.log("Opções de envio:",options)
            console.log("RESULTADO DA GERAÇÃO:",response)
            this.fileUrl = this.relatorioService.createImageBlob(response);

          });
 }

 fecharModalRelatorio() {
  this.fileUrl = null
  this.relatorioService.cancelarGeracaoRelatorio()
}

 verificarSeEaLicenca(_licenca: string): boolean {
  const licenca = this.licencas.find(l => l.nome.toUpperCase() === _licenca.toUpperCase());
  if(licenca)return licenca.id==this.licencaSelecionada ? true : false;
  else return false
}

  async insertMultipleDays(eventos: any) {
   const eventos_selecionados: IInputDay[]|IInputDay_v2 = [];
   const feriados_selecionados: string[] = [];
   //const dias_selecionados_para_nao_fazer_parte: string[] = [];

 // Preenchendo feriados_selecionados com apenas as datas
 this._feriasevents.forEach((element: any) => {
   feriados_selecionados.push(element.date); // Adiciona somente a data como string
 });

 // Preenchendo feriados_selecionados com apenas as datas
 /* eventos.forEach((element: any) => {
   dias_selecionados_para_nao_fazer_parte.push(element.date); // Adiciona somente a data como string- aqui estamos enviando todos os dias....
 }); */

   const selectedMonth = this.mesAtual+1; // Mês que você quer filtrar (Dezembro)
 /* const filteredFeriados = feriados_selecionados.filter((feriado: any) => {
   const month = new Date(feriado).getMonth() + 1; // Obtém o mês (0-indexado, por isso adicionamos 1)
   return month === selectedMonth;
 }); */




   const diasMaximos=((this.dias_maximosLicenca+this.diasAdicionais) - (this.pegarDiferencaEventos()+this.dispensas_gastas));
   let eventos_selecionados_em_ferias:IInputDay[] = [];
   if(this.verificarSeEaLicenca('Disciplinar'))
   {
     await this.calcularDiasUteis.calcularDias(selectedMonth,this.anoAtual,diasMaximos,feriados_selecionados).then((resultado=>{
       eventos_selecionados_em_ferias=resultado
       eventos=[];
       eventos_selecionados_em_ferias.forEach((element: any) => {
         const newEvent = {
           title: element.descricao,
           date: element.day, // Formata a data
            extendedProps: {
             description: element.descricao,
           }
         };
         eventos.push(newEvent);
       });
     }))
   } else {
     eventos.forEach((element: any) => {
       eventos_selecionados.push({
         day: element.date,
         descricao: element.title,
       });
     });
   }
   const formData = new FormData();
   formData.append('tipo_licenca_id', this.licencaSelecionada);
   formData.append(
     'dias_selecionados',
     JSON.stringify(this.verificarSeEaLicenca('Disciplinar')?eventos_selecionados_em_ferias:eventos_selecionados) // Serializar o array para enviar como string
   );
   formData.append('pessoafisica_id', this.agenteSelecionado.id);
   formData.append('situacao', 'pendente');
   formData.append('motivo', this.mais_informacoes);
   formData.append('resposta', this.resposta_supervisor);
   // Fazer o registro
   this.licencaparaFuncionario.registar(formData).pipe().subscribe({
     next: (response: any) => {
       console.log("Dados enviados no calendario:",eventos)
       this.inserirDiasPendenteNoAuxERemoverNoEvents(eventos)
     },
     error: (error: any) => {
       this.possuiErroNumaAtualizacaoDaBd=true;
       console.error('Erro ao registrar licença:', error);
     },
   });
 }

enviarMaisInformacoes(local:'motivo'|'resposta'|'resposta-maxima')
{
  const selectedMonth = this.mesAtual+1;
  const formData = new FormData();
  formData.append('tipo_licenca_id', this.licencaSelecionada);
  formData.append('mes', (selectedMonth).toString());
  formData.append('ano', this.anoAtual.toString());
  formData.append('pessoafisica_id', this.agenteSelecionado.id);
  if(local=='motivo')formData.append('motivo', this.mais_informacoes);
  if(local=='resposta')formData.append('resposta', this.resposta_supervisor);

  // Fazer o registro
  this.licencaparaFuncionario.enviar_detalhe_para_licenca_ano_mes(formData).pipe().subscribe({
    next: (response: any) => {
      this.buscarDetalhesDestaLicenca()
    },
    error: (error: any) => {
      console.error('Erro ao registrar licença:', error);
    },
  });
}

inserirDiasPendenteNoAuxERemoverNoEvents(eventos: any) {
  eventos.forEach((evento: any) => {
    const index = this.events.findIndex((aux: any) => aux.date == evento.date);
    if (index !== -1) {
      const eventoCorrespondente = this.events[index];
      if (eventoCorrespondente.extendedProps && eventoCorrespondente.extendedProps['description'] == 'aguardando') {
        eventoCorrespondente.extendedProps['description'] = 'pendente';
      }
      this._auxevents.push(eventoCorrespondente);
      this.events.splice(index, 1);
    }else { //Especificamente na licença Disciplinar
      this._auxevents.push(evento);
    }
  });
  this.updateEvents();
}



   calcularTempoDeServico(dataAdesao: string): string {
    // Dividindo a data pela barra para obter o dia, mês e ano
    const [dia, mes, ano] = dataAdesao.split('/').map(Number);

    // Criando um objeto Date com a data de adesão
    const dataInicio = new Date(ano, mes - 1, dia); // mes - 1 porque os meses começam do 0
    const dataAtual = new Date();

    // Verifica se a data de adesão é válida
    if (isNaN(dataInicio.getTime())) {
      return "Data de adesão inválida.";
    }

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

    this.diasAdicionais=this.obterDiasAdicionais(anos)
    return `${anos} anos, ${meses} meses e ${dias} dias`;
  }


   obterDiasAdicionais(anos: number): number {
    if (anos >= 10 && anos < 20) {
      return 3;
    } else if (anos >= 20 && anos < 30) {
      return 6;
    } else if (anos >= 30 && anos < 40) {
      return 9;
    }else if (anos >= 40 && anos < 50) {
      return 12;
    }else if (anos >= 50 && anos < 60) {
      return 15;
    } else {
      return 0; // Para anos fora dos intervalos
    }
  }



  async preencherAnos()
  {
    const anoAtual = 2020;
    for (let i = anoAtual; i <= anoAtual + 10; i++) {
      this.anosDisponiveis.push({ id: i.toString(), text: i.toString() });
    }
  }


  async preencherMesesEAno() {
    this.mesesDisponiveis.push({ id: '0', text: 'JANEIRO' });
    this.mesesDisponiveis.push({ id: '1', text: 'FEVEREIRO' });
    this.mesesDisponiveis.push({ id: '2', text: 'MARÇO' });
    this.mesesDisponiveis.push({ id: '3', text: 'ABRIL' });
    this.mesesDisponiveis.push({ id: '4', text: 'MAIO' });
    this.mesesDisponiveis.push({ id: '5', text: 'JUNHO' });
    this.mesesDisponiveis.push({ id: '6', text: 'JULHO' });
    this.mesesDisponiveis.push({ id: '7', text: 'AGOSTO' });
    this.mesesDisponiveis.push({ id: '8', text: 'SETEMBRO' });
    this.mesesDisponiveis.push({ id: '9', text: 'OUTUBRO' });
    this.mesesDisponiveis.push({ id: '10', text: 'NOVEMBRO' });
    this.mesesDisponiveis.push({ id: '11', text: 'DEZEMBRO' });
    await this.preencherAnos()
  }

  events: EventInput[] = [];
  _auxevents: EventInput[] = [];
  _feriasevents: EventInput[] = [];
  selectedDate!: Date; // Data selecionada
  eventDescription: string = ''; // Descrição do evento

  calendarOptions: CalendarOptions = { ///, timeGridPlugin, listPlugin
    locale: 'pt-br',
    timeZone:'UTC',
    allDayText: '24 horas',
    plugins: [interactionPlugin, dayGridPlugin],
    weekends: false,
    editable: false,
    selectable: true,
    select: this.handleSelect.bind(this),
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.handleDateClick.bind(this),
    initialView: 'dayGridMonth',
    aspectRatio: 2,
    height:'auto',
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Hoje',
      list: 'Lista',
    },
    headerToolbar: {
      left: 'today prev,next',
      center: 'title',
      right: 'dayGridMonth',//timeGridWeek,dayGridMonth,listWeek
    },
    events: this.events,
    datesSet: this.onDatesSet.bind(this),
    eventContent: (arg) => {
      // Cria um contêiner para os elementos
      let eventContainer = document.createElement('div');
      eventContainer.classList.add('event-container');

      const status = arg.event.extendedProps['description']; // Supondo que o estado esteja em extendedProps

      let titleEl = document.createElement('div');
      titleEl.classList.add('title'); // Classe para o título
      titleEl.innerHTML = ['aguardando', 'feriado', 'indisponivel','pendente'].includes(status) ? (arg.event.title.length > 4 ? (arg.event.title.toUpperCase()=='Dia selecionado'.toUpperCase()) ? '':arg.event.title.substring(0, 18) + '...' : arg.event.title) : '';

      let descriptionEl = document.createElement('div');
      descriptionEl.classList.add('description');

      // Define a descrição e a cor da borda com base no estado
      descriptionEl.innerHTML = status ? status : 'aguardando';

      switch (status) {
        case 'feriado':
        descriptionEl.style.border = '2px solid #FF6347'; // Borda vermelha
        descriptionEl.style.background = '#FF6347'; // Fundo suave vermelho
        descriptionEl.style.color = 'white'; // Texto branco
        break;
    case 'indisponivel':
        descriptionEl.style.border = '2px solid #FF7F50'; // Borda coral
        descriptionEl.style.background = '#FF7F50'; // Fundo coral
        descriptionEl.style.color = 'white'; // Texto branco
        break;
        case 'aguardando':
            descriptionEl.style.border = '2px solid #FFD700'; // Borda dourada para aguardando
            descriptionEl.style.background = '#FFD700'; // Fundo suave dourado
            descriptionEl.style.color = 'white'; // Texto branco
            break;
        case 'pendente':
            descriptionEl.style.border = '2px solid #FFA500'; // Borda laranja para pendente
            descriptionEl.style.background = '#FFA500'; // Fundo suave laranja
            descriptionEl.style.color = 'white'; // Texto branco
            break;
        case 'aprovado':
            descriptionEl.style.border = '2px solid #32CD32'; // Borda verde para aprovado
            descriptionEl.style.background = '#32CD32'; // Fundo suave verde
            descriptionEl.style.color = 'white'; // Texto branco
            break;
        case 'rejeitado':
            descriptionEl.style.border = '2px solid #DC143C'; // Borda vermelha escura para rejeitado
            descriptionEl.style.background = ' #DC143C'; // Fundo suave vermelho escuro
            descriptionEl.style.color = 'white'; // Texto branco
            break;
        default:
            descriptionEl.style.border = '2px solid #808080'; // Borda cinza para status desconhecido
            descriptionEl.style.background = '#808080'; // Fundo suave cinza
            descriptionEl.style.color = 'white'; // Texto branco
            console.log("Algo deu errado:",arg)
            break;
    }

      // Adiciona os elementos ao contêiner
      eventContainer.appendChild(titleEl);
      eventContainer.appendChild(descriptionEl);

      return { domNodes: [eventContainer] }; // Retorna apenas o contêiner
  },


  };



  onDatesSet(info: any) {
    const dataAtualVisivel = info.view.currentStart;

    this.anoAtual = dataAtualVisivel.getFullYear();
    this.mesAtual = dataAtualVisivel.getMonth();  // `getMonth()` retorna 0 para Janeiro, então adicionamos 1

  }

  selecionouDiaQueJaExisteNoCalendario:boolean=false
  handleDateClick(arg: any) {
    if(this.informacao=='visualizar') return ;
    if(!this.possuiErroNumaAtualizacaoDaBd)
    {
      this.selectedDate = arg.date; // Armazena a data selecionada
      if(!this.verificaSeEssaDataEstaNaBaseDeDados(new Date(this.selectedDate)) && !this.isWeekend(this.selectedDate))
      {
        const event = this.events.find(event => event.date === arg.dateStr); // Verifica se há um evento na data selecionada
        this.selecionouDiaQueJaExisteNoCalendario = event ? true : false;
        if (event && event.title) {
            this.eventDescription = event.title; // Preenche a descrição do evento se já existir
        } else {
            this.eventDescription = ''; // Limpa a descrição se não houver evento
        }

        if (!this.selecionouDiaQueJaExisteNoCalendario) {
            if (this.verificarSeTemDiasDisponiveisClick()) {
              if(this.informacao=='planificar') this.showModal('eventModal');
            }
        } else {
          if(this.informacao=='planificar') this.showModal('eventModal');
        }
      } else if(this.verificarEssaDataComStatusDe(new Date(this.selectedDate),'feriado'))
      {

      }else if(this.verificarEssaDataComStatusDe(new Date(this.selectedDate),'aprovado') && (this.informacao=='rejeitar'))
        {
          this.showModal('eventModalRegeitarUmDia');

        }else if(this.verificarEssaDataComStatusDe(new Date(this.selectedDate),'indisponivel'))
        {

        }else if(this.verificarEssaDataComStatusDe(new Date(this.selectedDate),'rejeitado')){
          if(this.informacao=='planificar') this.showModal('confirmModalRegeted'); ///Analisar o nivel de permissão do usuário
      }
      else if(this.verificarEssaDataComStatusDe(new Date(this.selectedDate),'pendente'))
      {
         const event = this._auxevents.find(event => event.date === this.formatDate.formatDate(this.selectedDate)); // Verifica se há um evento na data selecionada
        if(event) this.eventDescription = event.title|| 'Dia selecionado';
        if(this.informacao=='analisar')this.showModal('eventModalPendente');
      }

    }else this.showModal('confirmModalUpdateDB')


}

  deleteEvent() {
    if (this.selectedDate) {
      this.events = this.events.filter(event => event.date !== this.formatDate.formatDate(this.selectedDate));
      this.updateEvents();
      this.eventDescription = ''; // Limpa a descrição ao deletar
      this.closeModal('eventModal')
    }
  }

  confirmToDeleteDataFromDB() {
    if (this.selectedDate) {
      // Formatar a data selecionada
      const formattedDate = this.formatDate.formatDate(this.selectedDate);

      const eventoRejeitado = this._auxevents.find(event => event.date === formattedDate);

      if (eventoRejeitado?.extendedProps?.['identificador']) {

        this.licencaparaFuncionario.eliminar(eventoRejeitado.extendedProps['identificador']).pipe(
        ).subscribe((response:any) => {
          this._auxevents = this._auxevents.filter(event => event.date !== formattedDate);
          this.updateEvents();
        });
        this.closeModal('confirmModalRegeted');
      } else {
        console.warn("Nenhum evento encontrado para a data selecionada.");
      }
    }
  }


  showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }
 verificaSeEssaDataEstaNaBaseDeDados(data:Date):boolean
 {
    let formattedDate = this.formatDate.formatDate(data);
    const finded = this._auxevents.find(event => event.date == formattedDate);
    return finded?true:false;
 }



 verificarEssaDataComStatusDe(data: Date, status: 'feriado' | 'aprovado'|'rejeitado'|'pendente'|'indisponivel'): boolean {
  // Formata a data para o formato YYYY-MM-DD
  const formattedDate = this.formatDate.formatDate(data);
  const finded = this._auxevents.find((event:EventInput) => event.date == formattedDate);
  return !!finded && finded.extendedProps?.['description'] == status;
}

verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(data:Date,_data:Date, status: 'feriado' | 'aprovado'|'rejeitado'|'pendente'|'indisponivel'):boolean
 {
    let selectedDays = this.generateDays(data , _data,false);
   let count=0;
   selectedDays.forEach(day => {
    // Formata a data como string (se necessário, dependendo da sua configuração de FullCalendar)
    let formattedDate = this.formatDate.formatDate(day);
    const finded = this._auxevents.find(event => event.date == formattedDate);
    if (finded && finded.extendedProps?.['description'] === status) count++;

  });

  return selectedDays.length==count
 }

 verificaSeEssaDataEstaNoEvento(data:Date):boolean
 {
    let formattedDate = this.formatDate.formatDate(data);
    const finded = this.events.find(event => event.date == formattedDate);
    return finded?true:false;
 }

 verificaSeIntervaloDatasEstaNaBaseDeDados(data:Date,_data:Date):boolean
 {
    let selectedDays = this.generateDays(data , _data,false);
   let count=0;
   selectedDays.forEach(day => {
    // Formata a data como string (se necessário, dependendo da sua configuração de FullCalendar)
    let formattedDate = this.formatDate.formatDate(day);
    const finded = this._auxevents.find(event => event.date == formattedDate);
    if (finded) count++;

  });

  return selectedDays.length==count
 }
  saveEvent(descricao?:string) {
    if (this.selectedDate) {
      const newEvent = {
        title: this.eventDescription?this.eventDescription:descricao?descricao:' Dia selecionado',
        date: this.formatDate.formatDate(this.selectedDate), // Formata a data
         extendedProps: {
          description: 'aguardando',
          /* location: 'Sala 1, Escritório Central',
          eventType: 'Reunião',
          attendees: ['João', 'Maria', 'Carlos'],
          status: 'pendente',
          priority: 'Alta',
          responsiblePerson: 'Hélio Vicente',
          notes: 'Trazer relatório financeiro.' */
        }
      };
      this.events.push(newEvent)
      this.updateEvents(); // Atualiza os eventos no FullCalendar
      this.closeModal('eventModal'); // Fecha o modal após salvar
      this.eventDescription = ''; // Limpa a descrição
  }else this.closeModal('eventModal');
}

aproveEvent()
{
  const diasFormatados = this.selectedDate.toISOString().split("T")[0];
  const eventosCorrespondentes = this._auxevents.filter((event:any) => diasFormatados.includes(event.date));
  const eventosDetalhados = eventosCorrespondentes.map((event: any) => ({
    id: event.extendedProps.identificador,
    descricao: event.title,
  }));

  this.sendEventToAPI(eventosDetalhados, 'aprovado', 'eventModalPendente')
    .then((success) => {
      // Atualizar todos os eventos correspondentes no array _auxevents
      if(success){
        eventosCorrespondentes.forEach((evento: any) => {
          const eventoCorrespondente = this._auxevents.find(
            (aux: any) => aux.date === evento.date
          );
          if (eventoCorrespondente && eventoCorrespondente.extendedProps) {
            if(eventoCorrespondente.extendedProps['description']=='pendente')
            {
              eventoCorrespondente.extendedProps['description'] = 'aprovado';
            }
          }
        });
        console.log("RESULTADO DA EXECUÇÃO-ONE:",success)
        this.updateEvents();
        this.ngAfterViewInit()
      }
    })
    .catch((error) => {
      console.error("Erro ao enviar eventos à API:", error);
    });

}

sendEventToAPI(eventosDetalhados:any,situacao:'aprovado'|'rejeitado',closeModal:string):Promise<boolean>
{
  const formData = new FormData();
  formData.append(
    'dias_selecionados',
    JSON.stringify(eventosDetalhados) // Serializar o array para enviar como string
  );
  formData.append('situacao', situacao);
  console.log("Dias a serem enviados a API:",formData)
    return new Promise((resolve, reject) => {
    this.licencaparaFuncionario.alterarSituacao(formData).subscribe({
      next: (response: any) => {
        this.closeModal(closeModal); // Chama a função para fechar o modal
        resolve(true); // Resolve o Promise com sucesso
      },
      error: (erro: any) => {
        this.possuiErroNumaAtualizacaoDaBd=true;
        reject(false); // Rejeita o Promise com erro
      },
    });
  });
}

regetEvent()
{
  const diasFormatados = this.selectedDate.toISOString().split("T")[0];
  const eventosCorrespondentes = this._auxevents.filter((event:any) => diasFormatados.includes(event.date));
  const eventosDetalhados = eventosCorrespondentes.map((event: any) => ({
    id: event.extendedProps.identificador,
    descricao: event.title,
  }));
  this.sendEventToAPI(eventosDetalhados, 'rejeitado', 'eventModalPendente')
    .then((success) => {
      // Atualizar todos os eventos correspondentes no array _auxevents
      eventosCorrespondentes.forEach((evento: any) => {
        const eventoCorrespondente = this._auxevents.find(
          (aux: any) => aux.date === evento.date
        );
        if (eventoCorrespondente && eventoCorrespondente.extendedProps) {
          if(eventoCorrespondente.extendedProps['description']=='pendente' || eventoCorrespondente.extendedProps['description']=='aprovado')
          {
            eventoCorrespondente.extendedProps['description'] = 'rejeitado';
          }
        }
      });
      this.updateEvents();
      this.ngAfterViewInit()
    })
    .catch((error) => {
      console.error("Erro ao enviar eventos à API:", error);
    });
}
aproveEventMany()
{
const dias= this.generateDays(this.selectedStartDate,this.selectedEndDate,false)
const diasFormatados = dias.map(dia => dia.toISOString().split("T")[0]);
const eventosCorrespondentes = this._auxevents.filter((event:any) => diasFormatados.includes(event.date));
const eventosDetalhados = eventosCorrespondentes.map((event: any) => ({
  id: event.extendedProps.identificador,
  descricao: event.title,
}));

this.sendEventToAPI(eventosDetalhados, 'aprovado', 'eventModalPendenteMany')
    .then((success) => {
      // Atualizar todos os eventos correspondentes no array _auxevents
      if(success){
        eventosCorrespondentes.forEach((evento: any) => {
          const eventoCorrespondente = this._auxevents.find(
            (aux: any) => aux.date === evento.date
          );
          if (eventoCorrespondente && eventoCorrespondente.extendedProps) {
            if(eventoCorrespondente.extendedProps['description']=='pendente')
            {
              eventoCorrespondente.extendedProps['description'] = 'aprovado';
            }
          }
        });
        console.log("RESULTADO DA EXECUÇÃO-MANY:",success)
        this.updateEvents();
        this.ngAfterViewInit()
      }

    })
    .catch((error) => {
      console.error("Erro ao enviar eventos à API:", error);
    });
}

regetEventMany()
{
  const dias= this.generateDays(this.selectedStartDate,this.selectedEndDate,false)
const diasFormatados = dias.map(dia => dia.toISOString().split("T")[0]);
const eventosCorrespondentes = this._auxevents.filter((event:any) => diasFormatados.includes(event.date));
const eventosDetalhados = eventosCorrespondentes.map((event: any) => ({
  id: event.extendedProps.identificador,
  descricao: event.title,
}));
this.sendEventToAPI(eventosDetalhados, 'rejeitado', 'eventModalPendenteMany')
    .then((success) => {
      // Atualizar todos os eventos correspondentes no array _auxevents
      eventosCorrespondentes.forEach((evento: any) => {
        const eventoCorrespondente = this._auxevents.find(
          (aux: any) => aux.date === evento.date
        );
        if (eventoCorrespondente && eventoCorrespondente.extendedProps) {
          if (
            eventoCorrespondente.extendedProps['description'] ==
            (this.pretendoAbrirEsteModalPara =='aprovar' ? 'pendente' : 'aprovado')
          )
          {
            eventoCorrespondente.extendedProps['description'] = 'rejeitado';
          }
        }
      });
      this.updateEvents();
    })
    .catch((error) => {
      console.error("Erro ao enviar eventos à API:", error);
    });
}

selecionouDiasQueJaExisteNoCalendario:boolean=false
handleSelect(info: any) {
  if(this.informacao=='visualizar') return ;
  if(!this.possuiErroNumaAtualizacaoDaBd)
  {

    this.selectedStartDate=new Date(info.startStr)
  this.selectedEndDate=new Date(info.endStr)

  const timeDifference = this.selectedEndDate.getTime() - this.selectedStartDate.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24); // Converte de milissegundos para dias

  if(!this.verificaSeIntervaloDatasEstaNaBaseDeDados(this.selectedStartDate,this.selectedEndDate))
  {

  if (dayDifference > 1) {
    // Mostra o modal de confirmação se a seleção for maior que 1 dia
    this.selecionouDiasQueJaExisteNoCalendario=this.verificarSeDiasSelecionadosContemNoEventos()
    if(this.selecionouDiasQueJaExisteNoCalendario){
      if(this.informacao=='planificar') this.showModal('confirmModal');
    }
    else
    {
      if(this.verificarSeTemDiasDisponiveisSelecao() && (this.informacao=='planificar'))this.showModal('confirmModal');
    }

  } else {
    this.selectedEndDate = null; // Reseta a data de fim se não for válida
  }

  }

  if (dayDifference > 1){ // Mostra o modal de confirmação se a seleção for maior que 1 dia
    if(this.verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(this.selectedStartDate,this.selectedEndDate,'aprovado') && (this.informacao=='rejeitar')){

      this.pretendoAbrirEsteModalPara='regeitar'
      this.showModal('eventModalPendenteMany');

    } else if(this.verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(this.selectedStartDate,this.selectedEndDate,'feriado')){

    }else if(this.verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(this.selectedStartDate,this.selectedEndDate,'indisponivel')){

    } else if(this.verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(this.selectedStartDate,this.selectedEndDate,'rejeitado') && (this.informacao=='planificar')){

    }
    else if(this.verificaSeIntervaloDatasEstaNaBaseDeDadosComStatusDe(this.selectedStartDate,this.selectedEndDate,'pendente') && (this.informacao=='analisar'))
    {
      this.pretendoAbrirEsteModalPara='aprovar'
      this.showModal('eventModalPendenteMany');
    }
  }
  }else this.showModal('confirmModalUpdateDB')



}

verificarSeDiasSelecionadosContemNoEventos()
{
   let selectedDays = this.generateDays(this.selectedStartDate , this.selectedEndDate,false);
   let count=0;
   selectedDays.forEach(day => {
    // Formata a data como string (se necessário, dependendo da sua configuração de FullCalendar)
    let formattedDate = this.formatDate.formatDate(day);
    const finded = this.events.find(event => event.date == formattedDate);
    if (finded) count++;

  });

  return selectedDays.length==count
}

verificarSeTemDiasDisponiveisSelecao(incluirFimDeSemana:boolean=false):boolean
{
  let selectedDays = this.generateDays(this.selectedStartDate , this.selectedEndDate,incluirFimDeSemana);
  let resultado:number=0
    if(this.verificarSeEaLicenca('Disciplinar'))resultado=(this.dias_maximosLicenca+this.diasAdicionais) - (this.pegarDiferencaEventos()+this.dispensas_gastas)
    else resultado=(this.dias_maximosLicenca) - this.pegarDiferencaEventos()
   if(selectedDays.length>0)
  {
    if((resultado-selectedDays.length)<0) {
      const resultado=this.calcularLimitesAnuais(selectedDays)
      if(resultado.valido) return true;
      else {
        this.mensagem_caso_atinja_limite=resultado.mensagem
        this.showModal('esgotadoDiasModal');
        return false;
      }
    }

    return true;
  }else return true;
}


calcularDiasRestantes(): number {
  if(this.calendarOptions.events)
 {
  const filtros = { situacao: ["pendente", "aprovado",'aguardando'],ano:[this.anoAtual]}
  const totalDiasSelecionados=this.calcularUtilizacoes(this.calendarOptions.events,filtros)
  // Retorna o valor absoluto para evitar números negativos
  return(totalDiasSelecionados.length>0)?Math.abs(totalDiasSelecionados[0].diasUsados):0;
 }
  return 0

}

async saberQuantasDispensas(): Promise<number> {
  let dispensas = 0;
  const _filtro = { ...this.filtro }; // Faz uma cópia para evitar efeitos colaterais
  _filtro.tipo_licenca_id = '45';
  _filtro.estado = 'aprovado';

  try {
    const response = await this.licencaparaFuncionario.listar(_filtro).toPromise();
    dispensas = response.length;
    console.log("Dispensas:", dispensas);
  } catch (error) {
    console.error("Erro ao obter dispensas:", error);
  }

  return dispensas;
}



pegarDiferencaEventos()
{
  return this.calcularDiasRestantes()
}

verificarSeTemDiasDisponiveisClick():boolean
{
  let resultado:number=0
    if(this.verificarSeEaLicenca('Disciplinar'))resultado=(this.dias_maximosLicenca+this.diasAdicionais) - this.pegarDiferencaEventos()
    else resultado=(this.dias_maximosLicenca) - this.pegarDiferencaEventos()

   if(this.selectedDate)
  {

    if((resultado-1)<0){
      const  array: any[] = [];
      array.push(this.selectedDate)
      const resultado=this.calcularLimitesAnuais(array)
      if(resultado.valido) return true;
      else {
        this.mensagem_caso_atinja_limite=resultado.mensagem
        this.showModal('esgotadoDiasModal');
        return false;
      }
    }

    return true;
  }else return true;
}

deleteSelection()
{
  let selectedDays = this.generateDays(this.selectedStartDate , this.selectedEndDate,false);
  selectedDays.forEach(day => {
    // Formata a data como string (se necessário, dependendo da sua configuração de FullCalendar)
    let formattedDate = this.formatDate.formatDate(day);
    this.events = this.events.filter(event => event.date !== formattedDate);

  });

  this.updateEvents();
  this.resetarDiasSelecionados()
}

// Função chamada ao confirmar a seleção no modal
confirmSelection(incluirDiaFim:boolean=false) {
  if (this.selectedStartDate && this.selectedEndDate) {
    // Adiciona o evento ao array

   let selectedDays = this.generateDays(this.selectedStartDate , this.selectedEndDate,incluirDiaFim);

   selectedDays.forEach(day => {
    // Formata a data como string (se necessário, dependendo da sua configuração de FullCalendar)
    let formattedDate = this.formatDate.formatDate(day);  // Exemplo: "2024-10-02"

    // Adicione ao calendário como eventos individuais
    if(!this.verificaSeEssaDataEstaNaBaseDeDados(day) && !this.verificaSeEssaDataEstaNoEvento(day))this.events = [...this.events, {
      title: 'Dia Selecionado',
      date: formattedDate,  // Cada dia será adicionado individualmente
      extendedProps: {
        description: 'aguardando',
      }
  }];
  });

    this.resetarDiasSelecionados()
    // Atualiza o calendário
    this.updateEvents();

  }
}

 isWeekend(date:Date) {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado
  return (day === 0 || day === 6);
}

// Função para gerar uma lista de datas excluindo finais de semana
 generateDays(startDay:any, endDay:any,incluirDiaFimDeSemana:boolean) {
  let currentDate = new Date(startDay);
  let endDate = new Date(endDay);
  let daysList = [];

  if(!incluirDiaFimDeSemana)while (currentDate < endDate) {
      if (!this.isWeekend(currentDate)) {
          // Adiciona o dia ao array (fazendo uma cópia da data)
          daysList.push(new Date(currentDate));
      }
      // Incrementa para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
  }

  if(incluirDiaFimDeSemana)while (currentDate <= endDate) {
    if (!this.isWeekend(currentDate)) {
        // Adiciona o dia ao array (fazendo uma cópia da data)
        daysList.push(new Date(currentDate));
    }
    // Incrementa para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1);
}

  return daysList;
}

resetarDiasSelecionados()
{
  // Reseta as datas selecionadas
  this.selectedStartDate = null;
  this.selectedEndDate = null;
  this.closeModal('confirmModal')
}


updateEvents() {
  this.calendarOptions.events = [...this.events,...this._auxevents]; // Atualiza o array de eventos
 this.atualizarFiltros()
}
onMesOuAnoSelecionado(data:any,vindaDe:'year'|'month') {
  if(vindaDe=='year')this.anoAtual=data;
  else this.mesAtual=data;
  const novaData = new Date(this.anoAtual, this.mesAtual, 1);
  const calendario=this.calendarComponent.getApi()
  calendario.gotoDate(novaData);
}

public periodoLicenca: number = 0;
public dias_maximosLicenca: number = 0;
public temLimite: boolean = true; // Variável para indicar se a  tem ou não limite

// Método chamado quando o usuário seleciona uma
licencaSelecionada:any
async onLicencaSelecionada(event: any) {
  const licenca = this.licencas.find(l => l.id == event);
  if (licenca) {
     this.temLimite = licenca.dias_maximos?true:false

    if (licenca.dias_maximos) {
      //if(licenca.text==' DISCIPLINAR') licenca.dias_maximos?licenca.dias_maximos=licenca.dias_maximos+this.diasAdicionais:licenca.dias_maximos
       this.dias_maximosLicenca = licenca.dias_maximos?licenca.dias_maximos:0;
       //this.periodoLicenca = this.dias_maximosLicenca
    } else {
      this.periodoLicenca = 0;
      this.dias_maximosLicenca = Infinity;
    }
  }
  this.filtro.pessoafisica_id=this.agenteSelecionado?.id;
  this.filtro.tipo_licenca_id=event;
  this.filtro.pessoajuridica_id=this.agenteSelecionado?.sigpq_tipo_orgao.id; //this.agenteSelecionado?.orgao.id;
  if(event)this.buscarDias()

  if(this.verificarSeEaLicenca('Disciplinar'))this.dispensas_gastas=await this.saberQuantasDispensas()
  else this.dispensas_gastas=0
}

atualizarFiltros()
{
  this.filtro.pessoafisica_id=this.agenteSelecionado?.id;
  this.anoAtual=this.anoAtual
}


validarPeriodoLicenca(valor: number) {
  if (this.temLimite && valor > this.dias_maximosLicenca) {
    this.periodoLicenca = this.dias_maximosLicenca; // Corrige automaticamente para o máximo permitido
  }
}

inicioAtivado:boolean=false
diaDeInicioDaLicenca:any
setInicio() {
  //this.saveEvent('inicio da ') 'confirmModal'
  this.diaDeInicioDaLicenca=this.selectedDate
  this.inicioAtivado=true
  this.closeModal('eventModal')

}
zerarEventosDoClaendario()
{

  this.calendarOptions.events = [];
}
diaDeFimDaLicenca:any
setFim() {
  ///Analisar se o intervaloe scolhido já ultrapassou a data escolhida
  this.diaDeFimDaLicenca=this.selectedDate
  this.selectedStartDate=this.diaDeInicioDaLicenca;
  this.selectedEndDate=this.diaDeFimDaLicenca

  if(this.verificarSeTemDiasDisponiveisSelecao(true)){
    this.confirmSelection(true);
   }
  this.closeModal('eventModal')
  this.selectedStartDate=null;
  this.selectedEndDate=null;
  this.inicioAtivado=false
}

editarDescricaoAtivado:boolean=false
editarDescricao() {
  this.editarDescricaoAtivado=true;
  // Lógica para editar a descrição
  const userInput = prompt("Digite a descrição do dia:");
    if (userInput) {
        this.eventDescription = userInput; // Armazena a descrição no modelo
    }
}

updateDescription() {
  if (this.selectedDate) {
    const formattedDate = this.formatDate.formatDate(this.selectedDate);
    const event = this.events.find(event => event.date === formattedDate);

    if (event) {
      event.title = this.eventDescription;


      this.updateEvents();

      this.eventDescription = '';

      this.closeModal('eventModal');

     this.editarDescricaoAtivado=false;
    } else {
      console.log('Evento não encontrado para a data selecionada');
    }
  }
}



calcularLimitesAnuais(
  diasSolicitados:Date[]
) {
  const calendarApi = this.calendarComponent.getApi().getDate();
  const anoAtual = calendarApi.getFullYear(); // Extrai o ano
  const filtros = { situacao: ["pendente", "aprovado",'aguardando'],ano:[anoAtual]}
  const array = [...this.events, ...this._auxevents];
  const utilizadoes=this.calcularUtilizacoes(array,filtros)
  const _licenca = this.licencas.find(l => l.id == this.licencaSelecionada);
  let licenca;
  if(this.verificarSeEaLicenca('Disciplinar')) licenca={ dia_maximo: _licenca.dias_maximos+this.dispensas_gastas,limite_anual: _licenca.limite_anual, utilizacoes: utilizadoes }
  else licenca={ dia_maximo: _licenca.dias_maximos,limite_anual: _licenca.limite_anual, utilizacoes: utilizadoes }
  const { dia_maximo, limite_anual, utilizacoes } = licenca;

  const diasNoAnoAtual = diasSolicitados.filter(dia => dia.getFullYear() === anoAtual);
  const usoAtual = utilizacoes.find((uso:Utilizacao) => uso.ano == anoAtual) || { ano: anoAtual, diasUsados: 0 };
  const daisRestantes=(dia_maximo*limite_anual)
  const diasRestantesNoAno = (dia_maximo * limite_anual) - (usoAtual.diasUsados+diasNoAnoAtual.length);

  if(diasRestantesNoAno==0)
  {
    return { valido: true, mensagem: `A solicitação é permitido, pois é o ultimo dia do limite máximo de ${daisRestantes} dias neste ano. ${anoAtual}` };
  }else if (diasRestantesNoAno>0)
  {
    return { valido: true, mensagem: `A solicitação é permitido, pois não excede o limite máximo de ${daisRestantes} dias neste ano. ${anoAtual}` };
  } else {
    return { valido: false, mensagem: `A solicitação interrompe o limite máximo de ${daisRestantes} dias neste ano. ${anoAtual}` };
  }

}

calcularUtilizacoes(array:any,filtros: { [key: string]: any | any[] }): Utilizacao[] {
  //const array = [...this.events, ...this._auxevents];

  const arrayFiltrado = array.filter((item: any) => {
    return Object.entries(filtros).every(([campo, valores]) => {
      // Se o campo for 'situacao', verificar no campo extendedProps.description
      if (campo === "situacao" && Array.isArray(valores)) {
        return valores.includes(item.extendedProps.description?.trim().toLowerCase());
      }

      // Se o campo for 'ano', extrair o ano da data
      if (campo === "ano" && Array.isArray(valores)) {
        const ano = new Date(item.date).getFullYear();
        return valores.includes(ano);
      }

      // Caso o filtro seja um array (múltiplos valores), verifica se o valor do item está incluído
      if (Array.isArray(valores)) {
        return valores.includes(item[campo]);
      }

      // Caso contrário, verifica se o valor do item é igual ao filtro
      return item[campo] === valores || item.extendedProps[campo] === valores;
    });
  });

  // Mapa para contar os dias por ano
  const utilizacoesMap: { [ano: number]: number } = {};

  // Agrupar os dados por ano
  arrayFiltrado.forEach((item:any) => {
    const ano = new Date(item.date).getFullYear();

    if (!utilizacoesMap[ano]) {
      utilizacoesMap[ano] = 0;
    }
    utilizacoesMap[ano] += 1; // Incrementar os dias usados no ano
  });

  // Converter o mapa em um array de objetos
  const utilizacoes: Utilizacao[] = Object.entries(utilizacoesMap).map(
    ([ano, diasUsados]) => ({
      ano: parseInt(ano, 10),
      diasUsados,
    })
  );

  // Ordenar por ano e dias usados
  utilizacoes.sort((a, b) => {
    // Ordena pelo ano (crescente)
    if (a.ano !== b.ano) {
      return a.ano - b.ano;
    }
    // Se o ano for igual, ordena pelos dias usados (decrescente)
    return b.diasUsados - a.diasUsados;
  });
  return utilizacoes;
}





}
