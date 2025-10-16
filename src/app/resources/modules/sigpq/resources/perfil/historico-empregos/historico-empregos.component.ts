import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { ModalService } from '@core/services/config/Modal.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize } from 'rxjs';
import { OutrosEmpregosFuncionarioService } from '../../../core/service/Outros-Empregos-Funcionario.service';

@Component({
  selector: 'app-sigpq-historico-empregos',
  templateUrl: './historico-empregos.component.html',
  styleUrls: ['./historico-empregos.component.css']
})
export class HistoricoEmpregoComponent implements OnInit {

  public totalBase: number = 0
  @Input() public pessoaId: any = 5
  public pagination = new Pagination()
  public historicoEmpregos: Array<any> = []
  public historicoEmprego: any
  public id: any
  public fileUrl: any
  public documento: any
  public carregarDocumento: boolean = false;



  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private historicoEmpregoService: OutrosEmpregosFuncionarioService,
    private formatarData: FormatarDataHelper,
    private modalService: ModalService,
    private ficheiroService: FicheiroService,
    public formatarDataHelper: FormatarDataHelper,
  ) { }

  ngOnInit(): void {
    this.listarhistoricoEmprego();
    
  }

  showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  listarhistoricoEmprego() {
    const opcao = {
      ...this.filtro,
      pessoafisica_id: this.getPessoaId
    }
    this.historicoEmpregoService
      .listarTodos(opcao)
      .subscribe((response) => {


        this.historicoEmpregos = response.data;
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.listarhistoricoEmprego()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.listarhistoricoEmprego()
    this.setNullhistoricoEmprego()
    this.id = null
  }

  public get getPessoaId() {
    return this.pessoaId as number
  }

  public sethistoricoEmprego(item: any) {
    this.historicoEmprego = item;

    console.log(item)
  }

  private setNullhistoricoEmprego() {
    this.historicoEmprego = null;


  }

  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


  public eData(data: any): boolean {
    return data != '0000-00-00' ? true : false
  }


  public setId(id: any) {
    this.id = id;
  }

  public eliminarhistoricoEmprego() {
    this.historicoEmpregoService.eliminar(this.id).pipe().subscribe({
      next: (respponse: any) => {
        this.modalService.fechar('btn-close')
        this.recarregarPagina()
      }
    })
  }


  public construcao(): void {
    alert('Em contrução')
  }
  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }

  visualizar(documento: any) {

    this.showModal("modalEmprego")
    const opcoes = {
      pessoaId: this.getPessoaId,
      url: ''
    }

    this.fileUrl = null


    opcoes.url = documento.anexo || null

    this.documento = documento


    if (!opcoes.url) return false

    this.carregarDocumento = true
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }
}
