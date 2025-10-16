import { Component, Input, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';
import { Pagination } from '@shared/models/pagination';
import { finalize, Subscription, timer, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recebida-direcao',
  templateUrl: './recebida-direcao.component.html',
  styleUrls: ['./recebida-direcao.component.css']
})
export class RecebidaDirecaoComponent implements OnInit {
  @Input() item: any;
  EnviarDepartamento: any;
  inputPin: string = '';
  expectedPin: string = '';
  exibirModalInserirPin: boolean = true;

  exibirPinInput: boolean = false;
  itemIdParaTratar: number | null = null;

  public documento: any;
  public isLoading: boolean = false;
  public fileUrl: any;
  public carregarDocumento: boolean = false;

  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any[] = [];
  public correspondencia: any;

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  };

  public estados = [
    { cor: '#FFA500', texto: 'Pendente' },
    { cor: '#8B4513', texto: 'Recebido' },
    { cor: '#4682B4', texto: 'Em Tratamento' },
    { cor: 'rgb(64, 232, 22)', texto: 'Despacho' },
    { cor: '#000000', texto: 'Parecer' },
    { cor: '#FFFF00', texto: 'Pronunciamento' },
  ];

  public orgaoId: any;
  private correspondenciaIds: Set<number> = new Set();
  public blinkingCorrespondencias: Set<number> = new Set();
  private pollingSubscription!: Subscription;

  constructor(
    private correspondenciaService: CorrespondenciaService,
    private ficheiroService: FicheiroService,
    private secureService: SecureService,
    private iziToast: IziToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orgaoId = this.getNomeOrgao;
    this.buscarCorrespondencias();
    this.startPolling();
  }

  private buscarCorrespondencias(): void {
    const options = {
      ...this.filtro,
      enviado_para: this.getOrgaoId,
    };
    console.log('Buscando correspondências com opções:', options);
    this.isLoading = true;
    this.correspondenciaService.listarTodos(options).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Resposta do backend:', response);
        const uniqueIds = new Set();
        this.correspondencias = response.data.filter((item: any) => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

        if (this.correspondencias.length > 0) {
          this.expectedPin = this.correspondencias[0].pin;
          this.checkNewCorrespondencias(this.correspondencias);
        } else {
          console.warn('Nenhum registro retornado na primeira página.');
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar correspondências:', err);
        this.iziToast.erro('Erro ao listar correspondências');
      }
    });
  }

  private startPolling(): void {
    const options = {
      ...this.filtro,
      enviado_para: this.getOrgaoId,
    };
    this.pollingSubscription = timer(0, 5000).pipe(
      switchMap(() => this.correspondenciaService.startPolling(options))
    ).subscribe({
      next: (correspondencias: any[]) => {
        const uniqueIds = new Set();
        const newCorrespondencias = correspondencias.filter((item: any) => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });

        const existingIds = new Set(this.correspondencias.map((c) => c.id));
        this.correspondencias = [
          ...this.correspondencias.filter((c) => existingIds.has(c.id)),
          ...newCorrespondencias.filter((c) => !existingIds.has(c.id)),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        this.checkNewCorrespondencias(newCorrespondencias);
      },
      error: (err: any) => {
        console.error('Erro no polling:', err);
      },
    });
  }

  private checkNewCorrespondencias(correspondencias: any[]): void {
    if (!Array.isArray(correspondencias)) {
      console.error('Correspondências não é um array:', correspondencias);
      return;
    }

    // Marcar todos os registros não lidos para piscar
    correspondencias.forEach((item) => {
      const id = item.id;
      if (!this.correspondenciaIds.has(id) && !item.n_lido) {
        this.blinkingCorrespondencias.add(id);
        this.correspondenciaIds.add(id);
      }
    });

    // Remover registros que foram lidos ou não estão mais na lista
    this.blinkingCorrespondencias.forEach((id) => {
      const correspondencia = correspondencias.find((c) => c.id === id);
      if (!correspondencia || correspondencia.n_lido) {
        this.blinkingCorrespondencias.delete(id);
      }
    });
  }

  public marcarComoLido(correspondenciaId: number): void {
    this.correspondenciaService.marcarComolido(correspondenciaId).subscribe({
      next: (response: any) => {
        this.correspondencias = this.correspondencias.map((c: any) =>
          c.id === correspondenciaId ? { ...c, n_lido: true } : c
        );
        this.blinkingCorrespondencias.delete(correspondenciaId);
      },
      error: (err: any) => {
        console.error('Erro ao marcar correspondência como lida:', err);
        this.iziToast.erro('Falha ao marcar como lida. Verifique o console para detalhes.');
      },
    });
  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarCorrespondencias();
  }

  public filtrarPagina(key: any, $event: any): void {
    if (key === 'page') {
      this.filtro.page = $event;
    } else if (key === 'perPage') {
      this.filtro.perPage = $event.target.value;
    } else if (key === 'search') {
      this.filtro.search = $event;
    }
    this.buscarCorrespondencias();
  }

  public validarEliminar(item: any): void {}

  public setCorrespondencia(item: any): void {
    this.correspondencia = item;
  }

  public setNullCorrespondencia(): void {
    this.correspondencia = null;
  }

  public setEnviarDepartamento(item: any) {
    this.correspondencia = item;
    this.EnviarDepartamento = item;
  }

  public get getOrgaoId(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get getNomeOrgao(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }

  verificarPinEVisualizar(item: any): void {
    if (item.pin === 'null' || item.pin === '') {
      this.expectedPin = item.pin;
      this.visualizarSemPin(item);
    } else if (item.pin !== 'null' || item.pin !== '' || item.pin !== 'undefined') {
      this.visualizarComPin(item);
    }
  }

  visualizarComPin(item: any): void {
    this.documento = item;
    this.inputPin = '';
    this.expectedPin = item.pin;
    this.exibirPinInput = true;

    const modal = document.getElementById('modalInserirPin');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  visualizarSemPin(item: any): void {
    this.documento = item;
    this.arregarDocumento();
  }

  arregarDocumento(): void {
    if (this.documento && this.documento.anexo) {
      this.ficheiroService.getFile({
        pessoaId: this.documento.remetente_id,
        url: this.documento.anexo
      }).pipe(
        finalize(() => {
          this.inputPin = '';
          this.exibirModalInserirPin = false;
          this.abrirModalVisualizarDocumento();
        })
      ).subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });
    } else {
      this.abrirModalVisualizarDocumento();
    }
  }

  visualizar(documento: any): boolean {
    this.inputPin = '';
    this.exibirPinInput = true;
    this.documento = documento;
    if (!documento.anexo) return false;
    this.expectedPin = documento.pin;
    return true;
  }

  verificarPin(): void {
    if (this.inputPin === this.expectedPin) {
      this.exibirPinInput = false;
      this.carregarDocumento = true;

      const opcoes = {
        pessoaId: this.documento.remetente_id,
        url: this.documento.anexo,
      };
      this.ficheiroService.getFileStore(opcoes).pipe(
        finalize(() => {
          this.carregarDocumento = false;
          this.inputPin = '';
          this.exibirModalInserirPin = false;
          setTimeout(() => {
            const backdrop = document.getElementsByClassName('modal-backdrop')[0];
            if (backdrop) {
              backdrop.remove();
            }
          }, 300);
          this.abrirModalVisualizarDocumento();
        })
      ).subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });
    } else {
      this.iziToast.alerta('PIN incorreto. Por favor, tente novamente ou contate o Remetente do Documento.');
      this.inputPin = '';
    }
  }

  cancelarPin(): void {
    this.exibirPinInput = false;
    this.documento = null;
    this.inputPin = '';
  }

  abrirModalVisualizarDocumento(): void {
    const modal = document.getElementById('ver-documento-correspondencia-recebida');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  fecharModalVisualizarDocumento(): void {
    location.reload();
    this.recarregarPagina();
    const modal = document.getElementById('ver-documento-correspondencia-recebida');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    this.exibirModalInserirPin = false;
    $('.modal').hide();
  }

  fechar(): void {
    location.reload();
    this.exibirModalInserirPin = false;
  }

  public construcao() {
    alert('Em construção');
  }
}