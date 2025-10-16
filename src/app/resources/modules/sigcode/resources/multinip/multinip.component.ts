import { Component, OnInit } from '@angular/core';
import { NipService } from '../../core/service/nip.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, finalize } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { Pagination } from '@shared/models/pagination';
import { IziToastService } from '@core/services/IziToastService.service';

@Component({
  selector: 'app-multinip',
  templateUrl: './multinip.component.html',
  styleUrls: ['./multinip.component.css'],
})
export class MultinipComponent implements OnInit {
  public direcoes: Array<Select2OptionData> = [
    { id: '', text: '--Selecione uma opçao--' },
    { id: 'Orgao', text: 'Orgao Central' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
  ];

  public options: any = {
    width: '100%',
    placeholder: 'selecione uma opção',
  };

  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public TotalIds: any;
  public checkedArray: any = [];
  public count: any;
  public arrayIds: any;
  public items: any;
  public valor!: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
  };
  private date: any;
  public orgao: Array<Select2OptionData> = [];
  public direcao: any;
  private data: any;
  public formNip!: FormGroup;
  private index: number = 0;
  constructor(
    private nip: NipService,
    private fb: FormBuilder,
    private orgaoservice: DirecaoService,
    private agentes: AgentesService,
    private toast: IziToastService
  ) {}

  ngOnInit(): void {
    this.listarItems();
    this.criarForms();
  }

  private listarItems() {
    const options = { ...this.filtro };

    this.agentes
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.items = response;
        console.log(this.items)
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }
  public start(data: any) {
    //  console.log(this.nip_value);
    this.date = new Date();
    this.date = this.date.getFullYear();
    this.index++;
    let numero =
      this.index.toString().padStart(4, '000') +
      data +
      this.getLastvalue(this.date);
    this.valor = numero;
    if (this.valor >= 9999 + this.getLastvalue(this.date)) {
      alert('ja nao é possivel gera mais codigos NIPs');
      console.error('limite atingido');
    }
    this.formNip.value.num_nip = numero;

  }

  public getLastvalue(correntYear: number) {
    //temporario codigo de pegar o ultimo valores do ano
    var ano = 2000;
    return correntYear - ano;
  }

  public receberData($event: any) {
    var value = $event.target?.value;
    this.data = value;
  }

  public criar() {
    if (this.data == null) {
      this.toast.alerta('preencha o campo!!');
    }
    var realTime = Date.now();
    var dataActual = new Date(realTime);
    var mes = dataActual.getMonth() + 1;
    var dia = dataActual.getDay();
    var ano = dataActual.getFullYear();
    var FormatedDate = dia + '/' + mes + '/' + ano;
  }

  public editar(id: number, content: any) {
    this.nip
      .actualizar(id, content)
      .pipe(
        catchError((e): any => {
          console.log('erro ao editar, error name:', e.name);
        })
      )
      .subscribe((d) => {
        console.log('done');
        return null;
      });
  }
  public criarForms() {
    this.formNip = this.fb.group({
      pessoa_id: [''],
      orgao_id: [''],
      num_nip: [''],
    });
  }

  public delete() {
    this.nip
      .deletar(this.valor)
      .pipe(
        catchError((e): any => {
          console.error('erro ao deletar items, error name:', e.name);
        })
      )
      .subscribe((e) => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
  }

  public evento($event: any) {
    this.valor = $event.target.value;
    console.log($event);
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    this.orgaoservice
      .listar({ tipo_orgao: $event })
      .subscribe((response: any): void => {
        console.log(response);
        this.direcao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        console.log(this.direcao);
      });
  }

  selecionarAgente($event: any) {
    console.log($event);
    this.agentes.listar({ pessoajuridica_id: $event }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.orgao = res.map(
          (p: any) => ({
            id: p.id,
            text: p.nome + '-' + p.apelido,
          }),
          console.log(this.orgao)
        );
        console.log(this.orgao);
      },
    });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
  }
  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.listarItems()
    // this.mostrar_organicas(this.filtro.search);
  }
  public getSeleciona(data: any) {
    console.log(data);
    var pessoa_id = (this.formNip.value.pessoa_id = data.id);
    var dataGroup: any;
    dataGroup = pessoa_id;
    console.log(dataGroup);

    this.arrayIds[this.TotalIds++] = dataGroup;

    console.log('TotalIds:' + this.arrayIds[this.TotalIds++]);
    var count = this.TotalIds;
    console.log('total de items:' + count);
  }

  public getSelecionado(data: any) {
    this.index += 1;
    this.checkedArray[this.index] = data.id;
    var pessoa_id = (this.formNip.value.pessoa_id = data.id);
    var id = data;
    this.count = data;
    this.count = this.index;
    console.log(this.checkedArray);
  }

  public atribuirNipParaAgentes() {
    var data: any =this.checkedArray.map((p: any) => {
      this.start(p);
   console.log(this.formNip.value)
    });
  }

  public removerDuplicados(numero: any): any {
    for (let i = 0; i < numero.lenght; i++) {
      if (numero[i] == numero[i + 1]) {
        //apagado
      } else {
        return numero;
      }
    }
  }
}
