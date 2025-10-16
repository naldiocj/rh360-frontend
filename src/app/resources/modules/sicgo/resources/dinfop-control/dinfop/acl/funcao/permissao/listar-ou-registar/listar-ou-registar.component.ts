import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModuloService } from '@core/services/config/Modulo.service';
import { PermissaoService } from '@core/services/config/Permissao.service';
import { PermissaoRoleService } from '@core/services/config/PermissaoRole.service';
import { PermissionService } from '@resources/modules/sigpj/core/service/Permission.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'permissao-listar-ou-registar',
  templateUrl: './listar-ou-registar.component.html',
  styleUrls: ['./listar-ou-registar.component.css']
})
export class ListarOuRegistarComponent implements OnInit, OnDestroy, OnChanges {

  @Input() perfil: any = null
  @Output() onRegistar!: EventEmitter<void>
  public carregando: boolean = false;
  public permissoes: any[] = []
  public totalBase: number = 0
  public pagination: Pagination = new Pagination()
  public modulos: Array<Select2OptionData> = []
  private destroy$ = new Subject<void>()
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    modulo: 1,
    darAcesso: true,
  }
  public rolePermissions: any = []
  constructor(private moduloService: ModuloService, private permissionService: PermissaoService, private permissionRoleService: PermissaoRoleService) {
    this.onRegistar = new EventEmitter<void>()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['perfil'].currentValue != changes['perfil'].previousValue && this.perfil != null) {
      this.buscarPermissaoRoles()
    }
  }

  ngOnInit(): void {
    this.buscarPermissions()
    this.buscarModulos()
  }

  buscarModulos(): void {
    const opcoes = {}
    this.moduloService.listar(opcoes)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response) => {
        this.modulos = []
        this.modulos.push({
          id: 'null',
          text: 'Todos'
        })
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome
        }))
        this.modulos.push(...aux)

      })
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

  get getFuncao() {
    return this.perfil?.nome
  }
  get getFuncaoId() {
    return this.perfil?.id
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

  buscarPermissaoRoles() {
    const opcao = {
      roleId: this.getFuncaoId
    }
    this.permissionRoleService.listarTodos(opcao).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.rolePermissions = response
      }
    })
  }

  public isRolePermission(permissionId: any) {
    const rp = this.rolePermissions.filter((item: any) => item.permission_id == permissionId)
    return rp?.length > 0
  }

  public togglePermissao(permissionId: any) {

    const objecto = {
      role_id: this.getFuncaoId,
      permission_id: permissionId
    }

    this.permissionRoleService.registar(objecto).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {

      })
    ).subscribe((): void => {
      setTimeout(() => {
        this.buscarPermissaoRoles()
        this.buscarPermissions()
      }, 500)
    })

  }

  btnExit() {
    this.onRegistar.emit()
    this.recarregarPagina()
  }

}
