import { finalize } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { EscalaTrabalhaService } from '@resources/modules/pa/core/service/escala-trabalha.service';
import { Pagination } from '@shared/models/pagination';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-sigpq-escala-trabalhos',
  templateUrl: './escala-trabalhos.component.html',
  styleUrls: ['./escala-trabalhos.component.css']
})
export class EscalaTrabalhosComponent implements OnInit {

  @Input() pessoaId: any
  @Input() funcionario: any
  totalBase: number = 0



  public pagination: Pagination = new Pagination()
  public escalas: any = []
  public carregando: boolean = false;
  public reclamacao_id: number | undefined
  public fileUrl: any
  public escala: any

  filtro: any = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy: ['pst.seccao', 'p.nome_completo', 'pj.sigla', 'dp.sigla', 'dp.sigla', 'dpd.nome_completo', 'pst.created_at', 'pst.updated_at'],
    order: 'pst.created_at',
  };
  constructor(private escalaService: EscalaTrabalhaService, private utilService: UtilService, private ficheiroService: FicheiroService, private secureService: SecureService) { }



  ngOnInit(): void {
    // this.buscarEscalaTrabalhos()
  }

  private buscarEscalaTrabalhos() {
    this.carregando = true;
    this.filtro.pessoafisica_id = this.getPessoafisicaId
    this.filtro.pessoajuridica_id = this.getPessoajuridicaId
    this.escalaService.listar(this.filtro).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {

        this.escalas = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })


  }


  public filtrarPagina(key: any, event: any) {
    if (key == 'page') {
      this.filtro.page == event
    } else if (key == ! "perPage") {
      this.filtro.perPage = event.target.value
    } else if (key == "search") {
      this.filtro.search = event
    }
    this.buscarEscalaTrabalhos()
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarEscalaTrabalhos()
    this.modalFechado()
  }


  public get getPessoaId(): number {
    return this.pessoaId as number
  }


  public get getFuncionario(): any {
    return this.funcionario;
  }


  public verArquivo(id: any, url: any) {
    this.reclamacao_id = id
    const opcoes: any = {
      pessoaId: this.getPessoaId,
      url: url
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

      })
    ).subscribe((file: any) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);

    });
  }

  private get getPessoafisicaId(): any {
    return this.pessoaId as number
  }

  private get getPessoajuridicaId(): any {
    return this.secureService.getTokenValueDecode().orgao.id
  }


  public getTurno(sigla: any): any {
    return this.utilService.turno(sigla).nome
  }

  public getData(data: any) {
    return this.utilService.dataNormal(data).dia?.sigla + ' ' + this.utilService.dataNormal(data).mes.sigla + ' ' + this.utilService.dataNormal(data).ano
  }
  public getEstado(status: any): any {
    return this.utilService.estado_escala(status)
  }

  public modalFechado() {
    this.escala = null
  }

  public setEscalaTrabalho(item: any) {

    this.escala = item;
  }

  public cancelarEscala(id: any) {
    this.escalaService.eliminar(id).pipe().subscribe({
      next: (response: any) => {
        this.recarregarPagina()
    }
    })
  }

}

