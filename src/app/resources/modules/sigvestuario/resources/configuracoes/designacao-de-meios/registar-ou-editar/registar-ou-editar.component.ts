import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { TipoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/tipo-de-meios.service';
import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
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
  destroy$ = new Subject<void>();
  public cadastroForm!: FormGroup;
  public tipo_de_meios: Array<Select2OptionData> = [];

  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public arquivoSelecionado: any = null;
  public imagemPreVisualizacao: string | ArrayBuffer | null = null;
  public genero_selecionado: any;

  get descricao_produto_id(): number {
    return this.designacao_de_meios?.id;
  }

  get nome_utilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo;
  }

  constructor(
    private secureService: SecureService,
    private tipo_de_meios_service: TipoDeMeiosService,
    private designacao_de_meios_service: DesignacaoDeMeiosService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private ficheiroService: FicheiroService
  ) { }

  ngOnInit(): void {
    this.validarDadosDoFormulario();
    this.buscarTipoDeMeios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['designacao_de_meios'].currentValue != changes['designacao_de_meios'] && this.designacao_de_meios != null) {
      this.preencherDescricaoProdutoForm();
    }
  }

  private validarDadosDoFormulario(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo_meios_id: ['', Validators.required],
      tamanho_meios: ['', Validators.required],
      genero: [''],
      anexo_foto: ['']//, Validators.pattern('image/*')
    });
  }

  private preencherDescricaoProdutoForm(): void {
    this.converterImagemPraBlob(this.designacao_de_meios.anexo_foto);
    this.genero_selecionado = this.designacao_de_meios.genero;

    this.cadastroForm.patchValue({
      nome: this.designacao_de_meios.nome,
      tipo_meios_id: this.designacao_de_meios.tipo_de_meios_id,
      tamanho_meios: this.designacao_de_meios.tamanho_meios,
      genero: this.designacao_de_meios.genero,
      //anexo_foto: this.designacao_de_meios.anexo_foto
    })
  }

  public async onSubmit() {
    if (this.cadastroForm.invalid) { return; }

    const formData = new FormData();
    //formData.append('anexo_foto', this.arquivoSelecionado);
    formData.append('nome', this.cadastroForm.get('nome')?.value);
    formData.append('tamanho_meios', this.cadastroForm.get('tamanho_meios')?.value);
    formData.append('genero', this.cadastroForm.get('genero')?.value);
    formData.append('tipo_meios_id', this.cadastroForm.get('tipo_meios_id')?.value);

    const type = await this.descricao_produto_id ? this.designacao_de_meios_service.editar(this.descricao_produto_id, formData) : this.designacao_de_meios_service.registar(formData);
    type.pipe(
      finalize(() => { })
    ).subscribe((response: any) => {
      this.removerModal();
      this.reiniciarFormulario();
      this.onSubmitDesignacaoDeMeiosForm.emit(true);
    })
  }


  public carregarImagem(event: any) {
    if (event.target.files.length > 0) {
      this.arquivoSelecionado = event.target.files[0];

      // Atualize o controle do formulário
      this.cadastroForm.patchValue({
        file: this.arquivoSelecionado
      });

      // Pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreVisualizacao = reader.result;
      };
      reader.readAsDataURL(this.arquivoSelecionado);
    }
  }

  private async buscarTipoDeMeios(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.tipo_de_meios_service
      .listar(options)
      .subscribe((response: any): void => {
        this.tipo_de_meios = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private converterImagemPraBlob(enderecoImagem: any) {
    this.ficheiroService
      .getFileUsingUrl(enderecoImagem)
      .subscribe((response) => {
        this.imagemPreVisualizacao = this.ficheiroService.createImageBlob(response)
      })

  }

  reiniciarFormulario(): void {
    this.cadastroForm.reset();
    this.imagemPreVisualizacao = null;
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