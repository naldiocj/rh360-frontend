import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { FuncionarioOrgaoService } from '@core/services/Funcionario-orgao.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Procedencia-Correpondencia.service';
import { UtilService } from '@resources/modules/sigdoc/core/utils/util.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { TratamentoDepartamentoService } from '@resources/modules/sigdoc/core/service/Tratamento-departamento.service';

enum TipoProcedencia {
  EXTERNA = 1,
  INTERNA = 2,
}
@Component({
  selector: 'app-sigpq-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {
  @Input() correspondencia: any = null;
  @Input() tratamentoId: any;
  @Output() onRegistarEditar!: EventEmitter<any>
  public simpleForm: any;
  public isLoading: boolean = false;
  //public adicionaDocumento: boolean = false;
  public tipoTratamento: any;
  public isPendente: boolean = true;
  private formValidalitors = [Validators.required];
  public haProcedencia: boolean = false;
  public procedenciaExterna: boolean = false;
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public funcionario: Array<Select2OptionData> = [];
  public tituloDestino: string = 'Estrutura Orgânica da PNA';
  public isDespacho: boolean = false;

  public procedenciaCorrespondencia: Array<Select2OptionData> = [];

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  public tipoTratamentos: Array<Select2OptionData> = [
    //vou fazer aqui mostrar o estado do tratamento consoante a a cor//
    {
      id: 'R',
      text: 'Recebido',
    },
    {
      id: 'ET',
      text: 'Em Tratamento',
    },
    /*{
      id: 'E',
      text: 'Expedido',
    },*/
    { id: 'P', 
      text: 'Pendente' 
    },
    /*{ id: 'D', 
      text: 'Despacho' 
    },
    {
      id: 'S',
      text: 'Saído',
    },*/

    {
      id: 'PR',
      text: 'Pronunciamento',
    },
    {
      id: 'PA',
      text: 'Parecer',
    },
  ];

  public options = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };
  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private tratamentoDepartamentoService: TratamentoDepartamentoService,
    private utilService: UtilService,
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private funcionarioOrgaoService: FuncionarioOrgaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica
  ) {

    this.onRegistarEditar = new EventEmitter<any>()
  }

  ngOnInit(): void {
    // this.criarForm();
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        console.log(response)
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['correspondencia'].previousValue !=
      changes['correspondencia'].currentValue
    ) {
      this.criarForm();
    }
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

  private criarForm() {
    this.simpleForm = this.fb.group({
      pessoajuridica_id: [this.getOrgaoId, Validators.required],
      sigdoc_departamento_id: [
        this.getCorrespondenciaId,
        Validators.required,
      ],
      anexado: [false],
      nota: [null,],
      anexo: ['', [Validators.required, this.fileValidator]],
      estado: ['', Validators.required],
      procedencia_correspondencia_id: [''],
      tipo_orgao: [null],
      pessoajuridica_destino_id: [''],
      pessoafisica_destino_id: [''],
    });

    this.simpleForm.get('tipo_orgao')?.disable();
  }

    private fileValidator(control: AbstractControl): {[key: string]: any} | null {
      const file = control.value;
      if (!file) {
        return { 'required': true };
      }
      return null;
    }

  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public onSubmit() {
    
    if (!this.simpleForm.get('anexo')?.value) {
      alert('Por favor, anexe um documento');
      return;
    }
    
    if (this.simpleForm.invalid || this.isLoading) return;

    const formData: any = this.dataForm;
    const type = this.getId
      ? this.tratamentoDepartamentoService.editar(formData, this.getId)
      : this.tratamentoDepartamentoService.registar(formData);

    type
      .pipe(
        finalize((): void => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.onRegistarEditar.emit({ registo: true })
          this.fecharModal();
          this.reiniciarFormulario();
        },
      });
  }

  public get dataForm() {
    const data = new FormData();
    data.append(
      'pessoajuridica_id',
      this.simpleForm.get('pessoajuridica_id')?.value
    );
    data.append('nota', String(this.simpleForm.get('nota')?.value).trim());
    data.append('anexo', this.simpleForm.get('anexo')?.value);
    data.append('estado', this.simpleForm.get('estado')?.value);
    data.append(
      'sigdoc_departamento_id',
      this.simpleForm.get('sigdoc_departamento_id')?.value
    );
    //data.append('anexado', this.simpleForm.get('anexado')?.value);
    data.append(
      'procedencia_correspondencia_id',
      this.simpleForm.get('procedencia_correspondencia_id')?.value
    );
    data.append(
      'pessoajuridica_destino_id',
      this.simpleForm.get('pessoajuridica_destino_id')?.value
    );
    data.append(
      'pessoafisica_destino_id',
      this.simpleForm.get('pessoafisica_destino_id')?.value
    );
    return data;
  }
  public reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoajuridica_id: this.getOrgaoId,
      sigdoc_departamento_id: this.getCorrespondenciaId,
    });
    $('file-anexo').val('');
    //this.adicionaDocumento = false;
    this.uncheckedDocumento();
    this.reiniciarTodoFormulario();
  }

  private fecharModal() {
    this.modalService.fechar('close-modal');
  }
  public get getCorrespondenciaId() {
    return this.correspondencia?.id as number;
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get minhaCorrespondencia() {
    return this.getOrgaoId == this.correspondencia?.pessoajuridica_id;
  }

  public get getId() {
    return this.tratamentoId;
  }

  /*public handlerAdicionarDocumento(evt: any) {
    if (evt.target.checked) {
      this.adicionaDocumento = true;
      this.simpleForm.get('anexo')?.setValidators(this.formValidalitors);
      this.simpleForm.get('anexo')?.updateValueAndValidity();
    } else {
      this.adicionaDocumento = false;
      this.simpleForm.get('anexo')?.setValue(null);
      this.simpleForm.get('anexo')?.setValidators(null);
      this.simpleForm.get('anexo')?.updateValueAndValidity();
    }

    this.simpleForm.patchValue({
      anexado: evt.target.checked as boolean,
    });
  }*/

  private uncheckedDocumento() {
    const input: HTMLInputElement = document.querySelector(
      `#checkbox`
    ) as HTMLInputElement;

    if (!input) return;

    input.checked = false;
  }
  public handlerTipoTratamento = (evt: any) => {
    if (evt.value === 1) { // Verifique se o valor selecionado é "Recebido"
      this.simpleForm.get('nota')?.setValue('Recebido');
    }
    //this.isPendente = this.utilService.tratamentoPedente(evt);
    //this.isDespacho = this.utilService.tratamentoDespacho(evt)

    this.tipoTratamento = this.tipoTratamentos.filter(
      (item: any) => item.id == evt
    );
    this.tipoTratamento = this.utilService.tratamentoComposto(
      this.tipoTratamento[0].text
    )?.nome;

    if (!this.isPendente) {
      this.simpleForm
        .get('procedencia_correspondencia_id')
        ?.setValidators(this.formValidalitors);
      this.simpleForm
        .get('procedencia_correspondencia_id')
        ?.updateValueAndValidity();

      this.buscarProcedenciaCorrespondencia();
    } else {
      this.reiniciarTodoFormulario();
    }
  };

  public get getPendente(): boolean {
    return this.isPendente;
  }

  public handlerProcedenciaTratamentoCorrespondencia($event: any) {
    if (!$event) return;
    this.procedenciaExterna = $event == TipoProcedencia.EXTERNA;
    this.haProcedencia =
      $event == TipoProcedencia.EXTERNA || $event == TipoProcedencia.INTERNA;
    if (!this.procedenciaExterna) {
      const opcoes = {
        pessoafisica: this.getOrgaoId,
      };
      this.tituloDestino = 'Departamento/Representante';
      this.buscarDirecaoOrgao(opcoes);
      this.buscarFuncionario({ pessoajuridica_id: this.getOrgaoId });
      this.simpleForm.get('tipo_orgao')?.setValue('');
      this.simpleForm.get('tipo_orgao')?.disable();
    } else {
      this.buscarTipoEstruturaOrganica()
      this.simpleForm.get('tipo_orgao')?.enable();
      this.tituloDestino = '';
    }

    this.setOrgaObrigatorio(this.formValidalitors);
  }

  private setOrgaObrigatorio(obrigatoriedade: any) {
    this.simpleForm
      .get('pessoajuridica_destino_id')
      ?.setValidators(obrigatoriedade);
  }
  public selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;

    const opcoes = {
      tipo_estrutura_sigla: $event,
    };
    this.tituloDestino = this.tipoEstruturaOrganicas.filter((item:any)=>item.id.toString().toLowerCase().includes($event.toString().toLowerCase()))[0]?.text;

    this.buscarDirecaoOrgao(opcoes);
  }

  public buscarDirecaoOrgao(opcoes: any) {
    const options = {
      ...opcoes,
      minha_pessoajuridica_id: this.getOrgaoId,
    };
    this.direcaoOuOrgaoService
      .listarTodos(options)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }

  public handlerDirecaoOrgao($event: any) {
    if (!$event) return;

    this.buscarFuncionario({ pessoajuridica_id: $event });
  }
  private buscarFuncionario(opcoes: any) {
    this.funcionarioOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe({
        next: (response: any) => {
          this.funcionario = response.map((item: any) => ({
            id: item.id,
            text: `${item?.patente_nome} - ${item?.nip} - ${item?.nome_completo
              ?.toString()
              .toUpperCase()} ${item?.apelido?.toString().toUpperCase()}`,
          }));
        },
      });
  }

  private reiniciarTodoFormulario() {
    this.isPendente = true;
    this.procedenciaExterna = false;
    this.funcionario = [];
    this.direcaoOuOrgao = [];
    this.procedenciaCorrespondencia = [];
    this.simpleForm.get('anexo')?.setValue(null);
    this.simpleForm.get('anexo')?.setValidators(null);
    this.simpleForm.get('anexo')?.updateValueAndValidity();
    this.setOrgaObrigatorio(null);
    this.simpleForm?.get('procedencia_correspondencia_id')?.setValidators(null);
    this.simpleForm
      .get('procedencia_correspondencia_id')
      ?.updateValueAndValidity();
  }
}
