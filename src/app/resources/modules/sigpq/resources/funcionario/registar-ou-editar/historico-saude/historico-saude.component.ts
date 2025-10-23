import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AgregadoFamiliarService } from '@resources/modules/sigpq/core/service/Agregado-Familiar.service';
import { TipoFamiliarService } from '@resources/modules/sigpq/core/service/Tipo-familiar.service';
import { TipoDocumentoService } from '@resources/modules/sigpq/core/service/config/Tipo-documento.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TYPE_HISTORICO_SAUDE } from './HistoricoSaudeTypes';
import { HistoricoSaudeService } from '@resources/modules/sigpq/core/service/HistoricoSaudeService';

@Component({
  selector: 'sigpq-historico-saude',
  templateUrl: './historico-saude.component.html',
  styleUrls: ['./historico-saude.component.css'],
})
export class HistoricoSaudeComponent implements OnInit {
  public simpleForm: any;
  public isLoading: any;
  @Input() public params: any;
  @Input() public options: any;
  public historicoSaude: any = [];
  public historicosSaude: any = [];
  public agregadosFamiliar: any = [];
  public agregadosFamiliarFile: any = [];
  public totalBase: number = 0;
  public documento: any;
  public carregarDocumento: boolean = false;

  public TYPES = { ...TYPE_HISTORICO_SAUDE };

  public tipoHistoricoSaude: Array<Select2OptionData> = [
    { id: TYPE_HISTORICO_SAUDE.APF, text: 'Antecedente Patológico Familiar' },
    { id: TYPE_HISTORICO_SAUDE.APP, text: 'Antecedente Patológico Pessoal' },
    {
      id: TYPE_HISTORICO_SAUDE.DOP,
      text: 'Doença Ocupacional ou Profissional',
    },
    { id: TYPE_HISTORICO_SAUDE.DAT, text: 'Doença Arquirida no Trabalho' },
    { id: TYPE_HISTORICO_SAUDE.AT, text: 'Acidente de Trabalho' },
    { id: TYPE_HISTORICO_SAUDE.LFC, text: 'Lesão ou Fractura no Corpo' },
  ];
  public grauParentesco: Array<Select2OptionData> = [
    { id: 'AVOS', text: 'Avós' },
    { id: 'PAI', text: 'Pai' },
    { id: 'MÃE', text: 'Mãe' },
  ];

  public fileUrl: any;
  public pagination: Pagination = new Pagination();
  private id: any;
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };
  tipoDocumentos: Array<Select2OptionData> = [];
  tipoFamiliares: Array<Select2OptionData> = [];

  public formatAccept = ['.pdf'];

  tipoOutrosDados: Array<Select2OptionData> = [];

  public submitted: boolean = false;
  public isHidden: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipoFamiliarService: TipoFamiliarService,
    private tipoDocumentoService: TipoDocumentoService,
    private agregadoFamiliarService: AgregadoFamiliarService,
    private historicoSaudeService: HistoricoSaudeService,
    private ficheiroService: FicheiroService,
    public formatarDataHelper: FormatarDataHelper
  ) {}

  ngOnInit(): void {
    this.buscarTipoOutrosDados();
    this.criarForm();
    this.buscarTipoFamiliarService();
    this.buscarHistoricoSaude();

    this.simpleForm.get('tipo_historico_saude')?.setValue(this.TYPES.APF);
  }

  public get getId() {
    return this.params?.getId as number;
  }

  public isNotQuestion() {
    if (
      this.simpleForm.get('tipo_historico_saude')?.value !== this.TYPES.LFC ||
      this.simpleForm.get('tipo_historico_saude')?.value !== this.TYPES.AT
    ) {
      this.isHidden = false;
    }

    this.isHidden = true;
  }

  public isNotLFCOrAT() {
    const tipo = this.simpleForm.get('tipo_historico_saude')?.value;
    return tipo !== this.TYPES.LFC && tipo !== this.TYPES.AT;
  }

  buscarTipoOutrosDados(): void {
    const opcoes = {};
    this.tipoDocumentoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoOutrosDados = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        // somente BI e Boletim de nascimento
        this.tipoDocumentos = response
          .filter((item: any) => item.id == 1 || item.id == 9)
          .map((item: any) => ({ id: item.id, text: item.nome }));
      });
  }

  buscarTipoFamiliarService(): void {
    const opcoes = {};
    this.tipoFamiliarService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          this.tipoFamiliares = this.tipoFamiliares.filter((item: any) => {
            return ['Filho (a)', 'Esposo (a)'].includes(item?.text?.toString());
          });
        })
      )
      .subscribe((response: any): void => {
        const tipo = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.tipoFamiliares = tipo.filter((item: any) => item.id > 2); // excepto pai e mãe
      });
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      tipo_historico_saude: [null],
      grau_parentesco: [null],
      qual_historico_saude: [null],
      tempo_historico_saude: [null],
    });
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite somente números
  }

  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`);
    const faInput: any = collapse.querySelector('.fa-1');

    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }

  private get getData() {
    const formData = new FormData();
    formData.append(
      'tipo_historico_saude',
      this.simpleForm?.value?.tipo_historico_saude
    );
    formData.append('grau_parentesco', this.simpleForm?.value?.grau_parentesco);
    formData.append(
      'qual_historico_saude',
      this.simpleForm?.value?.qual_historico_saude
    );
    formData.append(
      'tempo_historico_saude',
      this.simpleForm?.value?.tempo_historico_saude
    );
    formData.append('funcionario_id', this.getId.toString());

    return formData;
  }

  public onSubmit() {
    if (this.simpleForm.invalid || this.submitted) return;
    const formData = this.getData;
    this.isLoading = true;
    this.submitted = true;

    const type = this.buscarId
      ? this.historicoSaudeService.editar(formData, this.buscarId)
      : this.historicoSaudeService.registar(formData);

    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.limparItem();
        },
      });
  }

  private get getDado_activo() {
    const formData = new FormData();
    formData.append('activo', '1');
    return formData;
  }

  setItemAprovar(item: any) {
    const dados = this.getDado_activo;
    const type = this.agregadoFamiliarService.activo(dados, item.id);

    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.limparItem();
        },
      });
  }

  public reiniciarFormulario = () => {
    $('#file-familiar').val('');
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId,
    });
  };

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarHistoricoSaude();
  }

  public filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarHistoricoSaude();
  }

  private buscarHistoricoSaude() {
    this.historicoSaudeService
      .listar({ ...this.filtro, funcionario_id: this.getId })
      .pipe()
      .subscribe({
        next: (response: any) => {
          // this.agregadosFamiliarFile = response.data.filter((documento: any) => {

          //   // Use includes para verificar se o valor está presente no array
          //   if (['Bilhete de Identidade', 'Boletim de Nascimento'].includes(documento?.sigpq_tipo_documento_nome)) {
          //     return true; // Retorna true para incluir o documento no resultado
          //   }
          //   return false
          // });

          this.historicosSaude = response.data;
          // this.agregadosFamiliarFile = response.data;

          // this.historicoSaude = response.data.filter((documento: any) => {

          //   // Use includes para verificar se o valor está presente no array
          //   if (['Bilhete de Identidade', 'Boletim de Nascimento'].includes(documento?.sigpq_tipo_documento_nome)) {
          //     return true; // Retorna true para incluir o documento no resultado
          //   } else {
          //     return false; // Retorna false para excluir o documento do resultado
          //   }
          // });

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });

    //hasConjuge=this.historicoSaude.filter((item:any)=>{item.})
    //console.log("Dados recuperados:",this.historicoSaude)
  }

  public get getPessoaId(): number {
    return (this.params?.getInfo as number) ?? (this.params?.getId as number);
  }

  construcao() {
    alert('Em construção');
  }

  visualizar(documento: any) {
    const opcoes = {
      pessoaId: this.getPessoaId,
      url: '',
    };

    this.fileUrl = null;

    if (
      ['Bilhete de Identidade', 'Boletim De Nascimento'].includes(
        documento?.sigpq_tipo_documento_nome
      )
    ) {
      opcoes.url = documento?.anexo || null;
    } else {
      const documentoAux = this.agregadosFamiliarFile.find(
        (f: any) =>
          f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id
      );
      opcoes.url = documentoAux?.anexo || null;
    }

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.carregarDocumento = false;
        })
      )
      .subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });

    return true;
  }

  public setItem(item: any) {
    if (!item) return;
    this.historicoSaude = item;

    console.log('Dados recebidos:', item);
    this.simpleForm.patchValue({
      tipo_historico_saude: item?.tipo_historico_saude,
      grau_parentesco: item?.grau_parentesco,
      qual_historico_saude: item?.qual_historico_saude,
      tempo_historico_saude: item?.tempo_historico_saude,
    });

    this.isNotQuestion()
  }

  private corrigirFormatoData(data: string): string | null {
    if (!data) return null;

    // Verificar o formato esperado "DD/MM/YYYY HH:mm:ss"
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/;
    const match = data.match(regex);

    if (!match) {
      console.warn('Data inválida:', data);
      return null;
    }

    // Rearranjar para "YYYY-MM-DDTHH:mm:ssZ"
    const [, dia, mes, ano, hora = '00', minuto = '00', segundo = '00'] = match;
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}Z`; // Z garante UTC
  }

  private formatarData(data: any): string | null {
    if (!data) return null;

    // Corrigir o formato, se necessário
    const dataCorrigida = this.corrigirFormatoData(data);
    if (!dataCorrigida) return null;

    const parsedDate = new Date(dataCorrigida);

    // Verificar se a data é válida
    if (isNaN(parsedDate.getTime())) {
      console.warn('Data inválida após correção:', dataCorrigida);
      return null;
    }

    // Retornar no formato "YYYY-MM-DD"
    return parsedDate.toISOString().split('T')[0];
  }

  public limparItem() {
    this.historicoSaude = null;
    $('#text').css('color', 'none').text('');
  }

  public get buscarId() {
    return this.historicoSaude?.id;
  }
}
