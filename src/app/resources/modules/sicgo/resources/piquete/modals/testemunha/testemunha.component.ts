import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { NivelSegurancaService } from '@resources/modules/sicgo/core/config/NivelSeguranca.service';
import { TetemunhaService } from '@resources/modules/sicgo/core/service/piquete/testemunha.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { Router } from '@angular/router';
import { pastOrPresentDateValidator } from '@resources/modules/sicgo/shared/datavalidadorkv';


@Component({
  selector: 'app-testemunha',
  templateUrl: './testemunha.component.html',
  styleUrls: ['./testemunha.component.css']
})
export class TestemunhaComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public testemun: any[] = [];
  searchControl: any;
  placeName: any;
  @Input() ocorrenciaId: any;
  @Input() toggleBanner = new EventEmitter<boolean>();
  @Input() testemunha: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  isLoading: boolean = false;
  simpleForm!: FormGroup;
  public pagination = new Pagination();
  public submitted: boolean = false;


  public importancias: Array<Select2OptionData> = [];
  public nivelSegurancas: Array<Select2OptionData> = [];
  errorMessage: any;


  constructor(
    private fb: FormBuilder,
    private OcorrenciaService: OcorrenciaService,
    private TetemunhaService: TetemunhaService,
    private importanciaService: ImportanciaService,
    private router: Router,
    private nivelSegurancaService: NivelSegurancaService) {

    this.createForm();
  }

  ngOnChanges() {

    this.buscarNivelSeguranca();
    this.buscarImportancias();

    //   this.getDataForm();


  }


  ngOnInit(): void {
    this.buscarNivelSeguranca();
    this.buscarImportancias();
    this.Testemunhas();
  }

  Testemunhas() {
    this.OcorrenciaService
      .ver(this.ocorrenciaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.testemun = response;
        },
      });
  }


  buscarNivelSeguranca() {
    const options = {};
    this.nivelSegurancaService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.nivelSegurancas = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
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

  public filtro = {
    search: '',
    perPage: 5,
    page: 1,
  }


  createForm() {
    const regexTelefone = /^9\d{8}$/; // Aceita telefones começando com 9 e com 9 dígitos
    const regexNome = '^[A-Za-zÀ-ÖØ-öø-ÿ- ]*$'; // Aceita apenas letras e espaços

    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.pattern(regexNome)]],
      data: ['', [Validators.required, pastOrPresentDateValidator()]],
      nacionalidade: ['', [Validators.required]],
      bi_n: ['', [Validators.pattern('^[0-9]{9}[a-zA-Z]{2}[0-9]{3}$')]],
      tel: [null, [Validators.pattern(regexTelefone)]],
      descricao: ['', [Validators.required]],
      sicgo_denucia: ['', [Validators.required]],
      sicgo_importancia_id: ['', [Validators.required]],
      sicgo_nivel_seguranca_id: ['', [Validators.required]],
    });
  }


  getDataForm() {
    this.simpleForm.patchValue({
      data: this.testemunha.data,
      nome: this.testemunha.nome,
      tel: this.testemunha.tel,
      bi_n: this.testemunha.bi_n,
      nacionalidade: this.testemunha.nacionalidade,
      sicgo_denucia: this.testemunha.sicgo_denucia,
      sicgo_importancia_id: this.testemunha.sicgo_importancia_id,
      sicgo_nivel_seguranca_id: this.testemunha.sicgo_nivel_seguranca_id,
      descricao: this.testemunha.descricao,
    });
  }


  onSubmit() {

    if (this.simpleForm.invalid) {
      console.log('Não Funcionando', this.simpleForm.controls);
    } else {
      console.log('Funcionando', this.simpleForm.controls);
      this.isLoading = true;
      this.submitted = true;


      this.simpleForm.value.sicgo_ocorrencia_id = this.getOcorrenciaId()
      const type = this.TetemunhaService.registar(this.simpleForm.value);

      
      type.pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      ).subscribe({
        next: (res) => {
          setTimeout(() => {
            window.location.reload();
          }, 625);
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditar.emit(true);
        },
        error: (err) => {
          // Verifica se o objeto de erro está no formato esperado
          const message = err?.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
          console.error('Erro ao registrar testemunha:', message, err);
      
          // Atribui a mensagem de erro para exibição ao usuário
          this.errorMessage = message;
        }
      });
      
    }
  }

  getOcorrenciaId(): number {
    return this.ocorrenciaId as number;
  }

  reiniciarFormulario() {
    this.simpleForm.reset();
  }

  buscarId(): number {
    return this.testemunha as number;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }


  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5;
    this.filtro.search = ""
  }


  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }


  get bi_nValidate() {
    return (
      this.simpleForm.get('bi_n')?.invalid && this.simpleForm.get('bi_n')?.touched
    );
  }
  get tituloValidate() {
    return (
      this.simpleForm.get('titulo')?.invalid && this.simpleForm.get('titulo')?.touched
    );
  }
  get data_ocorridoValidate() {
    return (
      this.simpleForm.get('data')?.invalid && this.simpleForm.get('data')?.touched
    );
  }
  get nome_ocorrenteValidate() {
    return (
      this.simpleForm.get('nome')?.invalid && this.simpleForm.get('nome')?.touched
    );
  }
  get sicgo_importancia_idValidate() {
    return (
      this.simpleForm.get('sicgo_importancia_id')?.invalid && this.simpleForm.get('sicgo_importancia_id')?.touched
    );
  }
  get sicgo_denucia_idValidate() {
    return (
      this.simpleForm.get('sicgo_nivel_id')?.invalid && this.simpleForm.get('sicgo_enquadramento_legal_id')?.touched
    );
  }
  get sicgo_nivel_seguranca_idValidate() {
    return (
      this.simpleForm.get('sicgo_nivel_seguranca_id')?.invalid && this.simpleForm.get('sicgo_nivel_seguranca_id')?.touched
    );
  }
  get nacionalidadeValidate() {
    return (
      this.simpleForm.get('nacionalidade')?.invalid && this.simpleForm.get('descricao')?.touched
    );
  }
  get descricaoValidate() {
    return (
      this.simpleForm.get('descricao')?.invalid && this.simpleForm.get('descricao')?.touched
    );
  }
  get telValidate() {
    return (
      this.simpleForm.get('tel')?.invalid && this.simpleForm.get('tel')?.touched
    );
  }






}


