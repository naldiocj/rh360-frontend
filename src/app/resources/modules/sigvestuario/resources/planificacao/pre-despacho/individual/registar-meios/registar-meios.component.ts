import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { ActivatedRoute, Router } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import Swal from 'sweetalert2';
import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
import { MeiosPreDespachoService } from '@resources/modules/sigvestuario/core/planos/meios-pre-despacho.service';
import { PreDespachoIndividualService } from '@resources/modules/sigvestuario/core/planos/pre-despachoIndividual.service';


@Component({
  selector: 'sigvest-registar-meios',
  templateUrl: './registar-meios.component.html',
  styleUrls: ['./registar-meios.component.css']
})
export class RegistarMeiosComponent implements OnInit {
  @Input() plano_id: any;
  @Output() limparEstadoProcessamento = new EventEmitter<Boolean>();
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
    private meios_pre_despacho_service: MeiosPreDespachoService,
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

  validarprodutosPlanificadosForm() {
    this.produtosPlanificadosForm = this.fb.group({
      itens: this.fb.array([], Validators.required)
    })
  }

  get itens() {
    return (this.produtosPlanificadosForm.get('itens') as FormArray).controls as FormGroup[];
  }

  adicionarItem() {
    const novoItem = this.fb.group({
      meios_id: '',
      quantidade_numerario: '',
      unidade_meios: '',
      imagemUrl: [''],
      unidadesMedida: ['']
    });

    return (this.produtosPlanificadosForm.get('itens') as FormArray).push(novoItem)
  }

  removerItem(index: number) {
    /* this.itens.removeAt(index); */
    return (this.produtosPlanificadosForm.get('itens') as FormArray).removeAt(index);
  }

  onSubmitProdutosPlanificados() {
    if (this.produtosPlanificadosForm.invalid) { return; }

    const dados = this.produtosPlanificadosForm.value;

    // Verificar duplicados
    if (this.temDuplicados(dados.itens)) {
      let produto_duplicado: any = [];
      for(let item of dados.itens){
        for (const indice in this.produtosPlanificados){
          if (this.produtosPlanificados[indice].id == item.descricao_id){
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
    this.limparEstadoProcessamento.emit(true);
  }

  // Método para verificar duplicados no array de itens
  temDuplicados(itens: any[]): boolean {
    const descricaoIds = itens.map(item => item.descricao_id);
    
    // Verificar duplicados
    const descricaoIdSet = new Set(descricaoIds);
    return descricaoIds.length !== descricaoIdSet.size;
  }
 
  percorrerObjeto(obj:any) {
    for (const chave in obj) {
      if (typeof obj[chave] === 'object') {
        console.log(`Objeto aninhado encontrado em ${chave}`);
        //this.percorrerObjeto(obj[chave]); // Chamada recursiva para objetos aninhados
        //textando enviar os dados apartir do if e nao do else
        this.inserirDadosNaApiProdutosPlaficado({ ...obj[chave], pre_despacho_id: this.plano_id })
      } else {
        //console.log(`${chave}: ${obj[chave]}`);
        //this.inserirDadosNaApiProdutosPlaficado({ ...obj, id_plano: this.route.snapshot.queryParams["plano"] as number })
      }
    }
  }

  /** Secção de teste para a inserção de dados */
  async inserirDadosNaApiProdutosPlaficado(produtos: any) {
    console.log('produtos antes de inserir: ' + produtos)

    await this.meios_pre_despacho_service.registar(produtos).subscribe({
      next: (response) => {
        console.log("resposta da produtos planificacao: " + response.data);
      },
      error: (err) => {
        console.log('erro ao registar produtos Planificados: ' + err);
      },
      complete: () => {
        this.router.navigate(['/piips/sigvest/planificacao/pre-despacho/individual/listar/']);
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
        this.unidades = obj[chave].nome_calorico.toLowerCase();
        this.itens.at(contador)?.patchValue({ unidadesMedida: this.unidades });

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
        //this.buscarPlanos();
        this.limparEstadoProcessamento.emit(true);
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
}
