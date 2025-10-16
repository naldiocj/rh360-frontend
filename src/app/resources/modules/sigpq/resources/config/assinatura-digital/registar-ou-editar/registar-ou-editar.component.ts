import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioOrgaoService } from '@core/services/Funcionario-orgao.service';
import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { AssinaturaDigitalService } from '@resources/modules/sigpq/core/service/Assinatura-Digital.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import SignaturePad from 'signature_pad'

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, AfterViewInit, OnChanges {


  @Input() tratamentoId: any;
  @Output() onRegistarEditar!: EventEmitter<any>
  public simpleForm: any;
  public isLoading: boolean = false;
  public assinado: boolean = false
  public padAssinatura!: SignaturePad;
  @Input() public assinatura: any = null

  @ViewChild('canvas') public canvasEl!: ElementRef;
  public assinaturaImg!: string;

  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public funcionarios: Array<Select2OptionData> = [];
  public tituloDestino: string = 'Estrutura Orgânica da PNA';
  public isDespacho: boolean = false;
  public procedenciaCorrespondencia: Array<Select2OptionData> = [];

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];


  public options = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };

  ngAfterViewInit() {
    this.padAssinatura = new SignaturePad(this.canvasEl.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assinatura'].previousValue != changes['assinatura'].currentValue) {
      this.preenchaForm(this.assinatura)
    }
  }

  private preenchaForm(data: any) {
    this.selecionarOrgaoOuComandoProvincial(data.tipo_estrutura_organica_sigla)
    this.verFoto(data?.assinatura)
    this.simpleForm.patchValue({
      pessoajuridica_id: data.pessoajuridica_id,
      pessoafisica_id: data.pessoafisica_id,
      assinatura: data.assinatura,
      tipo_orgao: data.tipo_estrutura_organica_sigla
    })
  }

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private utilService: UtilService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private funcionarioOrgaoService: FuncionarioOrgaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private assinaturaDigitalService: AssinaturaDigitalService,
    private ficheiroService: FicheiroService,
  ) {

    this.onRegistarEditar = new EventEmitter<any>()
  }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
    this.criarForm();
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


  private criarForm() {
    this.simpleForm = this.fb.group({
      pessoajuridica_id: [null, Validators.required],
      pessoafisica_id: [null, Validators.required],
      assinatura: [null, Validators.required],
      tipo_orgao: [null]
    });
  }

  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public onSubmit() {
    if (this.simpleForm.invalid || this.isLoading) return;

    const formData: any = this.dataForm;

    const type = this.getId
      ? this.assinaturaDigitalService.editar(formData, this.getId)
      : this.assinaturaDigitalService.registar(formData);

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
    data.append('pessoajuridica_id', this.simpleForm.get('pessoajuridica_id')?.value)
    data.append('pessoafisica_id', this.simpleForm.get('pessoafisica_id')?.value)
    data.append('assinatura', this.simpleForm.get('assinatura')?.value)


    return data;
  }
  public reiniciarFormulario() {
    this.simpleForm.reset();
    this.limparAssinatura()
  }

  private fecharModal() {
    this.modalService.fechar('close-modal');
  }

  public get getId() {
    return this.assinatura?.id
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }


  public selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;
    const options = {
      tipo_estrutura_sigla: $event,
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
          this.funcionarios = response.map((item: any) => ({
            id: item.id,
            text: `${item?.patente_nome} - ${item?.nip ?? ''} - ${item?.nome_completo
              ?.toString()
              .toUpperCase()} ${item?.apelido?.toString().toUpperCase()}`,
          }));
        },
      });
  }



  public salvarAssinatura() {
    const data = this.padAssinatura.toDataURL();
    this.assinaturaImg = data;

    const blob = this.download(data, "image/png");

    const file: File | Blob = new File([blob], "image.png", { type: "image/png" });

    this.simpleForm.get('assinatura')?.setValue(file)
    this.simpleForm.get('assinatura')?.updateValueAndValidity()


    this.assinado = this.temAssinatura;
    if (!this.temAssinatura) {
      this.assinado = false;
    }

  }


  public download(data: any, type: any) {
    data = data.replace(`data:${type};base64,`, "");
    const base64 = new Uint8Array(
      atob(data)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const blob = new Blob([base64], { type: type });

    return blob;
  }

  public limparAssinatura() {
    this.padAssinatura.clear();
    this.assinaturaImg = ''
    this.simpleForm.get('assinatura')?.setValue(null)
    this.simpleForm.get('assinatura')?.updateValueAndValidity()
  }

  public get temAssinatura() {
    return this.padAssinatura?.isEmpty();
  }

  verFoto(urlAgente: any): boolean | void {



    if (!urlAgente) return false;

    const opcoes = {
      pessoaId: this.assinatura?.pessoafisica_id,
      url: urlAgente,
    };


    this.isLoading = true;

    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(async (file) => {

        this.assinaturaImg = await this.ficheiroService.convertFileToBinary(file, "image/png")
      });

  }

}
