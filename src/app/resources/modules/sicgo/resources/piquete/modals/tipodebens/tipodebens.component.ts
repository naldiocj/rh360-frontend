import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipobensService } from '@resources/modules/sicgo/core/service/piquete/tipobens.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipodebens',
  templateUrl: './tipodebens.component.html',
  styleUrls: ['./tipodebens.component.css']
})
export class TipodebensComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public tipobens: any;
  @Input() ocorrenciaId: any = 0;
  public tipoben: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();


  isLoading: boolean = false;
  bensForm: FormGroup | any;
  public pagination = new Pagination();
  public submitted: boolean = false;
  errorMessage: any;
  textareaValue: string = '';
  historicos: any[] = [];
  propriedades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private OcorrenciaService: OcorrenciaService,
    private TipobensService: TipobensService,
    private _router: Router
  ) {
    this.createForm();
  }


  ngOnInit(): void {
    this.Tipobens();
    this.getDataForm();
    this.Historicos();
    this.Propriedades();
 
  }

  Historicos() {
    this.TipobensService.historicos$.subscribe((dados) => {
      this.historicos = dados.map((hist: any) => ({
        data: hist.data,
        descricao: hist.descricao
      }));
    });
  }

  Propriedades() {
    this.TipobensService.propriedades$.subscribe((dados) => {
      this.propriedades = dados.map((prop: any) => ({
        nome: prop.nome,
        descricao: prop.descricao
      }));
    });
  }




  Tipobens(): void {
    this.OcorrenciaService
      .ver(this.ocorrenciaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipobens = response;
        },
      });
  }

  public filtro = {
    search: '',
    perPage: 5,
    page: 1,
  }




  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta para o conteúdo
  }

  createForm() {
    this.bensForm = this.fb.group({
      nome: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      propriedades: this.fb.array([]), // Inicializa como FormArray
      historicos: this.fb.array([]), // Inicializa como FormArray
    });
  }

  // Método para acessar o FormArray diretamente
  get propriedadesFormArray(): FormArray {
    return this.bensForm.get('propriedades') as FormArray;
  }
  // Método para acessar o FormArray diretamente
  get historicosFormArray(): FormArray {
    return this.bensForm.get('historicos') as FormArray;
  }

  getDataForm() {
    this.bensForm.patchValue({
      nome: this.tipoben.nome,
      estado: this.tipoben.estado,
      sicgo_ocorrencia_id: this.tipoben.sicgo_ocorrencia_id,
      propriedades: this.propriedades, // Inclui os propriedades no formulário
      historicos: this.historicos, // Inclui os historicos no formulário


    });


    // Limpa o FormArray antes de adicionar novos dados
    this.historicosFormArray.clear();

    // Adiciona os valores ao FormArray
    this.historicos.forEach((historico) => {
      this.historicosFormArray.push(
        this.fb.group({
          descricao: [historico.descricao || '', Validators.required],
          data: [historico.data || '', Validators.required],
        })
      );
    });


    // Limpa o FormArray antes de adicionar novos dados
    this.propriedadesFormArray.clear();

    // Adiciona os valores ao FormArray
    this.propriedades.forEach((propriedade) => {
      this.propriedadesFormArray.push(
        this.fb.group({
          nome: [propriedade.nome || '', Validators.required],
          descricao: [propriedade.descricao || '', Validators.required],
        })
      );
    });
  }

  addPropriedade() {
    this.propriedadesFormArray.push(
      this.fb.group({
        nome: ['', Validators.required],
        descricao: ['', Validators.required],
      })
    );
  }
  removePropriedade(index: number) {
    this.propriedadesFormArray.removeAt(index);
  }


  addHistorico() {
    this.historicosFormArray.push(
      this.fb.group({
        descricao: ['', Validators.required],
        data: ['', Validators.required],
      })
    );
  }
  removeHistorico(index: number) {
    this.historicosFormArray.removeAt(index);
  }



  onSubmit(): void {
    if (this.bensForm.invalid) {
      console.log('Formulário inválido:', this.bensForm.controls);

      return; // Não prosseguir se o formulário estiver inválido
    }
    console.log('Funcionando', this.bensForm.controls);
    this.isLoading = true;
    this.submitted = true;

    // Capturando os valores dos FormArray
    const propriedades = this.propriedadesFormArray.value;
    const historicos = this.historicosFormArray.value;

    const formData = {
      ...this.bensForm.value,
      propriedades, // Inclui as propriedades
      historicos,   // Inclui os históricos
      sicgo_ocorrencia_id: this.getIdOcorrencia(), // Adicionar ID da ocorrência
      user_id: 4, // Inclua o ID do usuário se necessário
    };

   

    const type = this.TipobensService.registar(formData);

    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditar.emit(true);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        }
      });
  }



  getIdOcorrencia(): number {
    return this.ocorrenciaId as number;
  }

  reiniciarFormulario() {
    this.bensForm.reset();
    this.propriedadesFormArray.clear();
    this.historicosFormArray.clear();
  }

  buscarId(): number {
    return this.tipobens as number;
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

  get nomeValidate() {
    return (
      this.bensForm.get('nome')?.invalid && this.bensForm.get('nome')?.touched
    );
  }
  get estadoValidate() {
    return (
      this.bensForm.get('estado')?.invalid && this.bensForm.get('estado')?.touched
    );
  }


  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }


}
