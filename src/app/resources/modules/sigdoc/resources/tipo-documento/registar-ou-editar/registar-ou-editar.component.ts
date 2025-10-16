import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Correspondencia.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-ocorrencia-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {

  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public documento: any = null
  @Input() public correspondencia: any;
  @Output() public onEnviarOcorrencia: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;

  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

 
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public submitted: boolean = false;
  public adicionaPin: boolean = false;


  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
  };

  public carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipoCorrespondenciaService: TipoCorrespondenciaService,
    private iziToast: IziToastService,
  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();


  ngOnInit(): void {
    this.criarForm();
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      nome: [null, Validators.required],
      sigla: [null, Validators.required],
      descricao: [''],
    });
  }

  public onSubmit(): void {
    this.carregando = true;
    
    this.submitted = true;
    const formData = this.getFormData();
    const type = this.buscarId()
      ? this.tipoCorrespondenciaService.editar(formData, this.buscarId())
      : this.tipoCorrespondenciaService.registar(formData);
    type
      .pipe(
        finalize((): void => {
          this.carregando = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onEnviarOcorrencia.emit({ enviar: true });
        },
        error: (err) => {
          console.error('Erro ao enviar o formulário:', err);
        }
      });
}

private getFormData() {
    const formData = new FormData();
    formData.append('nome', String(this.simpleForm.get('nome')?.value).trim());
    formData.append('sigla', String(this.simpleForm.get('sigla')?.value).trim());
    formData.append('descricao', String(this.simpleForm.get('descricao')?.value).trim() || '');
    return formData;
}

  buscarId(): number {
    return this.documento?.id;
  }

  public get getCorrespondenciaId() {
    return this.correspondencia?.id;
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.pessoafisica = null;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}

