import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { AquartelamentoAtribuirService } from '@resources/modules/sigae/core/aquartelamento-atribuir.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-expolhos',
  templateUrl: './expolhos.component.html',
  styleUrls: ['./expolhos.component.css'],
})
export class ExpolhosComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public onSucess: any;
  public valor: any;
  getPathCaminho:any;
  public lista_users: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  ob: any;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
  id!: number;
  is!: number;
  materias: any = {};

  constructor(
    private help: HelpingService,
    private atribuidos: AquartelamentoAtribuirService,
    private users: AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    console.log(this.filtro)
    this.is = this.help.isUser;
    this.mostrarAtribuidosSigae();
  }

  mostrarAtribuidosSigae() {
    const options = { ...this.filtro ,materialEstado: 'Expolho'};

    // this.isLoading = true;
    this.atribuidos
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.materias = response.data
        console.log(response);

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.mostrarAtribuidosSigae();

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.mostrarAtribuidosSigae();
  }

  public delete_(id: any) {

    this.id = id;
    this.atribuidos
      .deletar(id)
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina();
        },
      });
  }

  public getFileInformation(id: any=null, Url: any=null) {
    var url;
    url = Url
    this.getPathCaminho = this.help.pegarFicheiroCaminho(id, url);
  }

  public baixarFile(url: any) {
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
