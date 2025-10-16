import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FuncionarioService } from '@core/services/Funcionario.service';

import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { Funcionario } from '@shared/models/Funcionario.model';
import { ActivatedRoute } from '@angular/router';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';

@Component({
  selector: 'sigpj-registar-ou-editar-interveniente-model',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})

export class RegistarOuEditarIntervenienteComponent implements OnInit {

  @Input() disciplinar: any = null
  @Output() eventRegistarOuEditDisciplinarModel = new EventEmitter<boolean>()

  public funcionarios: Funcionario[] = [];
  public arguidos: Funcionario[] = [];

  public pagination = new Pagination();
  totalBase: number = 0;
  isLoading: boolean = false;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  constructor(
    private route: ActivatedRoute,
    private funcionarioServico: FuncionarioService,
    private arguidoService: ArguidoDisciplinarService,
  ) { }

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }

  ngOnInit(): void {
    this.buscarFuncionarios()
  }

  buscarFuncionarios() {
    this.isLoading = true;
    this.funcionarioServico
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.funcionarios = response.data
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionarios();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncionarios();
  }

  verifyArguido(arguido: any) {
    // this.verifyIn(arguido);

    // console.log('estado da inclusao', this.listedArguido)
    // const options = {
    //   disciplinar_id: this.getId,
    // };
    // console.log('dados do arguido', arguido)
    // this.arguidoService
    //   .verAdicionado(arguido.id, options)
    //   .subscribe((response) => {
    //     if (!response || response === null || response === undefined) {
    //       this.arguidos.push(arguido);
    //       return;
    //     }

    //     window.alert('Interveniente Existente!');
    //   });

    // console.log('fora da condicao', this.listedArguido)
  }

  selectedFuncionario(response: any) {
    // this.listedArguido = false
    // this.arguidos.forEach(item => {
    //   if (item.id === response.id) {
    //     this.listedArguido = true
    //     alert('Ja atribuido');
    //     return;
    //   }
    // })

    // if (this.listedArguido) {
    //   return;
    // }
    // this.verifyArguido(response);

  }

  adicionarArguido(item: Funcionario) {
    this.arguidos.push(item)
  }

  removerArguido(item: Funcionario) {
    const index = this.arguidos.indexOf(item);
    if (index > -1) {
      this.arguidos.splice(index, 1);
    }
  }

  registarArguido() {

    const options = {
      acusado: 0,
      agentes: this.arguidos?.map(({ id }) => id) || [],
      disciplinar_id: this.getId,
    };

    this.arguidoService
      .registarIntervenientes(options)
      .pipe(finalize(() => { }))
      .subscribe((item) => {
        this.eventRegistarOuEditDisciplinarModel.emit(true)
        // this.router.navigate(['/piips/sigpj/processo/disciplinar/listagem']);
        this.arguidos = []
      });
  }

}
