import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { FuncionariosService } from '@resources/modules/sigv-version2/core/funcionario/funcionarios.service';
import { ModalService } from '@core/services/config/Modal.service';


import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { PreDespachoService } from '@resources/modules/sigvestuario/core/planos/pre-despacho.service';
import { Select2OptionData } from 'ng-select2';


@Component({
  selector: 'sigvest-listar-orgaos-e-comandos-modal',
  templateUrl: './listar-orgaos-e-comandos-modal.component.html',
  styleUrls: ['./listar-orgaos-e-comandos-modal.component.css']
})
export class ListarOrgaosEComandosModalComponent implements OnInit {
  @Input() foto: any;
  @Output() fecharModalEvent = new EventEmitter<boolean>();
  @Output() partilharDadosDoFuncionarioOuEfectivo = new EventEmitter<any>();
  @Output() partilharDadosDoFuncionarioOuEfectivoArray = new EventEmitter<any>();
  public pagination = new Pagination();
  public totalBase: number = 0;
  public funcionario: any = [];
  public loadingPage = false;
  form!: FormGroup;

  public atribuir_meios_ao_efectivo_dados_do_agente: any;

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipo_orgao: '',
    pessoafisica: null,
  };

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public tipo_estrutura_organicas: Array<Select2OptionData> = [];
  public direcao_ou_orgao: Array<Select2OptionData> = [];
  public planificacaoForm!: FormGroup;

  constructor(
    private funcionarios_service: FuncionariosService,
    private modal_service: ModalService,
    private fb: FormBuilder,

    private tipo_estrutura_organica_service: TipoEstruturaOrganica,
    private direcao_ou_orgao_service: DirecaoOuOrgaoService,
    private pre_despacho_service: PreDespachoService
  ) { }

  ngOnInit(): void {
    this.buscarFuncionarios();
    this.validarFormulario();
    this.validarPlanoDotacaoForm()
    this.buscarTipoEstruturaOrganica();
  }

  validarFormulario() {
    this.form = this.fb.group({
      selecionados: this.fb.array([]) // Para armazenar os IDs selecionados
    });
  }

  validarPlanoDotacaoForm() {
    const regexNumero = /^\d+$/;

    this.planificacaoForm = this.fb.group({
      anexo_plano: ['http://'],

      pessoajuridicas_id: [''],
      local_fornecimento: ['BCA'],
      descricao: [''],
    });


  }
  private async buscarFuncionarios(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    this.funcionarios_service
      .listar(this.filtro)
      .subscribe((response: any): void => {
        this.loadingPage = true;

        this.funcionario = response.data/* .map((item: any) => {
          if(item.foto_efectivo){
            console.log(item.foto_efectivo)
            let foto: any;
            this.ficheiro_service.getFileUsingUrl(item?.foto_efectivo).subscribe({
              next: (response) => {
                foto = this.ficheiro_service.createImageBlob(response)
              },
            })
            item.foto_efectivo = foto;
            console.log(item.foto_efectivo)
            return item;
          }
        }); */

        console.table(this.funcionario)
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  fecharModal() {
    this.fecharModalEvent.emit(true);
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    if (reiniciar) {
      this.filtro.page = 1;
    }

    this.buscarFuncionarios();
  }

  recarregarPagina() {
    this.buscarFuncionarios();
  }

  validarFuncionario(item: any) {
    //this.escolherFuncionario = item;
    //this.planificacaoForm.get('pessoafisicas_id')?.setValue(item.id)
    this.partilharDadosDoFuncionarioOuEfectivo.emit(item);
    this.removerModal();
  }


  get selecionados(): FormArray {
    return this.form.get('selecionados') as FormArray;
  }

  onCheckboxChange(event: any, usuario: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selecionados.push(this.fb.control(usuario.id));
    } else {
      const index = this.selecionados.controls.findIndex(x => x.value === usuario.id);
      this.selecionados.removeAt(index);
    }

    console.log('IDs Selecionados:', this.selecionados.value);
  }

  executarAcao() {
    const idsSelecionados = this.selecionados.value;
    const usuariosSelecionados = this.funcionario.filter((u: any) => idsSelecionados.includes(u.id));

    console.log('Usuários selecionados:', usuariosSelecionados);
    this.partilharDadosDoFuncionarioOuEfectivoArray.emit(usuariosSelecionados)
    this.removerModal();

    // Aqui você pode disparar sua função com os usuários selecionados
    // Ex: deletarUsuarios(usuariosSelecionados);
  }

  removerModal() {
    this.modal_service.fechar('btn-close-efectivos')
  }

  setItem(item: any) {
    console.log(item)
    const result = this.direcao_ou_orgao.filter((option: any) => {
      return option.id == item
    })

    console.log(result[0].id)
    this.atribuir_meios_ao_efectivo_dados_do_agente = {
      id: result[0].id,
      nome_completo: result[0].text,
      tipo_atribuicao_nmg: 'colectivo'
    };
  }

  produtosAtribuidosComSucesso() {
    this.fecharModalEvent.emit(true)
  }

  onSubmit() {

  }

  async buscarTipoEstruturaOrganica() {
    await this.tipo_estrutura_organica_service.listar({})
      .subscribe((response: any): void => {
        console.log(response)
        this.tipo_estrutura_organicas = response.filter((item: any) => (item.sigla == 'SAT' || item.sigla == 'UT' || item.sigla == 'UC'))
          .map((item: any) => ({ id: item.sigla, text: item.name }))
        this.selecionarOrgaoOuComandoProvincial(response?.sigla)

      })
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    if (!$event) {
      this.planificacaoForm.get('id_departamento_envio')?.disable()
      this.planificacaoForm.get('id_departamento_envio')?.setValue(null)
    } else {
      this.direcao_ou_orgao_service.listarTodos({
        tipo_estrutura_sigla: $event
      }).subscribe((response: any): void => {
        this.direcao_ou_orgao = response/* .filter((item: any) => (
              item.sigla != 'DTTI' &&
              item.sigla != 'DPQ' &&
              item.sigla != 'DIC' &&
              item.sigla != 'DAS' &&
              item.sigla != 'DAJ' &&
              item.sigla != 'DEP' &&
              item.sigla != 'DIF' &&
              item.sigla != 'DISPO' &&
              item.sigla != 'DT' &&
              item.sigla != 'DSS' &&
              item.sigla != 'DIE' &&
              item.sigla != 'DINFOP' &&
              item.sigla != 'DEPAT' &&
              item.sigla != 'IPNA' &&
              item.sigla != 'DCII' &&
              item.sigla != 'DTSR')) */
          .map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.planificacaoForm.get('pessoajuridicas_id')?.enable()

      })

    }
  }

  public reiniciarFormulario(): void {
    this.planificacaoForm.reset();
  }
}
