import { Component, OnInit } from '@angular/core';
import { NipService } from '../../core/service/nip.service';
import { catchError, finalize } from 'rxjs';
import { Pagination } from '../../../../../shared/models/pagination';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { error } from 'jquery';

@Component({
  selector: 'app-listar-nip',
  templateUrl: './listar-nip.component.html',
  styleUrls: ['./listar-nip.component.css'],
})
export class ListarNipComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public direcao: any;
  public formNip!: FormGroup;
  public direcoes: Array<Select2OptionData> = [
    { id: '', text: '--Selecione uma opçao--' },
    { id: 'Orgao', text: 'Orgao Central' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
  ];
  public options: any = {
    placeholder: 'seleccione uma opçao',
    width: '100%',
  };
  public items: any;
  public id!: number;
  public showItems: any;
  public orgao: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
  };

  constructor(
    private Nip: NipService,
    private orgaoservice: DirecaoService,
    private agentes: AgentesService
  ) {}

  ngOnInit(): void {
    this.start();
  }

  private start() {
    const options = { ...this.filtro };

    this.Nip.listar(options).subscribe((response) => {
      this.items = response.data;
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
  public editar(id: number, content: any) {
    this.Nip.actualizar(id, content)
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
  public setId(id: number) {
    this.id = id;
    console.log(id);
  }
  public evento($event: any) {
    var valor = $event.target.value;
  }
  public setItems(data: any) {
    this.showItems = data;
    console.log(data);
  }
  public get GetId() {
    return this.id;
  }

  public delete() {
    this.Nip.deletar(this.GetId)
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
    this.start()

    // this.mostrar_organicas(this.filtro.search);
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
    var orgao = this.agentes.listar({ pessoajuridica_id: $event }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.orgao = res.map(
          (p: any) => ({
            id: p.id,
            text: p.nome + '-' + p.apelido,
          }),
          console.log(orgao)
        );
        console.log(this.orgao);
      },
    });
  }

  public reAtribuir() {
    const id = (this.formNip.value.num_nip = this.GetId);
    this.Nip.actualizar(id, this.formNip.value).subscribe({
      next: () => {
        return null;
      },
      error: () => {
        throw error('Erro ao actualizar NIP');
      },
    });
  }
}
