import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { ActivatedRoute, Router } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import Swal from 'sweetalert2';
import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
import { PreDespachoIndividualService } from '@resources/modules/sigvestuario/core/planos/pre-despachoIndividual.service';
import { MeiosAtribuidosService } from '../../core/meios/meios-atribuidos.service';
import { ModalService } from '@core/services/config/Modal.service';

@Component({
  selector: 'sigvest-atribuir-meios-modal',
  templateUrl: './atribuir-meios-modal.component.html',
  styleUrls: ['./atribuir-meios-modal.component.css']
})
export class AtribuirMeiosModalComponent implements OnInit {
  @Input() plano_id: any;
  @Input() atribuir_meios_ao_efectivo_dados_do_agente: any;
  @Output() atribuir_meios_ao_efectivo_dados_do_agente_event = new EventEmitter<Boolean>();
  @Output() registadoComSucesso = new EventEmitter<Boolean>();
  public funcionario: any;
  public produtosPlanificadosForm!: FormGroup;
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public produtosPlanificados: Array<Select2OptionData> = [];
  public produtosPlanificadosList: any = []; // para poder pegar as unidades e imagens é uma cópia do array produtosPlanificados com todos os dados
  public unidades: any;
  public fileUrl: any;

  constructor(
    private designacao_de_meios_service: DesignacaoDeMeiosService,
    private modal_service: ModalService,
    private meios_atribuidos_service: MeiosAtribuidosService,
    private pre_despacho_individual_service: PreDespachoIndividualService,
    private ficheiroService: FicheiroService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validarprodutosPlanificadosForm()
    this.buscarDescricaoProduto();
    this.adicionarItem()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['atribuir_meios_ao_efectivo_dados_do_agente'].currentValue != changes['atribuir_meios_ao_efectivo_dados_do_agente'] && this.atribuir_meios_ao_efectivo_dados_do_agente != null) {
      //console.log(this.atribuir_meios_ao_efectivo_dados_do_agente)
      this.atribuir_meios_ao_efectivo_dados_do_agente = this.atribuir_meios_ao_efectivo_dados_do_agente;
      this.funcionario = this.atribuir_meios_ao_efectivo_dados_do_agente;
    }
  }

  validarprodutosPlanificadosForm() {
    this.produtosPlanificadosForm = this.fb.group({
      itens: this.fb.array([], Validators.required)
    })
  }

  get itens() {
    return (this.produtosPlanificadosForm.get('itens') as FormArray).controls as FormGroup[];
  }

  adicionarItem() {
    console.log(this.atribuir_meios_ao_efectivo_dados_do_agente);
    const novoItem = this.fb.group({
      meios_id: '',
      quantidade_atribuidos: '',
      unidade_meios: '',
      imagemUrl: [''],
      unidadesMedida: [''],

      nome: 'Texte',
      tamanho_meios: 999, 
      genero: 'M'
    });

    return (this.produtosPlanificadosForm.get('itens') as FormArray).push(novoItem)
  }

  removerItem(index: number) {
    return (this.produtosPlanificadosForm.get('itens') as FormArray).removeAt(index);
  }

  onSubmitProdutosPlanificados() {
    if (this.produtosPlanificadosForm.invalid) {
      return;
    }

    const dados = this.produtosPlanificadosForm.value;

    // Verificar duplicados
    if (this.temDuplicados(dados.itens)) {
      let produto_duplicado: any = [];
      for(let item of dados.itens){
        for (const indice in this.produtosPlanificados){
          if (this.produtosPlanificados[indice].id == item.meios_id){
            produto_duplicado.push(
              this.produtosPlanificados[indice].text
            )
          }
        }
      }
      this.alertar(`Existem produtos duplicados ( <strong> ${produto_duplicado} </strong> ) no formulário. Verifique e tente novamente.`);
      return;
    }

    this.percorrerObjeto(dados.itens)
    this.registadoComSucesso.emit(true);
  }

  // Método para verificar duplicados no array de itens
  temDuplicados(itens: any[]): boolean {
    const descricaoIds = itens.map(item => item.meios_id);
    
    // Verificar duplicados
    const descricaoIdSet = new Set(descricaoIds);
    return descricaoIds.length !== descricaoIdSet.size;
  }
 
  percorrerObjeto(obj:any) {
    for (const chave in obj) {
      if (typeof obj[chave] === 'object') {
        console.log(`Objeto aninhado encontrado em ${chave}`);
        this.inserirDadosNaApiProdutosPlaficado({ ...obj[chave], beneficiario_id: this.atribuir_meios_ao_efectivo_dados_do_agente.id })
      }
    }
  }

  /** Secção de teste para a inserção de dados */
  async inserirDadosNaApiProdutosPlaficado(produtos: any) {
    await this.meios_atribuidos_service.registar(produtos).subscribe({
      next: (response) => {
        this.registadoComSucesso.emit(true);
        this.fecharTodosModal();
      },
      error: (err) => {
        console.log('erro ao registar produtos Planificados: ' + err);
      },
      complete: () => {
        if(this.funcionario.tipo_atribuicao_nmg == 'colectivo')
          this.router.navigate(['/piips/sigvest/distribuicao/colectiva/listar/']);
        else
          this.router.navigate(['/piips/sigvest/distribuicao/individual/listar/']);
        console.log('completado com sucesso a operação')
      }
    })
  }

  buscarDescricaoProduto(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    this.designacao_de_meios_service
      .listar(options)
      .subscribe((response: any): void => {
        this.produtosPlanificados = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.produtosPlanificadosList = response;
      });
  }

  setarUnidades(event: any, contador: number){
    this.percorrerObjetoParaUnidades(this.produtosPlanificadosList, event, contador)
  }

  percorrerObjetoParaUnidades(obj:any, event:any, contador: number) {
    /* Nesta secção pegarei tanto o grupo calorico para as unidades e as imagens para as pre-visualizacoes */
    for (const chave in obj) {
      if (obj[chave].id == event){
        this.ficheiroService
        .getFileUsingUrl(obj[chave].anexo_foto)
        .subscribe((file) => {
          this.fileUrl = this.ficheiroService.createImageBlob(file);

          /* pegar a imagem e mandar dentro do meu FormArray */
          this.itens.at(contador)?.patchValue({ imagemUrl: this.fileUrl });
        });
      }
    }
  }

  descartarPlano(id: number){
    this.pre_despacho_individual_service.eliminar(id).subscribe({
      next: (response) => {
        this.registadoComSucesso.emit(true);
        this.fecharTodosModal();
      },
      error: (err) =>{
        console.error("Falha ao excluir produto!");
      },
      complete: () => {
        this.router.navigate(['/piips/sigvest/planificacao/pre-despacho/colectivo/listar/']);
      }
    }); 
  }

  public alertar(texto: string){
    Swal.fire({
      title: 'Ação Cancelada',
      html: texto,
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  public limparDados() {
    this.atribuir_meios_ao_efectivo_dados_do_agente_event.emit(true);
    this.validarprodutosPlanificadosForm();
    this.adicionarItem();
  }

  public fecharTodosModal() {
    console.log('fechar-modal')
    this.modal_service.fechar('btn-fechar-modal-atribuir-meios');
    this.modal_service.fecharTodos();
  }
}
