import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';
import { DecisaoReclamacaoService } from '@resources/modules/sigpj/core/service/Decisao-reclamacao.service';
import { ParecerReclamacaoService } from '@resources/modules/sigpj/core/service/Parecer-reclamacao.service';
import { ReclamacaoService } from '@resources/modules/sigpj/core/service/Reclamacao.service';
import { ReclamacaoList } from '@resources/modules/sigpj/shared/model/reclamacao-list.model';
import { ReclamacaoModel } from '@resources/modules/sigpj/shared/model/reclamacao.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { canActivateValidation } from '@resources/modules/sigpj/shared/validation/canActivate.validation';
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public reclamacaos: ReclamacaoList[] = [];
  public modelController: any = null
  public isParecer: boolean = false;
  public isDecisao: boolean = false;
  public intervenientes: any[] = [];

  public isLoading: boolean = false


  public pagination = new Pagination();
  totalBase: number = 0

  NovoProcesso: any
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor(private reclamacao: ReclamacaoService,
    private guardUser: SigpjUserGuard,
    private guardRole: SigpjRoleGuard,
    private parecer: ParecerReclamacaoService,
    private decisaoService: DecisaoReclamacaoService,
    private router: Router,
    private canResolve: canActivateValidation) { }


  ngOnInit() {

    this.buscarReclamacao()
  }

  getModel(item: ReclamacaoModel) {
    const data = {
      permission: 'reclamacao-store'
    }
    if (this.guardUser.canActivate(this.canResolve.getRoute(data), this.canResolve.getState())
      || this.guardRole.canActivate(this.canResolve.getRoute(data), this.canResolve.getState())) {
        this.modelController = '#modalRegistarOuEditarReclamacao'
         this.NovoProcesso = item
         return
        }

        // alert('Acesso negado!')


  }


  // o script de busca de arguidos já foi eliminado
  buscarReclamacao() {

    this.isLoading = true;
    this.reclamacao.listar(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      // console.log("reclamacaos", response)
      response.data.map((data: any) => {
        this.reclamacaos = response.data;

        this.reclamacao.listarTotalArguido(data.id).subscribe((result) => {
          this.reclamacaos.forEach((datas) => {
            if (datas.id == result.processoID) {
              datas.totalArguido = result.total;
              datas.processoID = result.processoID;
            }
          });
        });
      })


      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });

  }

  verify(item: any) {
    //  console.log('atribute', item);
    //let control = false
    this.parecer.verUm(item.id).subscribe((response) => {
      if (!response || response == null || response == undefined) {
        window.alert(' Dados vazios no Parecer!');
        this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem']);
        this.isParecer = false;
        return;
      }

      this.isParecer = true;

      this.decisaoService.verUm(item.id).subscribe((response) => {
        if (!response || response == null || response == undefined) {

          console.log('decis', response)
          window.alert('Dados vazios na Decisão!');
          this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem']);

          this.isDecisao = false;
          return;
        }
        this.isDecisao = true;
        this.router.navigate([
          '/piips/sigpj/processo/reclamacao/detalhes/listagem',
          item.id,
        ]);
      });

    });

  }


  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarReclamacao()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarReclamacao()
  }

  construcao() {
    alert('Em construção')
  }
}
