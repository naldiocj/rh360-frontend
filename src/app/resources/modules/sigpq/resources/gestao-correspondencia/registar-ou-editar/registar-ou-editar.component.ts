import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { CorrespondenciaService } from '@resources/modules/sigpq/core/service/Corrrespondencia.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigpq/core/service/config/Procedencia-Correpondencia.service';
import { TipoCorrespondenciaService } from '@resources/modules/sigpq/core/service/config/Tipo-Correspondencia.service';
import { TipoImportanciaService } from '@resources/modules/sigpq/core/service/config/Tipo-Importancia.service';
import { TipoNaturezaService } from '@resources/modules/sigpq/core/service/config/Tipo-Natureza.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-ocorrencia-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {
  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public correspondencia: any;
  @Output() public onEnviarOcorrencia: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;

  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

  public importancias: Array<Select2OptionData> = [];
  public tipoNatureza: Array<Select2OptionData> = [];
  public procedenciaCorrespondencia: Array<Select2OptionData> = [];
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public pessoaJuridicas: any = [];
  public departamentos: Array<Select2OptionData> = [];

  public submitted: boolean = false;

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
  };

  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private secureService: SecureService,
    private importanciaService: TipoImportanciaService,
    private tipoNaturezaService: TipoNaturezaService,
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private tipoCorrespondenciaService: TipoCorrespondenciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private correspondenciaService: CorrespondenciaService,
    private iziToast: IziToastService,
    private estruturaOrganicaServico: TipoEstruturaOrganica

  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  ngOnInit(): void {
    this.criarForm();
    this.buscarImportancia();
    this.buscarProcedenciaCorrespondencia();
    this.buscarTipoNatureza();
    this.buscarTipoCorrespondencia();
    this.buscarTipoEstruturaOrganica()
    // this.buscarDirecaoOrgao()
  }
  public upload(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    // this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
       
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }

  validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.agentesSelecionados.find(
      (o: any) => o.id == id
    );
    if (numeroUmExiste) return true;
    return false;
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.agentesSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.agentesSelecionados = Array.from(conjuntoUnico);
  }

  buscarDirecaoOrgao() {
    // this.isLoading = true;
    const options = {
      ...this.filtro,
      minha_pessoajuridica_id: this.getOrgaoId,
    };
    this.direcaoOuOrgaoService
      .listarTodos(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        this.pessoaJuridicas = response.data;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.pessoafisica = null;
    this.buscarDirecaoOrgao();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarDirecaoOrgao();
  }

  private buscarImportancia() {
    this.importanciaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.importancias = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }
  private buscarTipoNatureza() {
    this.tipoNaturezaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoNatureza = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }
  private buscarProcedenciaCorrespondencia() {
    this.procedenciaCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.procedenciaCorrespondencia = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }
  private buscarTipoCorrespondencia() {
    this.tipoCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoCorrespondencia = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }

  // private preenchaForm(correspondencia: any) {
  //   this.simpleForm.patchValue({
  //     documento: correspondencia.documento,
  //   })
  // }

  private criarForm() {
    this.simpleForm = this.fb.group({
      assunto: [null],
      nota: [null, Validators.required],
      tipo_natureza_id: ['', Validators.required],
      procedencia_correspondencia_id: ['', Validators.required],
      importancia_id: ['', Validators.required],
      tipo_correspondencia_id: ['', Validators.required],
      anexo: [null, Validators.required],
      remetente_id: [this.getOrgaoId, Validators.required],
      pessoajuridicas_id: this.fb.array([]),
      numero_oficio: [null, Validators.required],
      tipo_orgao: [null],
    });

    this.simpleForm.get('tipo_orgao')?.disable();
  }

  public onSubmit(): void {
    this.carregando = true;

    this.simpleForm.value.pessoajuridicas_id = this.agentesSelecionados.map(
      (item: any) => item
    );

    if (this.simpleForm.invalid || this.submitted) return;

    if (!this.simpleForm.value.pessoajuridicas_id.length) {
      this.iziToast.alerta('Sem destino da correspondência selecionado.');
      return;
    }

    this.carregando = true;
    this.submitted = true;

    const data = this.getFormData;

    const type = this.getId
      ? this.correspondenciaService.editar(this.getId, data)
      : this.correspondenciaService.registar(data);

    type
      .pipe(
        finalize((): void => {
          this.carregando = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onEnviarOcorrencia.emit({ enviar: true });
        },
      });

    // console.log(this.getFormData.get('pessoajuridicas_id'))
  }

  private get getFormData() {
    const formData = new FormData();
    formData.append(
      'assunto',
      String(this.simpleForm.get('assunto')?.value).trim()
    );
    formData.append('nota', String(this.simpleForm.get('nota')?.value).trim());
    formData.append(
      'tipo_natureza_id',
      this.simpleForm.get('tipo_natureza_id')?.value
    );
    formData.append(
      'procedencia_correspondencia_id',
      this.simpleForm.get('procedencia_correspondencia_id')?.value
    );
    formData.append(
      'tipo_correspondencia_id',
      this.simpleForm.get('tipo_correspondencia_id')?.value
    );
    formData.append(
      'importancia_id',
      this.simpleForm.get('importancia_id')?.value
    );
    formData.append('anexo', this.simpleForm.get('anexo')?.value);
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value);
    formData.append(
      'pessoajuridicas_id',
      this.simpleForm.value.pessoajuridicas_id
    );
    formData.append(
      'numero_oficio',
      this.simpleForm.get('numero_oficio')?.value
    );

    return formData;
  }

  public get getId() {
    return this.id;
  }
  public get getCorrespondenciaId() {
    return this.correspondencia?.id;
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
    $('input-file').val('');
    this.simpleForm.patchValue({
      remetente_id: this.getOrgaoId,
    });

    this.reiniciarCheckBoxs();

    $('#file-anexo').val('');
  }

  private reiniciarCheckBoxs() {
    this.agentesSelecionados = [];
    this.pessoaJuridicas = [];
    const checkBoxs: Array<HTMLInputElement> = Array.from(
      document.querySelectorAll('input[type=checkbox]')
    ) as Array<HTMLInputElement>;
    if (!checkBoxs) return;

    checkBoxs.forEach((item: HTMLInputElement) => {
      item.checked = false;
    });
  }

  public selecionarOrgaoOuComandoProvincial($event: any): void {

    this.filtro.tipo_estrutura_sigla = $event
    this.buscarDirecaoOrgao();
  }
  public selecionarProcedencia($event: any): void {
    if ($event == 1) {
      this.filtro.pessoafisica = this.getOrgaoId;
      this.filtro.tipo_estrutura_sigla = '';
      this.simpleForm.get('tipo_orgao')?.disable();
      this.simpleForm.get('tipo_orgao')?.setValue(null);
      this.buscarDirecaoOrgao();
    } else if ($event == 2) {
      this.filtro.pessoafisica = null;
      this.filtro.tipo_estrutura_sigla = 'UC';
      this.simpleForm.get('tipo_orgao')?.enable();
      this.simpleForm.get('tipo_orgao')?.setValue(null);
      this.buscarDirecaoOrgao();
    } else {
      return;
    }
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
