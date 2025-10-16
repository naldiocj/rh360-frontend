import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { PermissaoService } from '@core/services/config/Permissao.service';
import { Pagination } from '@shared/models/pagination';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {


  public carregando: boolean = false;
  public permissoes: any[] = []
  public permissao: any = null
  public id: any = null
  public totalBase: number = 0
  public pagination: Pagination = new Pagination()
  private destroy$ = new Subject<void>()
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    modulo: 1,
  }
  public rolePermissions: any = []

  constructor(private permissionService: PermissaoService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.buscarPermissions()
  }

  private buscarPermissions() {
    this.carregando = true;
    const opcoes = {
      ...this.filtro
    }
    this.permissionService.listar(opcoes).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.permissoes = response.data


        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'modulo') {
      this.filtro.modulo = $e;
    }

    this.buscarPermissions()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.perPage = 5

    this.buscarPermissions()
  }

  setNull() {
    this.permissao = null;
    this.id = null
  }
  setItem(item: any) {

    this.permissao = item
  }

  setId(id: any) {
    this.id = id
  }

  public toggleActivo(id: any) {
    this.permissionService.toggleActivo(id).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {

      })
    ).subscribe((): void => {
      this.buscarPermissions()
      this.modalService.fechar('btn-close-activo')
    })
  }

}
