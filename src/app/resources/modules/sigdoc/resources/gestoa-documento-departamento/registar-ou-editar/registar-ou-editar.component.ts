import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup  } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Procedencia-Correpondencia.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';
import { SeccaoService } from '@resources/modules/sigdoc/core/service/seccao.service';

@Component({
  selector: 'app-sigdoc-enviar-seccao-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {

  isPinVisible = false;
  //public simpleForm: any;
  simpleForm: FormGroup = new FormGroup({})
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();
  @Input() public EnviarSeccao: any = null
  @Input() public documento: any = null
  public documentos: any = null
  @Input() public correspondencia: any;
  @Output() public onEnviarOcorrencia: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;

  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

  public enviardocumento: Array<Select2OptionData> = [];
  public procedenciaCorrespondencia: Array<Select2OptionData> = [];
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public pessoaJuridicas: any = [];
  public departamentos: Array<Select2OptionData> = [];
  public tituloDestino: string = 'Departamentos';

  public submitted: boolean = false;

  public adicionaPin: boolean = false;
  private formValidalitors = [Validators.required];

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
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private correspondenciaService: CorrespondenciaService,
    private seccaoService: SeccaoService,
    private iziToast: IziToastService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  ngOnChanges(): void {
    this.criarForm();
    this.buscarProcedenciaCorrespondencia();
    this.buscarTipoEstruturaOrganica()
  }

  ngOnInit(): void {
    //this.buscarDirecaoOrgao()
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

  todosSelecionados() {
    const numeroUmExiste = this.pessoaJuridicas.every((item: any) => this.agentesSelecionados.some((o: any) => o.id === item.id));

    if (numeroUmExiste) return true;
    return false;
    
  }

  selecionarTodos(event: any) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
        this.pessoaJuridicas.forEach((item: any) => this.selecionarAgenteParaMobilidade(item));
    } else {
      this.agentesSelecionados = []
    }
    
    console.log('Selecionar Todos - Checkbox Marcado:', isChecked);
    console.log('Agentes Selecionados:', this.agentesSelecionados);
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

    console.log(this.agentesSelecionados)
  }

  buscarDirecaoOrgao() {
    const options = {
      ...this.filtro,
      minha_pessoajuridica_id: this.getDepartamentoId,
    };
    this.direcaoOuOrgaoService
      .listarTodos(options)
      .pipe(
        finalize(() => {
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

  buscarProcedenciaCorrespondencia() {
    this.procedenciaCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.procedenciaCorrespondencia = response
            .filter((item: any) => item.nome.toString().toUpperCase() === 'SECÇÃO')
            .map((item: any) => ({
              id: item.id,
              text: item.nome.toString().toUpperCase(),
            }));
        },
      });
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      departamento_id: [this.idDocumentoClick],
      nota: [null, Validators.required],
      tempoResposta: [null, Validators.pattern('^[0-9]*$')],
      //procedencia_correspondencia_id: ['', Validators.required],
      procedencia_correspondencia_id: [null] ,
      remetente_id: [this.getDepartamentoId, Validators.required],
      pessoajuridicas_id: this.fb.array([]),
    });
  }

  buscarDocumento(idDocumento: number) {

    this.correspondenciaService.buscarUm(idDocumento).pipe(
      finalize(() => {

      })
    ).subscribe((response) => {
    console.log(response)
      this.documentos = response
    });
  }

  get idDocumento() {
    return this.documento?.id
  }

  public get getId() {
    return this.id;
  }
  public get getCorrespondenciaId() {
    return this.correspondencia?.id;
  }

  get idDocumentoClick() {
    return this.EnviarSeccao?.id
  }

  public onSubmit(): void {
    this.carregando = true;

    this.simpleForm.value.pessoajuridicas_id = this.agentesSelecionados.map(
      (item: any) => item?.id
    );

    if (this.simpleForm.invalid || this.submitted) return;
    console.log('Valor de pessoajuridica_id:', this.simpleForm.value.pessoajuridicas_id);
    if (!this.simpleForm.value.pessoajuridicas_id.length) {
      this.iziToast.alerta('Sem destinatário do ddocumento selecionado.');
      return;
    }

    this.carregando = true;
    this.submitted = true;
    const data = this.getFormData;
    const type = this.documento
      ? this.seccaoService.editar(data, this.documento.id)
      : this.seccaoService.registar(data);
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
  }

  private get getFormData() {
    const formData = new FormData();
    formData.append('departamento_id', this.simpleForm.get('departamento_id')?.value);
    formData.append('nota', this.simpleForm.get('nota')?.value);
    formData.append('procedencia_correspondencia_id', this.simpleForm.get('procedencia_correspondencia_id')?.value);
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value);
    formData.append('pessoajuridicas_id', this.simpleForm.value.pessoajuridicas_id);
    formData.append('tempoResposta', this.simpleForm.get('tempoResposta')?.value);
    return formData;
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
    $('input-file').val('');
    this.simpleForm.patchValue({
      remetente_id: this.getDepartamentoId,
    });

    this.reiniciarCheckBoxs();

    $('#file-anexo').val('');
    this.adicionaPin = false;
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
      this.filtro.pessoafisica = null;
      this.filtro.tipo_estrutura_sigla = 'UC';
      this.tituloDestino = 'Comando Provincial/Orgão';
      this.buscarDirecaoOrgao();
    } else if ($event == 2) {
      this.filtro.pessoafisica = this.getDepartamentoId;
      this.filtro.tipo_estrutura_sigla = '';
      this.tituloDestino = 'Departamento';
      this.buscarDirecaoOrgao();
    } else if ($event == 3) {
      this.filtro.pessoafisica = this.getDepartamentoId;
      this.filtro.tipo_estrutura_sigla = '';
      this.tituloDestino = 'Secção';
      this.buscarDirecaoOrgao();
    } else {
      return;
    }
  }

  public get getDepartamentoId() {
    return this.secureService.getTokenValueDecode()?.orgao_detalhes?.sigpq_tipo_departamento.id;
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get getOrgaoSigla() {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }

  ngOnDestroy() {
    this.simpleForm.reset()
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  setEnviarSeccao(item: any) {
    this.EnviarSeccao = item
    console.log(item)
  }
}
