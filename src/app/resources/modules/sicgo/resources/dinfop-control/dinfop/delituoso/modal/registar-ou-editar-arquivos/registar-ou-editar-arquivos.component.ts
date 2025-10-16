import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArquivosdelituosoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/arquivos_delituoso/arquivosdelituoso.service';
import { DinfopDelitousoFotoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/foto_delitouso.service';

@Component({
  selector: 'app-sicgo-registar-ou-editar-arquivos',
  templateUrl: './registar-ou-editar-arquivos.component.html',
  styleUrls: ['./registar-ou-editar-arquivos.component.css']
})
export class RegistarOuEditarArquivosComponent implements OnInit {
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  public isLoading = false;
  public capturedFiles: any[] = []; // Armazena imagens, áudios ou vídeos

  constructor(
    private http: HttpClient,
    private arquivosdelituosoService: ArquivosdelituosoService,
    private dinfopDelitousoService: DinfopDelitousoFotoService
  ) { }

  ngOnInit() {
    // Inicialização se necessário
  }

  // Método para lidar com o upload de arquivos
  handleFileUpload(event: any) {
    const files: FileList = event.target.files;
    
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {  // Asserção do tipo para 'file'
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result as string;
          this.capturedFiles.push({ file, fileData });
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  

  isImage(fileObj: any): boolean {
    return fileObj.file.type.startsWith('image/');
  }
  
  isAudio(fileObj: any): boolean {
    return fileObj.file.type.startsWith('audio/');
  }
  
  isVideo(fileObj: any): boolean {
    return fileObj.file.type.startsWith('video/');
  }

  
  // Envia os arquivos selecionados
  public async onSubmit() {
    if (this.capturedFiles.length === 0) {
      alert('Por favor, faça o upload de pelo menos um arquivo.');
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    try {
      const request$ = this.buscarId()
        ? this.arquivosdelituosoService.editar(formData, this.buscarId())
        : this.arquivosdelituosoService.registar(formData);

      await request$.toPromise();
      setTimeout(() => {
        window.location.reload();
      }, 400);
      this.eventRegistarOuEditar.emit(true);
      this.resetForm();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
  
    // Adiciona cada arquivo ao FormData sem índice
    this.capturedFiles.forEach((fileObj) => {
      if (fileObj.file) {
        formData.append('arquivos[]', fileObj.file, fileObj.file.name);
      }
    });
  
    // Adiciona o ID do delituoso
    formData.append('delituoso_id', this.getDelituosoId().toString());
  
    return formData;
  }
  
  

  private handleError(error: any) {
    const errorMessage = error.error?.message || `Erro desconhecido ao enviar os arquivos. Status: ${error.status}`;
    console.error('Erro ao enviar arquivos:', errorMessage);
    alert(errorMessage);
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }

  private buscarId(): number | null {
    return null;
  }

  private resetForm(): void {
    this.capturedFiles = [];
  }

  // Método para remover um arquivo específico
  public removeFile(index: number) {
    this.capturedFiles.splice(index, 1);
  }
}