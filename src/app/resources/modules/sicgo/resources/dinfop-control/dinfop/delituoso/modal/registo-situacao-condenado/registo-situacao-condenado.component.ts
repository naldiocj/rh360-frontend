import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstabelecimentoPrisionalService } from '@resources/modules/sicgo/core/config/EstabelecimentoPrisional.service';
import { DinfopAntecedenteDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/antecedente_delitouso.service';
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
import { DinfopSituacaoCondenadoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_situacao_condenado.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs/internal/operators/finalize';


@Component({
  selector: 'app-registo-situacao-condenado',
  templateUrl: './registo-situacao-condenado.component.html',
  styleUrls: ['./registo-situacao-condenado.component.css']
})
export class RegistoSituacaoCondenadoComponent implements OnInit {

  @Input() delituosoId: any=0;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public submitted: boolean = false;
  public isLoading: boolean = false;
  public formErrors: any;
  public Form!: FormGroup;
  params: any;
  delitouso: any; 
  public prisao: Array<Select2OptionData> = [];
 
  @Input() DelituosoOrigem: any = {};
 
  constructor(
    private estabelecimentoPrisionalService: EstabelecimentoPrisionalService,
    private dinfopSituacaoCondenadoDelitousoService: DinfopSituacaoCondenadoDelitousoService,
    private dinfopDelituosoOrigemService:DinfopDelituosoOrigemService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.buscarEstabelecimentoPrisional();
    if (this.params?.getId || this.params?.getInfo) {
      this.getDataForm();
    }

    this.dinfopDelituosoOrigemService.delituoso$.subscribe(data => {
      if (data) {
        this.DelituosoOrigem = data;
        
      }
    });
  }


  ngOnChanges() {
    
    if (this.buscarId()) {
      this.getDataForm();
    }
  }

  ngOnDestroy(): void {}

  createForm(): void {
    this.Form = this.fb.group({
      situacao: ['', [Validators.required]],
      data: ['', [Validators.required]], // Adiciona o campo observacao
      estabelecimento_prisional_id: ['', [Validators.required]], // Adiciona o campo observacao
    });
  }

  getDataForm(): void {
    if (!this.delitouso) return; // Verifique se delitouso está definido

    this.Form.patchValue({
      situacao: this.delitouso.situacao,
      data: this.delitouso.data, // Preenche o campo observacao se disponível
      estabelecimento_prisional_id: this.delitouso.estabelecimento_prisional_id  // Preenche o campo observacao se disponível
    });
  }

  buscarEstabelecimentoPrisional() {
    const options = {};
    this.estabelecimentoPrisionalService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.prisao = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

          console.log('Dados recebidos:', this.prisao);
        },
      });
  }

  onSubmit(): void {
    if (this.Form.invalid) {
      // Marca todos os controles do formulário como tocados para exibir validações
      Object.values(this.Form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
  
    this.isLoading = true;
  
    // Obter os dados do formulário
    const formData = { ...this.Form.value };
  
    // Adicionar os dados do DelituosoOrigem ao formulário
    if (this.DelituosoOrigem) {
      formData.delituoso_id = this.DelituosoOrigem.delituoso_id;
      formData.origem_id = this.DelituosoOrigem.origem_id; // Se necessário
    }
  
    // Verificar se estamos editando ou registrando
    const request = this.buscarId()
      ? this.dinfopSituacaoCondenadoDelitousoService.editar(formData, this.buscarId())
      : this.dinfopSituacaoCondenadoDelitousoService.registar(formData);
  
    // Enviar a requisição
    request.pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          setTimeout(() => {
            window.location.reload();
          }, 400);
          this.removerModal(); // Fecha o modal
          this.reiniciarFormulario(); // Reseta o formulário
          this.eventRegistarOuEditar.emit(true); // Emite evento para atualização
        },
        (error) => {
          console.error('Erro ao registrar ou editar:', error);
        }
      );
  }
  
  reiniciarFormulario(): void {
    this.Form.reset();
  }

  buscarId(): number | undefined {
    return this.delitouso?.id;
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }


  removerModal(): void {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
