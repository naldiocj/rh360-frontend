import { Component, OnInit } from '@angular/core';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { MeiosDistribuidosService } from '@resources/modules/sigpq/core/service/Meios-distribuidos.service';
import { MeioModel } from '@resources/modules/sigpq/shared/model/meio.model';
import { Pagination } from '@shared/models/pagination';
import { FicheiroService } from '../../../../../../../core/services/Ficheiro.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  totalBase: number = 0
  public pagination = new Pagination()
  

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private meiosDistribuidosService: MeiosDistribuidosService,
    private agenteService: AgenteService,
    private ficheiroService: FicheiroService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer
  ) { }

  public fileUrl: any
  carregarDocumento:boolean=false
  ordens_de_servico: Array<any> = []
  _ordens_de_servico: Array<any> = []
  ngOnInit(): void {
    this.buscarMeiosDistribuidos()
    this.fullServicosAtribuidos()
    this._ordens_de_servico=this.ordens_de_servico
  }


  fullServicosAtribuidos()
  {
    this.ordens_de_servico.push({nome:'56,/2024, de 06 de Novembro',created_at:'11/03/2025',file:'ordem1',activo:true})
    this.ordens_de_servico.push({nome:'59/2024, de 18 de Dezembro',created_at:'01/02/2025',file:'ordem2',activo:false})
    this.ordens_de_servico.push({nome:'01/2025, de 17 de Janeiro',created_at:'10/03/2025',file:'ordem3',activo:false})
    this.ordens_de_servico.push({nome:'41/2024, de 08 de Julho',created_at:'27/12/2024',file:'ordem4',activo:true})
    this.ordens_de_servico.push({nome:'54/2024, de 15 de Outubro',created_at:'09/02/2025',file:'ordem5',activo:false})
    this.ordens_de_servico.push({nome:'05/2025, de 17 de Janeiro',created_at:'01/01/2025',file:'ordem6',activo:true})
  }

  buscarPorNome(termo: string) {
    // Se o termo de busca estiver vazio, retorna o array completo
    if (!termo || termo.trim() === '') {
      this._ordens_de_servico=this.ordens_de_servico;
    }
  
    // Converte o termo de busca para minúsculas (busca case-insensitive)
    const termoLowerCase = termo.toLowerCase();
  
    // Filtra o array para encontrar itens que correspondam ao termo de busca
    this._ordens_de_servico= this.ordens_de_servico.filter(item =>
      item.nome.toLowerCase().includes(termoLowerCase)
    );
  }

  buscarMeiosDistribuidos() {
    /* this.meiosDistribuidosService
      .listarMeiosDistribuidos(this.getPessoaId, this.filtro)
      .subscribe((response) => {

        this.meios = response.data;

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }) */
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
      this.buscarPorNome($e)

    }
    this.buscarMeiosDistribuidos()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarMeiosDistribuidos()
  }

  public get getPessoaId() {
    return this.agenteService.id as number
  }

  public getEstado(status: any): any {
    return status == true ? this.utilService.estado('E') : this.utilService.estado('R')
  }


  public download(documento:any,nome:any)
  {

  }

  documento:any
  public visualizar(documento:any)
  {
    this.carregarDocumento=true
    this.documento=documento
    this.fileUrl = 'assets/assets_pa/file/'+documento.file+'.pdf'//this.sanitizer.bypassSecurityTrustResourceUrl('assets/assets_pa/file/'+documento.file+'.pdf');
    this.carregarDocumento=false
  }

  
}
