// src/app/resources/modules/sigdoc/core/criar-documento-lista/criar-documento-lista.component.ts
import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CriarDocumentoService } from '@resources/modules/sigdoc/core/service/criar-documento.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

  // 1. Adicione esta interface no componente
  interface CachedFile {
    [key: string]: File;
  }
  
  // 2. Adicione propriedade de cache
  

@Component({
  selector: 'app-criar-documento-lista',
  templateUrl: './criar-documento-lista.component.html',
  styleUrls: ['./criar-documento-lista.component.css'],
})
export class CriardocumentolistaComponent implements OnInit {
  public isLoading: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public documento: any;
  public fileUrl: any;
  public carregarDocumento: boolean = false;
  public cachedFiles: CachedFile = {};

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  };

  public orgaoId: any;

  constructor(
    private departamentoService: CriarDocumentoService,
    private ficheiroService: FicheiroService,
    private secureService: SecureService
  ) {
    this.orgaoId = this.getNomeOrgao;
  }

  ngOnInit(): void {
    this.buscarCorrespondencias();
  }

  private buscarCorrespondencias() {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId,
    };
    this.isLoading = true;
    this.departamentoService
      .listarTodos(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.correspondencias = response.data;
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarCorrespondencias();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCorrespondencias();
  }



// 3. Método modificado para pré-cache de arquivos
public preloadFile(documento: any): void {
  if (!documento.anexo || this.cachedFiles[documento.anexo]) return;

  const opcoes = {
    pessoaId: documento.remetente_id,
    url: documento.anexo,
  };

  this.ficheiroService.getFileStore(opcoes).subscribe({
    next: (fileBlob: Blob) => {
      this.cachedFiles[documento.anexo] = new File([fileBlob], documento.anexo, {
        type: this.detectMimeType(documento.anexo)
      });
    },
    error: (err) => console.error('Erro no pré-carregamento:', err)
  });
}

public onDragStart(event: DragEvent, documento: any) {
  if (!documento.anexo || !event.dataTransfer) {
    event.preventDefault();
    return;
  }

  const dataTransfer = event.dataTransfer;
  const cachedFile = this.cachedFiles[documento.anexo];

  // Elemento visual do drag
  const dragImage = this.createDragImage(documento.anexo);
  dataTransfer.setDragImage(dragImage, 0, 0);

  if (cachedFile) {
    this.handleFileDrag(dataTransfer, cachedFile);
  } else {
    this.handleAsyncDrag(dataTransfer, documento);
  }

  // Validação assíncrona melhorada
  setTimeout(async () => {
    const isValid = await this.validateDragContent(dataTransfer);
    if (!isValid) {
      console.error('Falha detalhada - Tipos:', [...dataTransfer.types], 'Arquivos:', dataTransfer.files);
      event.preventDefault();
      document.body.removeChild(dragImage);
    }
  }, 300); // Tempo suficiente para carregar o arquivo
}

private handleFileDrag(dataTransfer: DataTransfer, file: File): void {
  dataTransfer.clearData();

  // Usar dataTransfer.items.add como abordagem principal
  if (dataTransfer.items) {
    dataTransfer.items.add(file);
    console.log('Arquivo adicionado via dataTransfer.items:', file);
  }

  // Configurar metadados para compatibilidade (fallback)
  const fileURL = URL.createObjectURL(file);
  dataTransfer.setData('text/uri-list', fileURL);
  dataTransfer.setData('text/plain', file.name);

  // Configuração específica para DownloadURL (para pastas)
  try {
    const mimeType = this.detectMimeType(file.name);
    dataTransfer.setData('DownloadURL', `${mimeType}:${file.name}:${fileURL}`);
  } catch (e) {
    console.warn('Recurso DownloadURL não suportado:', e);
  }

  // Otimização de performance
  dataTransfer.effectAllowed = 'copyMove';
  setTimeout(() => URL.revokeObjectURL(fileURL), 60000); // Limpeza de memória
}

private validateDragContent(dataTransfer: DataTransfer): boolean {
  return dataTransfer.types.includes('Files') || 
         dataTransfer.files.length > 0 ||
         dataTransfer.types.includes('application/octet-stream');
}

// 5. Métodos auxiliares
private createDragImage(text: string): HTMLElement {
  const dragImage = document.createElement('div');
  dragImage.textContent = text;
  dragImage.style.position = 'absolute';
  dragImage.style.left = '-9999px';
  document.body.appendChild(dragImage);
  return dragImage;
}


private async validateDragOperation(dataTransfer: DataTransfer): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => {
      const isValid = dataTransfer.files?.length > 0 
                    || dataTransfer.types.includes('Files')
                    || dataTransfer.types.includes('application/octet-stream');
      resolve(isValid);
    }, 150); // Aumente o timeout para operações assíncronas
  });
}


private createFileList(file: File): FileList {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}


private handleAsyncDrag(dataTransfer: DataTransfer, documento: any): void {
  const opcoes = {
    pessoaId: documento.remetente_id,
    url: documento.anexo,
  };

  this.ficheiroService.getFileStore(opcoes).subscribe({
    next: (fileBlob: Blob) => {
      const file = new File([fileBlob], documento.anexo, {
        type: this.detectMimeType(documento.anexo)
      });
      this.handleFileDrag(dataTransfer, file);
      this.cachedFiles[documento.anexo] = file;
    },
    error: (err) => {
      console.error('Erro ao obter arquivo:', err);
      document.body.querySelectorAll('div').forEach(el => {
        if (el.textContent === documento.anexo) el.remove();
      });
    }
  });
}

private detectMimeType(filename: string): string {
  const extensionMap: { [key: string]: string } = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Adicione outros tipos necessários
  };
  
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return extensionMap[ext] || 'application/octet-stream';
}


  

  /*public onDragStart(event: DragEvent, documento: any) {
    if (!documento.anexo) {
      console.warn('Documento sem anexo para arrastar:', documento);
      event.preventDefault();
      return;
    }
  
    // Garantir que event.dataTransfer não seja null ou undefined
    if (!event.dataTransfer) {
      console.error('event.dataTransfer não está disponível.');
      event.preventDefault();
      return;
    }
  
    // Capturar event.dataTransfer em uma variável para usar no callback
    const dataTransfer = event.dataTransfer;
  
    const opcoes = {
      pessoaId: documento.remetente_id,
      url: documento.anexo,
    };
  
    this.ficheiroService.getFileStore(opcoes).subscribe(
      (file: Blob) => {
        const fileName = documento.anexo;
  
        // Criar elemento visual para arrastar
        const dragImage = document.createElement('div');
        dragImage.textContent = fileName;
        dragImage.style.backgroundColor = '#f0f0f0';
        dragImage.style.padding = '5px';
        dragImage.style.border = '1px solid #ccc';
        dragImage.style.fontSize = '12px';
        document.body.appendChild(dragImage);
        dataTransfer.setDragImage(dragImage, 0, 0);
  
        // Criar um objeto File a partir do Blob
        const fileObject = new File([file], fileName, { type: 'application/pdf' });
  
        // Adicionar o arquivo ao dataTransfer
        if (dataTransfer.items) {
          // Usar dataTransfer.items para navegadores modernos (Chrome, Edge)
          dataTransfer.items.add(fileObject);
          console.log('Usando dataTransfer.items para adicionar arquivo:', fileObject);
  
          // Configurar DownloadURL como fallback adicional
          const url = URL.createObjectURL(file);
          dataTransfer.setData('DownloadURL', `application/pdf:${fileName}:${url}`);
        } else {
          // Fallback para navegadores mais antigos (usar DownloadURL)
          const url = URL.createObjectURL(file);
          dataTransfer.setData('DownloadURL', `application/pdf:${fileName}:${url}`);
          dataTransfer.effectAllowed = 'copy';
          console.warn('Fallback: Usando DownloadURL em navegador antigo. Upload pode não funcionar.');
        }
  
        // Limpar o elemento visual
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      },
      (error) => {
        console.error('Erro ao carregar arquivo para arrastar:', error);
        event.preventDefault();
      }
    );
  }*/

  public visualizar(documento: any) {
    const opcoes = {
      pessoaId: documento?.remetente_id,
      url: ''
    };
    this.fileUrl = null;
    opcoes.url = documento.anexo || null;
    this.documento = documento;

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService.getFileStore(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false;
      })
    ).subscribe((file) => {
      console.log('Valor de file:', file);
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true;
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get getNomeOrgao(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }
}