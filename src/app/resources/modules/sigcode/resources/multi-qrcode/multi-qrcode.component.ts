import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { QrService } from '../../core/service/qr.service';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { catchError, finalize } from 'rxjs';
import { IziToastService } from '@core/services/IziToastService.service';
import { Pagination } from '@shared/models/pagination';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';

@Component({
  selector: 'app-multi-qrcode',
  templateUrl: './multi-qrcode.component.html',
  styleUrls: ['./multi-qrcode.component.css'],
})
export class MultiQrcodeComponent implements OnInit {
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
  private TotalIds: number = 1;
  private arrayIds: Array<any> = [];
  public items: any;
  public id!: number;
  public showItems: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
  };
  public valor: any;
  private date: any;
  public orgao: Array<Select2OptionData> = [];
  public direcao: any;
  private data: any;
  public formNip!: FormGroup;
  private index: number = 0;
  constructor(
    private nip: QrService,
    private fb: FormBuilder,
    private orgaoservice: DirecaoService,
    private agentes: AgenteOrgaoService,
    private toast: IziToastService
  ) {}

  ngOnInit(): void {
    this.listarItems();
    this.startForms();
    console.log(this.filtro.search);
  }

  public startForms() {
    this.formNip = this.fb.group({
      pessoa_id: [''],
      orgao_id: [''],
      qrcode: [''],
      descricao: [''],
    });
  }

public pesquisar($event:any){
console.log($event)
}

  private listarItems() {
    const options = { ...this.filtro };

    this.agentes
      .verAgenteOrgao (options)
      .pipe(catchError((e):any => { this.toast.erro("erro ao listar os valores!"); }))
      .subscribe((response:any) => {
        this.items = response;
        console.log(this.items);
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public start() {
    //  console.log(this.nip_value);
    this.date = new Date();
    this.date = this.date.getFullYear();
    this.index++;
    let numero =
      this.index.toString().padStart(4, '000') + this.getLastvalue(this.date);
    this.valor = numero;

    if (this.valor >= 9999 + this.getLastvalue(this.date)) {
      alert('ja nao é possivel gera mais codigos NIPs');
      console.log('limite atingido');
    }
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
      // this.alertas.info("preencha o campo!!");
    }
    var realTime = Date.now();
    var dataActual = new Date(realTime);
    var mes = dataActual.getMonth() + 1;
    var dia = dataActual.getDay();
    var ano = dataActual.getFullYear();
    var FormatedDate = dia + '/' + mes + '/' + ano;

    var insetRow: any = document.querySelector('#table');
    for (let index = 0; index < this.data; index++) {
      this.start();
      const addRow = document.createElement('tr');
      addRow.innerHTML = `
       <td>${this.valor} </td>
       <td>N/P</td>
       <td>${FormatedDate} </td>
       <td><i class="bi bi-three-dots-vertical"></i> </td>
     `;
      insetRow.appendChild(addRow);
    }
  }

  public editar(id: number, content: any) {
    this.nip
      .actualizar(id, content)
      .pipe(
        catchError((e): any => {
          this.toast.erro('erro ao editar, error name:');
        })
      )
      .subscribe((d) => {
        console.log('done');
        return null;
      });
  }
  public criarItems() {}

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
    this.valor = $event;
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
    this.agentes.verAgenteOrgao ({ pessoajuridica_id: $event }).subscribe({
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

  public getSelecionado(data: any) {
    var orgao_id = (this.formNip.value.orgao_id = data.pessoajuridica_id);
    var pessoa_id = (this.formNip.value.pessoa_id = data.id);
    var dataGroup: any;

    dataGroup = this.juntar(orgao_id, pessoa_id, '-');
    console.log(dataGroup);

    this.arrayIds[this.TotalIds++] = dataGroup;
    //var id = dataGroup;
    //this.TotalIds = this.index;

    console.log('TotalIds:' + this.arrayIds[this.TotalIds++]);
    var count = this.TotalIds;
    console.log('total de items:' + count);
  }

  private addItem(vector: any) {
    var VerifItems: any = this.receberData(vector);
    const val = VerifItems.map((i: any) => {
      this.formNip.value.descricao = i;
      console.log(this.formNip.value);
      this.nip.registar(this.formNip.value).subscribe({
        next: (e) => {
          console.log(e);
        },
        error: (e) => {
          this.toast.erro('Erro cadastra os items');
        },
      });
    });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  public juntar(a: any, b: any, c:any) {
    var s = a + c + b;
    return s;
  }

  public remDuos(numero: number[]) {
    const num = new Set(numero);
    return [...num];
  }
}
