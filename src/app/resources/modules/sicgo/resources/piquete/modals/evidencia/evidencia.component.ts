import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { PessoasService } from '@resources/modules/sicgo/core/config/Pessoa.service';
import { TipoEvidenciaService } from '@resources/modules/sicgo/core/config/TipoEvidencia.service';
import { EvidenciaService } from '@resources/modules/sicgo/core/service/piquete/evidencias.service';
import { finalize, Subscription } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { Pagination } from '@shared/models/pagination';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { DTOEvidencia } from '@resources/modules/sicgo/shared/model/evidencia.model';

@Component({
  selector: 'app-evidencia',
  templateUrl: './evidencia.component.html',
  styleUrls: ['./evidencia.component.css']
})
export class EvidenciaComponent implements OnInit {
  //kv
  files: File[] = [];
  selecaoAtual: any;
  filePreviews: { file: File; url: string }[] = [];

  public condicao: string | any;
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public importancias: Array<Select2OptionData> = [];
  public provincias: Array<Select2OptionData> = [];
  public pessoas: Array<Select2OptionData> = [];
  public tipoevidencias: Array<Select2OptionData> = [];

  @Input() ocorrenciaId: any;
  public evidencia: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  errorMessage: any;
  isLoading: boolean = false;
  evidenciaForm!: FormGroup;
  public pagination = new Pagination();
  public submitted: boolean = false;
  public evidencias: any[] = [];
  paises: any;
  public subscription: Subscription = new Subscription;
  constructor(
    private fb: FormBuilder,
    private PessoasService: PessoasService,
    private TipoEvidenciaService: TipoEvidenciaService,
    private EvidenciaService: EvidenciaService,
    private formatarDataHelper: FormatarDataHelper,
    private importanciaService: ImportanciaService) {

  }

  ngOnChanges() {
    this.createForm();
    this.buscarImportancias();
    this.buscarTipoEvidencias();
    this.buscarPessoas();
    if (this.buscarId()) {
      this.getDataForm();
    }

  }
  ngOnInit(): void {
    this.buscarImportancias();
    this.buscarTipoEvidencias();
    this.buscarPessoas();

  }
  ngOnDestroy() {
    this.filePreviews.forEach(p => URL.revokeObjectURL(p.url));
  }





  buscarImportancias() {
    const options = {};
    this.importanciaService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.importancias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

        },
      });
  }
  buscarTipoEvidencias() {
    const options = {};
    this.TipoEvidenciaService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.tipoevidencias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

        },
      });
  }
  buscarPessoas() {
    const options = {};
    this.PessoasService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.pessoas = response.map((item: any) => ({
            id: item.id,
            text: item.apelido,
            text1: item.genero,
            foto_civil: item.foto_civil,
          }));

        },
      });
  }


  createForm() {
    this.evidenciaForm = this.fb.group({
      data: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      sicgo_tipo_evidencia_id: ['', [Validators.required]],
      sicgo_importancia_id: ['', [Validators.required]],
    });
  }


  getDataForm() {
    this.evidenciaForm.patchValue({
      data: this.formatarDataHelper.formatDate(this.evidencia.data),
      endereco: this.evidencia.endereco,
      descricao: this.evidencia.descricao,
      sicgo_tipo_evidencia_id: this.evidencia.sicgo_tipo_evidencia_id,
      sicgo_importancia_id: this.evidencia.sicgo_importancia_id
    });
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (!selectedFiles) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/webm'
    ];

    const newFiles = Array.from(selectedFiles).filter(file =>
      allowedTypes.includes(file.type)
    );

    newFiles.forEach(file => {
      const alreadyExists = this.filePreviews.some(f => f.file.name === file.name);
      if (!alreadyExists) {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviews.push({ file, url: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    });

    input.value = ''; // Limpa o input para permitir novo upload do mesmo arquivo se removido
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer?.files || []);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/webm'
    ];

    droppedFiles
      .filter(file => allowedTypes.includes(file.type))
      .forEach(file => {
        const alreadyExists = this.filePreviews.some(f => f.file.name === file.name);
        if (!alreadyExists) {
          const reader = new FileReader();
          reader.onload = () => {
            this.filePreviews.push({ file, url: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  removeFile(index: number): void {
    this.filePreviews.splice(index, 1);
  }

  onSubmit() {
    if (this.evidenciaForm.invalid) {
      console.error('Formulário inválido', this.evidenciaForm);
      return;
    }

    if (this.filePreviews.length === 0) {
      alert('Por favor, selecione pelo menos um arquivo.');
      return;
    }


    this.isLoading = true;
    const formData = new FormData();
    const formValue = this.evidenciaForm.value;

    // 1. Adicionar campos do formulário, ignorando campos nulos, undefined ou vazios
    Object.entries(formValue).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // 2. Adicionar arquivos no campo 'anexos'
    this.filePreviews.forEach(item => {
      formData.append('anexos', item.file, item.file.name);
    });


    // 3. Adicionar ocorrência ID (se for número ou string)
    const ocorrenciaId = this.getOcorrenciaId();
    if (ocorrenciaId !== null && ocorrenciaId !== undefined) {
      formData.append('sicgo_ocorrencia_id', ocorrenciaId.toString());
    }

    // 4. Enviar via service
    this.EvidenciaService.registar(formData).pipe(
      finalize(() => {
        this.isLoading = false;
        this.submitted = false;
      })
    ).subscribe({
      next: (response) => {
        alert(`Evidência ${response.evidenciaId} registrada!`);
        this.removerModal();
        this.reiniciarFormulario();
        this.eventRegistarOuEditar.emit(true);
      },
      error: (err) => {
        this.errorMessage = this.extractErrorMessage(err);
        console.error('Erro:', err);
      }
    });
  }


  // Função auxiliar para tratamento de erros
  private extractErrorMessage(err: any): string {
    if (err.error?.message) return err.error.message;
    if (err.statusText) return `${err.status}: ${err.statusText}`;
    return 'Erro desconhecido';
  }
  public uploadFilePDF(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.evidenciaForm.get(campo)?.setValue(file);
    this.evidenciaForm.get(campo)?.updateValueAndValidity();
  }

  buscarId(): number {
    return this.evidencia?.id;
  }
  getOcorrenciaId(): number {
    return this.ocorrenciaId as number;
  }

  aoSelecionar() {
    console.log(this.selecaoAtual); // Aqui você pode manipular a seleção
  }

  reiniciarFormulario() {
    this.evidenciaForm.reset();
    this.files = [];
    this.filePreviews = [];
  }
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }

  get enderecoValidate() {
    return (
      this.evidenciaForm.get('endereco')?.invalid && this.evidenciaForm.get('endereco')?.touched
    );
  }
  get sicgo_importancia_idValidate() {
    return (
      this.evidenciaForm.get('sicgo_importancia_id')?.invalid && this.evidenciaForm.get('sicgo_importancia_id')?.touched
    );
  }
  get sicgo_tipo_evidencia_idValidate() {
    return (
      this.evidenciaForm.get('sicgo_tipo_evidencia_id')?.invalid && this.evidenciaForm.get('sicgo_tipo_evidencia_id')?.touched
    );
  }
  get sicgo_provincia_idValidate() {
    return (
      this.evidenciaForm.get('sicgo_provincia_id')?.invalid && this.evidenciaForm.get('sicgo_provincia_id')?.touched
    );
  }
  get sicgo_pessoafisica_idValidate() {
    return (
      this.evidenciaForm.get('sicgo_pessoafisica_id')?.invalid && this.evidenciaForm.get('sicgo_pessoafisica_id')?.touched
    );
  }
  get descricaoValidate() {
    return (
      this.evidenciaForm.get('descricao')?.invalid && this.evidenciaForm.get('descricao')?.touched
    );
  }
  get dataValidate() {
    return (
      this.evidenciaForm.get('data')?.invalid && this.evidenciaForm.get('data')?.touched
    );
  }

}
