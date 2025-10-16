import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup  } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Procedencia-Correpondencia.service';
import { TipoImportanciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Importancia.service';
import { TipoNaturezaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Natureza.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JsBarcode from 'jsbarcode';
import { TipicidadeService } from '@resources/modules/sigdoc/core/service/config/Tipicidade.service';

@Component({
  selector: 'app-tramitar-documento-editar',
  templateUrl: './tramitar-documento-editar.component.html',
  styleUrls: ['./tramitar-documento-editar.component.css'],
})
export class TramitarDocumentoEditarComponent implements OnInit, OnChanges {

  private currentNumber: number = 0;

  isPinVisible = false;
  simpleForm: FormGroup = new FormGroup({})
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();
  @Input() public TramitarDocumento: any = null
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

  public importancias: Array<Select2OptionData> = [];
  public tipoNatureza: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public procedenciaCorrespondencia: Array<Select2OptionData> = [];
  public tipicidade: Array<Select2OptionData> = [];
  public pessoaJuridicas: any = [];
  public departamentos: Array<Select2OptionData> = [];
  public tituloDestino: string = 'Estrutura Orgânica da PNA';

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
    private importanciaService: TipoImportanciaService,
    private tipoNaturezaService: TipoNaturezaService,
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private correspondenciaService: CorrespondenciaService,
    private tipicidadeService: TipicidadeService,
    private iziToast: IziToastService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documento'] && changes['documento'].currentValue !== changes['documento'].previousValue) {
      this.editForm();
     }
     this.criarForm();
     if (this.buscarId()) {
       this.editForm();
     }
    this.buscarImportancia();
    this.buscarProcedenciaCorrespondencia();
    this.buscarTipoNatureza();
    //this.buscarTipoCorrespondencia();
    this.buscarTipoEstruturaOrganica()

    this.simpleForm.get('tipo_natureza_id')?.valueChanges.subscribe((tipoNaturezaId: string) => {
      console.log('Valor selecionado para tipo_natureza_id:', tipoNaturezaId);
      if (tipoNaturezaId === '1' || tipoNaturezaId === '3' || tipoNaturezaId === '5') {
        console.log("teste", tipoNaturezaId)
        this.adicionaPin = true;
      } else {
        this.adicionaPin = false;
      }
    });
  }

  ngOnInit(): void {
  }

  public upload(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
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
      //minha_pessoajuridica_id: this.getOrgaoId, comentei aqui
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
          if (response.length > 0) {
            const primeiroItem = response[0];
            this.procedenciaCorrespondencia = [{
              id: primeiroItem.id,
              text: primeiroItem.nome.toString().toUpperCase(),
            }];
          } else {
            this.procedenciaCorrespondencia = [];
          }
        },
      });
  }
  
  private criarForm() {
    this.simpleForm = this.fb.group({
      entrada_expediente_id: [this.IdTramitarDocumentoClick],
      importancia_id: ['', Validators.required],
      remetente_id: [this.getOrgaoId, Validators.required],
      pessoajuridicas_id: this.fb.array([]),
      procedencia_correspondencia_id: ['', Validators.required],
      pin: [null, Validators.pattern('^[0-9]*$')],
      tipo_orgao: [null, Validators.required],
    });
    this.simpleForm.get('tipo_orgao')?.disable();
  }

  private editForm() {
    if (this.documento) {
      console.log(this.documento);
      this.simpleForm.patchValue({
        entrada_expediente_id: this.documento.entrada_expediente_id,
        importancia_id: this.documento.importancia_id,
        procedencia_correspondencia_id: this.documento.procedencia_correspondencia_id,
        //pin: this.documento.pin,
        remetente_id: this.getOrgaoId,
        tipo_orgao: this.documento.tipo_orgao
      });
    }
  }

  dataDocumentoValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    // Comparar com a data atual (ou com outra data relevante)
    if (selectedDate > currentDate) {
      return { dataInvalida: true };
    }
    return null;
  }

  validatePin(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
    this.simpleForm.get('pin')?.setValue(event.target.value);
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

  buscarId(): number {
    return this.documento?.id;
  }

  public onSubmit(): void {
    this.carregando = true;
    this.simpleForm.value.pessoajuridicas_id = this.agentesSelecionados.map(
      (item: any) => item?.id
    );

    if (this.simpleForm.invalid || this.submitted) return;
    console.log('Valor de pessoajuridica_id:', this.simpleForm.value.pessoajuridicas_id);
    if (!this.simpleForm.value.pessoajuridicas_id.length) {
      this.iziToast.alerta('Sem destino da tramitação do documento selecionada!!!');
      this.carregando = false;
      return;
    }

    this.carregando = true;
    
    this.submitted = true;
    const data = this.getFormData;
    const type = this.buscarId()
      ? this.correspondenciaService.editar(data, this.buscarId())
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
          //this.gerarPDF();
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onEnviarOcorrencia.emit({ enviar: true });
        },
      });
  }

  private get getFormData() {
    const formData = new FormData();
    formData.append('entrada_expediente_id', this.simpleForm.get('entrada_expediente_id')?.value);
    formData.append('importancia_id', this.simpleForm.get('importancia_id')?.value);
    formData.append('procedencia_correspondencia_id', this.simpleForm.get('procedencia_correspondencia_id')?.value);
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value);
    formData.append('pessoajuridicas_id', this.simpleForm.value.pessoajuridicas_id);
    formData.append('pin', this.simpleForm.get('pin')?.value);
    return formData;
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
      this.simpleForm.get('tipo_orgao')?.enable();
      this.simpleForm.get('tipo_orgao')?.setValue(null);
      this.tituloDestino = 'Comando Provincial/Orgão';
      this.buscarDirecaoOrgao();
    } else if ($event == 2) {
      this.filtro.pessoafisica = this.getOrgaoId;
      this.filtro.tipo_estrutura_sigla = '';
      this.simpleForm.get('tipo_orgao')?.disable();
      this.simpleForm.get('tipo_orgao')?.setValue(null);
      this.tituloDestino = 'Departamento';
      this.buscarDirecaoOrgao();
    } else {
      return;
    }
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

  public handlerAdicionarPIN(evt: any) {
    if (evt.target.checked) {
      this.adicionaPin = true;
      this.simpleForm.get('pin')?.setValidators(this.formValidalitors);
      this.simpleForm.get('pin')?.updateValueAndValidity();
    } else {
      this.adicionaPin = false;
      this.simpleForm.get('pin')?.setValue(null);
      this.simpleForm.get('pin')?.setValidators(null);
      this.simpleForm.get('pin')?.updateValueAndValidity();
    }
    this.simpleForm.patchValue({
      anexado: evt.target.checked as boolean,
    });
  }

  get IdTramitarDocumentoClick() {
    return this.TramitarDocumento?.id
  }

  setTramitarDocumentos(item: any) {
    this.TramitarDocumento = item
    console.log('Teste', this.TramitarDocumento)
  }
}
