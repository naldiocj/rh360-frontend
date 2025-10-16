import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { FeriadosService } from '../../../core/service/config/Feriados.service';
@Component({
  selector: 'app-adicionar-pontualidade',
  templateUrl: './adicionar-pontualidade.component.html',
  styleUrls: ['./adicionar-pontualidade.component.css']
})
export class AdicionarPontualidadeComponent implements OnInit {

  events: any[] = [];
  calendarOptions: CalendarOptions = { ///, timeGridPlugin, listPlugin,dayGridPlugin
    locale: 'pt-br',
    timeZone:'UTC',
    allDayText: '24 horas',
    plugins: [interactionPlugin,dayGridPlugin, timeGridPlugin],
    weekends: true,
    editable: false,
    selectable: true,
    //select: this.handleSelect.bind(this),
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.handleDateClick.bind(this),
    initialView: 'timeGridDay',
    aspectRatio: 2,
    slotMinTime: '1:00:00', // Horário inicial da grade
    slotMaxTime: '24:00:00', // Horário final da grade
    slotDuration: '00:10:00', // Intervalo entre os slots
    slotLabelInterval: '01:00:00', // Rótulos a cada hora
    height:'auto',
    dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Hoje',
      list: 'Lista',
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'short'
    },
    headerToolbar: {
      left: 'today prev,next',
      center: 'title',
      right: 'timeGridDay,dayGridMonth',//timeGridWeek,dayGridMonth,listWeek
    },
    events: this.events,
    /* events: [
      {
        title: 'Reunião com o Time',
        start: new Date(new Date().setHours(9, 0, 0)), // Evento das 09h
        end: new Date(new Date().setHours(10, 30, 0)), // Até as 10h30
        description: 'Discussão de objetivos do trimestre'
      },
      {
        title: 'Treinamento',
        start: new Date(new Date().setHours(13, 0, 0)),
        end: new Date(new Date().setHours(15, 0, 0)),
        backgroundColor: 'red',
        borderColor: 'red',
        textColor: 'white'
      }
    ], */
    //datesSet: this.onDatesSet.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventContent: (arg) => {
      // Cria um contêiner para os elementos
      let eventContainer = document.createElement('div');
      eventContainer.classList.add('event-container');

      const status = arg.event._def.extendedProps['type']; // Supondo que o estado esteja em extendedProps
      const descricao = arg.event._def.extendedProps['description']; // Supondo que o estado esteja em extendedProps

       let titleEl = document.createElement('div');
      titleEl.classList.add('title'); // Classe para o título
      titleEl.innerHTML = ['aguardando', 'feriado', 'indisponivel','pendente'].includes(status) ? (arg.event.title.length > 4 ? (arg.event.title.toUpperCase()=='Dia selecionado'.toUpperCase()) ? '':arg.event.title.substring(0, 18) + '...' : arg.event.title) : '';

      let descriptionEl = document.createElement('div');
      descriptionEl.classList.add('description');

      // Define a descrição e a cor da borda com base no estado
      descriptionEl.innerHTML = status ? status+' '+descricao : 'chegada'+' '+descricao;

      // Adiciona os elementos ao contêiner
      eventContainer.appendChild(titleEl);
      eventContainer.appendChild(descriptionEl);

      return { domNodes: [eventContainer] }; // Retorna apenas o contêiner
  },


  };
  @Output() agendeSelecionadoChange = new EventEmitter<boolean>();
  @Input() agenteSelecionado:any
    @Input() informacao:'planificar'|'analisar'|'rejeitar'|'visualizar'|string='planificar'
    @Input() local:'licenca'|'falta'|string='licenca'
  selectedDate:any;
  momento_de_entrada:boolean=false
  quantidade_evento:number=0
  mais_informacoes:string=''
  resposta_supervisor:string=''
  constructor(private feriadosService:FeriadosService) { }
  ngOnInit() {
    this.buscarFeriadosEAplicarNosEventos()
  }
  handleSelect(info: any) {

  }

  enviarMaisInformacoes(destino:String)
  {

  }

  notificarPai()
  {
     this.agendeSelecionadoChange.emit(true)
  }


  handleEventClick(arg: EventClickArg) {
    if(arg.view.type=='timeGridDay')
      {
        this.selectedDate=new Date(arg.event.startStr)
        this.showModal('eventModalEliminar')
      }
  }

  handleDateClick(arg: any) {
    if(arg.view.type=='timeGridDay')
    {

      this.selectedDate=new Date(arg.dateStr)

      const eventTime = this.selectedDate.getHours(); // Pega a hora do evento
      if (eventTime == 0) {
        console.log('Evento com hora 00:00 não será contabilizado');
        return; // Não faz nada se for 00:00
      }

       this.quantidade_evento=this.countEventsForSelectedDate(this.selectedDate)
      if(this.quantidade_evento>1) return
      this.momento_de_entrada=this.momentoDeEntrada()
      this.showModal('eventModalPendente')
    }
  }

  momentoDeEntrada()
  {
    return this.isEntradaOuSaida()
  }

  deleteEvent() {
    if (this.selectedDate) {
    // Remove o evento correspondente ao dia clicado
    this.events = this.events.filter(event => {
      const eventDate = event.start ? new Date(event.start).getTime() : null; // Converte a data e hora do evento para milissegundos
      const selectedDateTime = this.selectedDate ? this.selectedDate.getTime() : null; // Converte a data e hora selecionada para milissegundos

      return eventDate !== selectedDateTime; // Mantém eventos que não correspondem exatamente ao dia e hora selecionados
    });
      this.updateEvents();
      this.closeModal('eventModalEliminar')
    }
  }

  countEventsForSelectedDate(selectedDate: Date): number {
    // Converte a data selecionada para o formato Date (sem hora)
    const selectedDay = new Date(selectedDate).toDateString();

    // Filtra os eventos que ocorrem no mesmo dia
    const eventsForSelectedDate = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() == selectedDay;
    });

    // Retorna o número de eventos no dia selecionado
    return eventsForSelectedDate.length;
  }

  isEntradaOuSaida(): boolean {
    // Se o array de eventos estiver vazio, considera como hora de entrada


    // Converte a data selecionada para milissegundos
    const selectedDate = new Date(this.selectedDate).getTime(); // Converte para milissegundos
    const _selectedDay = new Date(selectedDate).toDateString();
    const eventsForSelectedDate = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() == _selectedDay;
    });
    if (eventsForSelectedDate.length == 0) {
      return true; // Se estiver vazio ou não houver eventos, considera como hora de entrada
    }
    const eventStartDate = new Date(eventsForSelectedDate[0].start).getTime(); // Converte o startDate do evento para milissegundos

    // Se a data selecionada for igual ao startDate do evento, é hora de entrada
    return selectedDate < eventStartDate;
  }




  showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }
  aproveEvent()
  {
    this.closeModal('eventModalPendente')
    if (this.selectedDate) {
      const newEvent = {
        title: 'Chegada',
        start: this.selectedDate.toISOString(), // Data e hora de início no formato ISO
        end: new Date(new Date(this.selectedDate).getTime() + 15 * 60 * 1000).toISOString(), // Adiciona 8 minutos
        color: this.isEntradaOuSaida()?'rgba(40, 167, 69, 1)':'#FF9800', // Cor do evento
        textColor: '#FFF', // Cor do texto
        extendedProps: {
          description: this.getTime(),
          priority: 'Alta',
          responsiblePerson: 'Hélio Vicente',
          type:this.isEntradaOuSaida()?'entrada':'saida'
        }
      };
      this.events.push(newEvent)
      this.updateEvents()
  }
  }

  updateEvents() {
    this.calendarOptions.events = [...this.events];
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  getTime()
  {
     if (!this.selectedDate) return
    const hours = this.selectedDate.getUTCHours(); // Pega a hora em UTC
    const minutes = this.selectedDate.getUTCMinutes(); // Pega os minutos em UTC
     return(` ${hours} h e ${minutes < 10 ? '0' + minutes : minutes} min`); // Formata para "7:10"
  }

  buscarFeriadosEAplicarNosEventos()
  {
    this.feriadosService.listar({}).pipe(
    ).subscribe((response:any) => {
      const eventos=response;
      eventos.forEach((element:any) => {
        const newEvent = {
          title: element.nome,
          date: new Date(element.dia_selecionado).toISOString().split('T')[0], // Formata a data
           extendedProps: {
            description: element.licenca_aplicada==1?'feriado':'indisponivel',
            obs:element.observacoes
          }
        };
        this.events.push(newEvent)
      });
    });
    this.calendarOptions.events=this.events
  }

  onDatesSet(info: any) {
    const dataAtualVisivel = info.view.currentStart;

    /* this.anoAtual = dataAtualVisivel.getFullYear();
    this.mesAtual = dataAtualVisivel.getMonth();  */ // `getMonth()` retorna 0 para Janeiro, então adicionamos 1

  }
}
