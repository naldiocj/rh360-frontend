import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize, map } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { Router } from '@angular/router';
import { PlanosInternoService } from '@resources/modules/sigv-version2/core/plano/planos-interno.service';
import Swal from 'sweetalert2';

import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
import { DesignacaoNormaPessoasService } from '@resources/modules/sigvestuario/core/normas/designacao-norma-pessoas.service';
import { PlanoDeNecessidadesService } from '@resources/modules/sigvestuario/core/planos/plano-de-necessidades.service';
import { MeiosPlanoDeNecessidadesService } from '@resources/modules/sigvestuario/core/planos/meios-plano-de-necessidades.service';
import { SecureService } from '@core/authentication/secure.service';
import { CarreiraService } from '@resources/modules/sigvestuario/core/carreira/carreira.service';

@Component({
  selector: 'sigvest-registar-meios',
  templateUrl: './registar-meios.component.html',
  styleUrls: ['./registar-meios.component.css']
})
export class RegistarMeiosComponent implements OnInit {
  @Input() plano_id: any;
  @Output() limparEstadoProcessamento = new EventEmitter<Boolean>();
  @Output() produtoDetalhe = new EventEmitter<any>();

  public produtosPlanificadosForm!: FormGroup;
  public produtosPlanificados: Array<Select2OptionData> = [];
  public tipo_de_carreira: Array<Select2OptionData> = [];
  public designacao_de_meios: Array<Select2OptionData> = [];
  public designacao_de_norma_pessoas: Array<Select2OptionData> = [];
  public produtosPlanificadosList: any = []; // para poder pegar as unidades e imagens é uma cópia do array produtosPlanificados com todos os dados
  public unidades: any;
  public fileUrl: any;
  public flag_mostrar_estructura_organica_e_orgaos_no_template: boolean = false;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  get itens() {
    return (this.produtosPlanificadosForm.get('itens') as FormArray).controls as FormGroup[];
  }

  get orgao_id() {
    return this.secure_service.getTokenValueDecode()?.orgao?.id;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ficheiroService: FicheiroService,

    private designacao_de_meios_service: DesignacaoDeMeiosService,
    private designacao_de_norma_pessoas_service: DesignacaoNormaPessoasService,
    private plano_de_necessidades_service: PlanoDeNecessidadesService,
    private meios_plano_de_necessidades_service: MeiosPlanoDeNecessidadesService,
    private secure_service: SecureService,
    private tipo_de_carreira_service: CarreiraService
  ) { }

  ngOnInit(): void {
    this.validarprodutosPlanificadosForm()
    this.buscarDesignacaoDeMeios();
    this.buscarDesignacaoDeNormaPessoas();
    this.buscarTipoDeCarreira();
    this.adicionarItem()
  }

  validarprodutosPlanificadosForm() {
    this.produtosPlanificadosForm = this.fb.group({
      carreira_id: [],
      itens: this.fb.array([], Validators.required)
    })
  }

  adicionarItem() {
    const novoItem = this.fb.group({
      meio_id: '',
      quantidade: '',
      tipo_unidades: '',
      preco_unitario: '',
      pr_t_nec: '',
      prazo_uso: '',
      norma_pessoa_id: '',
      pessoajuridica_id: this.orgao_id,
      carreira_id: this.produtosPlanificadosForm.get('carreira_id')?.value,
      imagemUrl: [''],
      unidadesMedida: ['']
    });

    return (this.produtosPlanificadosForm.get('itens') as FormArray).push(novoItem)
  }

  removerItem(index: number) {
    /* this.itens.removeAt(index); */
    return (this.produtosPlanificadosForm.get('itens') as FormArray).removeAt(index);
  }
  
  private recriarFormArray() {
    this.produtosPlanificadosForm.setControl('itens', this.fb.array([]));
  }

  onSubmitProdutosPlanificados() {
   
  }

  public setItem(item: any) {
    this.produtoDetalhe.emit(item.value)
  }

  public adicionarTipoDeCarreiraAoPlano(id: any){
    this.produtosPlanificadosForm.get('carreira_id')?.setValue(id);

    if (this.itens.length > 0) {
      this.itens.at(0)?.get('carreira_id')?.setValue(id);
    }
    
  }

  public mostrarOuEsconderEstructuraOrganica(): void {
    this.flag_mostrar_estructura_organica_e_orgaos_no_template = !this.flag_mostrar_estructura_organica_e_orgaos_no_template;
  }

  public adicionarOutraClasse() {
    this.onSubmit();
    this.recriarFormArray();
    this.adicionarItem();
  }

  private async buscarDesignacaoDeMeios(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.designacao_de_meios_service
      .listar(options)
      .subscribe((response: any): void => {
        this.designacao_de_meios = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.produtosPlanificadosList = response;
      });
  }

  private async buscarDesignacaoDeNormaPessoas(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.designacao_de_norma_pessoas_service
      .listar(options)
      .subscribe((response: any): void => {
        this.designacao_de_norma_pessoas = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private async buscarTipoDeCarreira(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.tipo_de_carreira_service
      .listar(options)
      .subscribe((response: any): void => {
        console.log('resultado das carreiras')
        console.log(response);
        this.tipo_de_carreira = response.sort((a: any, b: any) => a.sigla.localeCompare(b.sigla))
        .map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome,
        }));
      });
  }

  setarUnidades(event: any, contador: number) {
    this.percorrerObjetoParaUnidades(this.produtosPlanificadosList, event, contador)
  }

  percorrerObjetoParaUnidades(obj: any, event: any, contador: number) {
    /* Nesta secção pegarei tanto o grupo calorico para as unidades e as imagens para as pre-visualizacoes */
    for (const chave in obj) {
      if (obj[chave].id == event) {
        /* this.unidades = obj[chave].nome_calorico.toLowerCase();
        this.itens.at(contador)?.patchValue({ unidadesMedida: this.unidades }); */

        /* this.ficheiroService
          .getFileUsingUrl(obj[chave].anexo_foto)
          .subscribe((file) => {
            this.fileUrl = this.ficheiroService.createImageBlob(file);

            /* pegar a imagem e mandar dentro do meu FormArray 
            this.itens.at(contador)?.patchValue({ imagemUrl: this.fileUrl });
          }); */
      }
    }
  }

  validarEliminar(item: any) {
    Swal.fire({
      title: "Eliminar?",
      html: `Pretende descartar esse <strong>Plano</strong>? Esta acção não poderá ser revertida!`,
      icon: "warning",
      cancelButtonText: 'Cancelar',
      // timer: 2000,
      showCancelButton: true,
      confirmButtonText: "Sim, Descartar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger px-2 mr-1',
        cancelButton: 'btn btn-primary ms-2 px-2',
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Caso confirme, descartar o plano
        this.descartarPlano(item.plano_id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Caso cancele, permanecer na mesma página
        this.alertarAoUsuario('O plano não foi descartado e você pode continuar com o registro.');
      }

    })
  }


  onSubmit() {
    console.log('envia');
    if (this.produtosPlanificadosForm.invalid) {
      return;
    }

    const form_dados = this.produtosPlanificadosForm.value;
    this.listarDadosDuplicados(form_dados.itens);
    this.percorrerObjectoItens(form_dados.itens);
  }


  verificarDadosDuplicados(itens: any[]): boolean {
    const descricaoIds = itens.map(item => item.meio_id);

    // Verificar duplicados
    const descricaoIdSet = new Set(descricaoIds);
    return descricaoIds.length !== descricaoIdSet.size;
  }


  listarDadosDuplicados(form_meios: any) {
    if (this.verificarDadosDuplicados(form_meios)) {
      let produto_duplicado: any = [];
      for (let item of form_meios) {
        for (const indice in this.designacao_de_meios) {
          if (this.designacao_de_meios[indice].id == item.meio_id) {
            produto_duplicado.push(
              this.designacao_de_meios[indice].text
            )
          }
        }
      }
      this.alertarAoUsuario(`Existem produtos duplicados ( <strong> ${produto_duplicado} </strong> ) no formulário. Verifique e tente novamente.`);
      return;
    }
  }

  percorrerObjectoItens(itens: any) {
    for (const chave in itens) {
      if (typeof itens[chave] === 'object') {
        this.registarNaBaseDeDados({ ...itens[chave], plano_id: this.plano_id })
      }
    }

    //this.limparEstadoProcessamento.emit(true);
  }

  registarNaBaseDeDados(meio: any) {
    this.meios_plano_de_necessidades_service.registar(meio).subscribe({
      next: (response) => {
        console.log("Produtos adicionados com sucesso.");
      },
      error: (err) => {
        console.log('Erro ao adicionar produtos ao plano: ' + err);
        this.limparEstadoProcessamento.emit(true);

      },
      complete: () => {
        console.log('completado com sucesso a operação')
        //this.router.navigate(['/piips/sigvest/planificacao/plano-de-necessidades/listar']);

      }
    })
  }

  public alertarAoUsuario(texto: string) {
    Swal.fire({
      title: 'Ação Cancelada',
      html: texto,
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  descartarPlano(id: number) {
    this.plano_de_necessidades_service.eliminar(id).subscribe({
      next: (response) => {
        //this.buscarPlanos();
        this.limparEstadoProcessamento.emit(true);
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => {
        this.router.navigate(['/piips/sigvest/planificacao/plano-de-necessidades/listar']);
      }
    });
  }

  finalizar(){
    this.limparEstadoProcessamento.emit(true);
    this.router.navigate(['/piips/sigvest/planificacao/plano-de-necessidades/listar']);
  }
}