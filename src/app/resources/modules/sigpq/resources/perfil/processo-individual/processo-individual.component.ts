import { Component, Input, OnInit } from '@angular/core';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { ModalService } from '@core/services/config/Modal.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-processo-individual',
  templateUrl: './processo-individual.component.html',
  styleUrls: ['./processo-individual.component.css']
})
export class ProcessoIndividualComponent implements OnInit {

  @Input() pessoaId: any
  totalBase: number = 0
  public pagination = new Pagination()
  documentos: any = []
  documento: any = null
  documentosFile: any = []
  fileUrl: any
  carregarDocumento: boolean = false
  today: Date = new Date();

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private funcionarioServico: FuncionarioService,
    public formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.buscarDocumento()
  }

  isExpired(dataExpira: string): boolean {
    const expiraDate = new Date(dataExpira); // Converte a data expira para um objeto Date
    const todayDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()); // Cria um objeto Date apenas com dia, mês e ano

    return expiraDate < todayDate; // Verifica se a data de expiração é menor que hoje
}

 private buscarDocumento() {

    if (!this.pessoaId) return

    this.funcionarioServico
      .buscarUm(this.getId)
      .pipe(
        finalize(() => {
          this.carregarDocumento = false
        })
      )
      .subscribe((response) => {

        this.documentosFile = response.sigpq_documentos.filter((documento: any) => {
          // Use includes para verificar se o valor está presente no array
          if (['Pessoal', 'Profissional'].includes(documento.nid)) {
            return true; // Retorna true para incluir o documento no resultado
          }
          return false
        });

        this.documentos = response.sigpq_documentos.filter((documento: any) => {
          // Use includes para verificar se o valor está presente no array
          if (['Pessoal', 'Profissional'].includes(documento.nid)) {
            return true; // Retorna true para incluir o documento no resultado
          } else {
            return false; // Retorna false para excluir o documento do resultado
          }
        });

      })
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

  visualizar(documento: any) {
    this.showModal("modalProvimento")
    if ([1, 2, 4].includes(documento.sigpq_tipo_documento_id)) {
      this.documento = this.documentosFile.find((d: any) => d.sigpq_tipo_documento_id === documento.sigpq_tipo_documento_id)
    } else {
      this.documento = documento
    }

    const opcoes = {
      pessoaId: this.getId,
      url: ''
    }

    this.fileUrl = null

    if (['Pessoal', 'Profissional'].includes(documento.nid)) {
      opcoes.url = documento.anexo || null
    } else {
      const documentoAux = this.documentosFile.find((f: any) => f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id)
      opcoes.url = documentoAux.anexo
    }

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

  construcao() {
    alert('Em construção')
  }

  fechar() {
    this.modalService.fechar('closed')
  }

  public get getId() {
    return this.pessoaId as number
  }


  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarDocumento()
  }

 public recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarDocumento()

  }



}
