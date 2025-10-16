




import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { ModalService } from '@core/services/config/Modal.service';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core';
import { EventoService } from '@resources/modules/sigpq/core/service/Evento.service';
import { TipoEventoService } from '@resources/modules/sigpq/core/service/Tipo-evento.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { SecureService } from '@core/authentication/secure.service';

import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { MeuOrgaoService } from '@resources/modules/pa/core/service/meu-orgao.service';

import { SolicitacaoService } from '@resources/modules/pa/core/service/solicitacao.service';
import { CancelarSolicitacaoService } from '@resources/modules/pa/core/service/cancelar-solicitacao.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { SolicitaoSocketService } from '@resources/modules/pa/core/service/socket/solicitacao.service';

type Anos = {
  ano_1: number;
  ano_2: number;
  ano_3: number;
  ano_4: number;
  ano_5: number;
};
class TipoEvento {
  id: any;
  text: any;
  cor: any;
}
@Component({
  selector: 'app-sigpq-perfil-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit, OnChanges {
  @Input() public evento: any = null;
  @Input() abrir: boolean = false;
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>();
  @Output() onFalse!: EventEmitter<any>

  public meuOrgao: any = {};

  @Input() pessoaId: any
  // public current_ano: number = new Date().getFullYear();

  // anos: Anos = { ano_1: 0, ano_2: 0, ano_3: 0, ano_4: 0, ano_5: 0 };

  isLoading: boolean = false;
  isLoadingEvento: boolean = false;
  public edit: boolean = false;
  type_vaccancy: boolean = false;
  type_vaccancy_: boolean = false;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public justificar: boolean = false;

  simpleForm!: FormGroup;
  tipo_eventos: Array<Select2OptionData> = [];
  todos_estados: Array<Select2OptionData> = [];
  eventos: Array<Select2OptionData> = [];
  eventos_: any = [];

  date = new Date();

  calendarOptions: CalendarOptions = {
    locale: 'pt-br',
    allDayText: '24 horas',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.registarModal.bind(this),
    eventClick: this.editarModal.bind(this),
    initialView: 'dayGridMonth',
    aspectRatio: 2,
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
      right: 'timeGridWeek,dayGridMonth,listWeek',
    },
    events: [],
  };

  eventoSelecionado: any = [];

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
    pessoafisica_id: this.getPessoaId,
  };

  constructor(
    private fb: FormBuilder,
    private agenteSolicitacaoService: SolicitacaoService,
    private tipoEventoService: TipoEventoService,
    private modalService: ModalService,
    private agenteService: AgenteService,
    private solicitacaoService: SolicitaoSocketService,
    private meuOrgaoService: MeuOrgaoService,
    private eventoService: EventoService,
    private cancelarSolicitacaoService: CancelarSolicitacaoService,
    private utilService: UtilService
  ) {

    this.onFalse = new EventEmitter<any>()
  }

  ngOnInit(): void {
    this.createForm();

    // this.buscarEvento();
    this.buscarTodosEstados();
    // this.updateAnos();
    this.buscarOrgao();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.abrir == true) {
      window.dispatchEvent(new Event('resize'))
    }
    this.onFalse.emit({ abrir: false })

  }

  // updateAnos() {
  //   this.anos.ano_1 = this.current_ano as number;
  //   this.anos.ano_2 = this.anos.ano_1 + 1;
  //   this.anos.ano_3 = this.anos.ano_2 + 1;
  //   this.anos.ano_4 = this.anos.ano_3 + 1;
  //   this.anos.ano_5 = this.anos.ano_4 + 1;
  // }


  public get data(): string | Date {

    return this.utilService.dataActual
  }

  entrarSala() {
    setTimeout(() => {
      this.join({
        pessoa: this.agenteService.id,
        room: this.meuOrgao.pessoajuridica_id,
      });
    }, 1500);
  }

  join(data: any) {
    this.solicitacaoService.entrarSala(data);
  }

  buscarOrgao() {
    this.meuOrgaoService
      .listarUm(this.agenteService.id)
      .subscribe((response: any) => {
        this.meuOrgao = response;
      });
  }
  // buscarEvento() {
  //   this.isLoadingEvento = true;
  //   this.agenteSolicitacaoService
  //     .calendario(this.getPessoaId, this.options)
  //     .pipe(
  //       finalize(() => {
  //         this.isLoadingEvento = false;
  //       })
  //     )
  //     .subscribe((response) => {

  //       this.eventos_ = response.map((o: any) => ({
  //         id: o.id,
  //         text: o.tipo_evento_nome,
  //         cor: o.color,
  //       }));

  //       this.calendarOptions.events = response;
  //     });
  // }
  isEdit(): boolean {
    return this.edit;
  }

  public get getPessoaId(): number {
    return this.pessoaId
  }

  buscarTodosEstados() {
    this.todos_estados = this.eventoService
      .estadoTodos()
      .map((o: any) => ({ id: o.sigla, text: o.nome }));
  }

  createForm() {
    this.simpleForm = this.fb.group({
      titulo: ['', Validators.compose([Validators.required, Validators.minLength(20)])],
      data: ['', [Validators.required]],
      data_: [''],
      estado: ['E'],
      justificacao: [''],
      pessoafisica_id: this.getPessoaId,
      sigpq_tipo_evento_id: ['', [Validators.required]],
      observacao: ['', Validators.compose([Validators.required, Validators.minLength(40)])],
    });
  }

  onSubmit(event: any) {
    if (event.target.dataset['solicitar']) {
      if (this.simpleForm.invalid || this.isLoading) {
        return;
      }

      this.isLoading = true;

      this.agenteSolicitacaoService
        .registar(this.simpleForm.value)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response: any) => {
          this.emitirSocket(response);
          this.modalService.fechar('closed');
          this.reiniciarFormulario();
          this.eventRegistarOuEditModel.emit(true);
        });
    } else if (event.target.dataset['cancelar']) {
      this.isLoading = true;
      this.cancelarSolicitacaoService
        .registar(this.getPessoaId, this.simpleForm.value)
        .pipe(
          finalize((): void => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            this.solicitacaoService.cancelar(response);
          },
          error: (erro: any) => {
            console.log(erro);
          },
        });

      this.modalService.fechar('closed');
      this.createForm();
    }
  }

  emitirSocket(response: any) {
    const data = { ...response };

    this.solicitacaoService.enviar(data);
  }

  onJustificar(event: any): void {
    this.justificar = event.target.value.length > 12;
  }

  editarModal(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
    this.edit = true;
    this.simpleForm.patchValue({
      sigpq_tipo_evento_id: clickInfo.event.extendedProps['tipo_evento_id'],
      titulo: clickInfo.event.title,
      data: clickInfo.event.startStr,
      data_: clickInfo.event.extendedProps['fim'],
      justificacao: clickInfo.event.extendedProps['justificacao'],
      observacao: clickInfo.event.extendedProps['description'],
      color: '#f02424',
      estado: clickInfo.event.extendedProps['estado'],
    });

    if (
      clickInfo.event.extendedProps['tipo_evento_nome']
        .toLowerCase()
        .includes('férias')
    ) {
      this.type_vaccancy = true;
    }
    this.simpleForm.addControl('id', new FormControl(clickInfo.event.id));
    this.simpleForm.addControl(
      'pessoajuridica_id',
      new FormControl(clickInfo.event.extendedProps['pessoajuridica_id'])
    );
    this.simpleForm.addControl(
      'solicitacao_id',
      new FormControl(clickInfo.event.extendedProps['solicitacao_id'])
    );

    this.modalService.fechar('modal-add-event');

    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  // handleDateClick(arg: any): void {
  //   alert('date click! ' + arg.dateStr)
  // }

  novo(event: any) {
    // this.edit = false;
    if (event.target.dataset['type']) {
      this.type_vaccancy = true;
      this.tipo_eventos = this.tipo_eventos.filter((o: any) =>
        o.text.toLowerCase().includes('férias')
      );
    }
  }

  registarModal(item: DateSelectArg) {
    this.edit = false;
    this.eventoSelecionado = item;
    this.simpleForm.patchValue({
      data: item.startStr,
    });
    this.modalService.fechar('modal-add-event');
  }
  reiniciarFormulario() {
    this.simpleForm.reset();
    // this.buscarEvento();
    this.createForm();
  }

  returnEstado(item: any) {
    return this.eventoService.estado(item);
  }

  //
  editarModalrEvento() {
    const { titulo, data, observacao } = this.simpleForm.value;
    // const tipo_evento: TipoEvento = this.tipo_eventos.find(o => o.id == this.simpleForm.value.sigpq_tipo_evento_id)

    // if(!tipo_evento) return

    // console.log(tipo_evento);

    const calendarApi = this.eventoSelecionado.view.calendar;
    calendarApi.unselect(); // clear date selection
    calendarApi.addEvent({
      // id: iterator.id,
      title: titulo,
      start: data,
      description: observacao,
      color: '#f02424',
      // tipo_evento_nome: tipo_evento.text,
      estado: 'P',
    });
  }

  reset() {
    this.reiniciarFormulario();
    this.type_vaccancy = false;
    this.edit = false;
  }

  // paint(event: any) {
  //   const btns: Array<HTMLElement> = Array.from(
  //     document.querySelectorAll(`.${event.target.classList[8]}`)
  //   );
  //   btns.forEach((btn: HTMLElement) => {
  //     btn.classList.remove('active');
  //   });
  //   event.target.classList.toggle('active');
  // }
  // setNumber1(event: any) {
  //   this.anos.ano_1 = Number.parseInt(event.target.value);
  //   this.anos.ano_2 = this.anos.ano_1 + 1;
  //   this.anos.ano_3 = this.anos.ano_2 + 1;
  //   this.anos.ano_4 = this.anos.ano_3 + 1;
  //   this.anos.ano_5 = this.anos.ano_4 + 1;
  //   console.log(this.anos.ano_5);
  // }
  // setNumber2(event: any) {
  //   this.anos.ano_2 = Number.parseInt(event.target.value);
  //   this.anos.ano_3 = this.anos.ano_2 + 1;
  //   this.anos.ano_4 = this.anos.ano_3 + 1;
  //   this.anos.ano_5 = this.anos.ano_4 + 1;
  // }
  // setNumber3(event: any) {
  //   this.anos.ano_3 = Number.parseInt(event.target.value);
  //   this.anos.ano_4 = this.anos.ano_3 + 1;
  //   this.anos.ano_5 = this.anos.ano_4 + 1;
  // }
  // setNumber4(event: any) {
  //   this.anos.ano_4 = Number.parseInt(event.target.value);
  //   this.anos.ano_5 = this.anos.ano_4 + 1;
  // }
  // setNumber5(event: any) {
  //   this.anos.ano_5 = Number.parseInt(event.target.value);
  // }

  // onSelect(event: any) {
  //   if (event == 1) {
  //     this.type_vaccancy_ = true;
  //   } else {
  //     this.type_vaccancy_ = false;
  //   }
  // }



}













