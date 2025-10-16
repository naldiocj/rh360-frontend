import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { TipoDeNormaPessoasService } from '@resources/modules/sigvestuario/core/normas/tipo-de-norma-pessoas.service';
import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
import { DesignacaoNormaPessoasService } from '@resources/modules/sigvestuario/core/normas/designacao-norma-pessoas.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';
import { ModalService } from '@core/services/config/Modal.service';
import { FicheiroService } from '@core/services/Ficheiro.service';

@Component({
  selector: 'sigvest-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() designacao_de_meios: any;
  @Output() onSubmitDesignacaoDeMeiosForm = new EventEmitter<Boolean>();
  public cadastroForm!: FormGroup;
  public tipo_de_norma_pessoas: Array<Select2OptionData> = [];
  destroy$ = new Subject<void>();

  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public genero_selecionado: any;

  get descricao_produto_id(): number {
    return this.designacao_de_meios?.id;
  }

  get nome_utilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo;
  }

  constructor(
    private secureService: SecureService,
    private tipo_de_norma_pessoas_service: TipoDeNormaPessoasService,
    private designacao_de_meios_service: DesignacaoDeMeiosService,
    private designacao_de_norma_pessoas_service: DesignacaoNormaPessoasService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private ficheiroService: FicheiroService
  ) { }

  ngOnInit(): void {
    this.validarDadosDoFormulario();
    this.buscarTipoDeNormaPessoas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['designacao_de_meios'].currentValue != changes['designacao_de_meios'] && this.designacao_de_meios != null) {
      this.preencherDescricaoProdutoForm();
    }
  }

  private validarDadosDoFormulario(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo_norma_pessoa_id: ['', Validators.required],
      descricao: [''],
    });
  }

  private preencherDescricaoProdutoForm(): void {
    this.genero_selecionado = this.designacao_de_meios.genero;

    this.cadastroForm.patchValue({
      nome: this.designacao_de_meios.nome,
      tipo_de_norma_pessoa_id: this.designacao_de_meios.tipo_de_norma_pessoa_id,
      descricao: this.designacao_de_meios.descricao,
      //anexo_foto: this.designacao_de_meios.anexo_foto
    })
  }

  public async onSubmit() {
    if (this.cadastroForm.invalid) { return; }

    const formData = new FormData();
    //formData.append('anexo_foto', this.arquivoSelecionado);
    formData.append('nome', this.cadastroForm.get('nome')?.value);
    formData.append('tipo_norma_pessoa_id', this.cadastroForm.get('tipo_norma_pessoa_id')?.value);
    formData.append('descricao', this.cadastroForm.get('descricao')?.value);

    const type = await this.descricao_produto_id ? this.designacao_de_norma_pessoas_service.editar(this.descricao_produto_id, formData) : this.designacao_de_norma_pessoas_service.registar(formData);
    type.pipe(
      finalize(() => { })
    ).subscribe((response: any) => {
      this.removerModal();
      this.reiniciarFormulario();
      this.onSubmitDesignacaoDeMeiosForm.emit(true);
    })
  }

  private async buscarTipoDeNormaPessoas(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.tipo_de_norma_pessoas_service
      .listar(options)
      .subscribe((response: any): void => {
        this.tipo_de_norma_pessoas = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        console.log(this.tipo_de_norma_pessoas)
      });
  }

  reiniciarFormulario(): void {
    this.cadastroForm.reset();
    this.onSubmitDesignacaoDeMeiosForm.emit(true);
    this.validarDadosDoFormulario();
  }

  removerModal(): void {
    this.modalService.fechar('btn-close-registar');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}