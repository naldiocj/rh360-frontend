import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PlanoDotacaoService } from '@resources/modules/sigv-version2/core/plano/plano-dotacao.service';
import { Select2OptionData } from 'ng-select2';
import { SecureService } from '@core/authentication/secure.service';
import { finalize, from, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateComponent } from '@resources/modules/sigv-version2/core/guards/registar.guard';
import Swal from 'sweetalert2';

import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { PreDespachoService } from '@resources/modules/sigvestuario/core/planos/pre-despacho.service';

@Component({
  selector: 'sigvest-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.css']
})
export class RegistarComponent implements OnInit, CanDeactivateComponent {
  public processoEmAndamento: boolean = false; // Indica se há alterações não salvas
  flagLoading = false; //indica se o componente está a carregar dados
  timeOutId: any; //indica o id do timeout para cancelar o timeout

  public planificacaoForm!: FormGroup;
  public produtosPlanificadosForm!: FormGroup;
  public flagBtnPlanificacaoForm: string = 'block';
  public flagProdutosForm: boolean = false;
  public lastPlanoAdd: string = '0'
  pdfFlag: boolean = true;
  documentoSelecionado!: File;
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_orgao: '',
    pessoafisica: null,
  };

  public tipo_estrutura_organicas: Array<Select2OptionData> = [];
  public direcao_ou_orgao: Array<Select2OptionData> = [];
  
  get usuario_id() {
    return this.secureService.getTokenValueDecode().user?.id;
  }
  
  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
  
  public get orgao_id() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  constructor(
    private planoDotacaoService: PlanoDotacaoService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private router: Router,
    private route: ActivatedRoute,

    private tipo_estrutura_organica_service: TipoEstruturaOrganica,
    private direcao_ou_orgao_service : DirecaoOuOrgaoService,
    private pre_despacho_service: PreDespachoService
  ) { }


  ngOnInit(): void {
    this.validarPlanoDotacaoForm()
    this.buscarTipoEstruturaOrganica();
  }

  onSubmit() {
    if (this.planificacaoForm.invalid) { return; }

    this.flagLoading = true;
    this.processoEmAndamento = false; // Processo concluído

    this.timeOutId = setTimeout(() => {
      this.inserirDadosNaApi(this.planificacaoForm.value)
    }, 3000);
  }

  // Método exigido pelo guarda
  canDeactivate(): Observable<boolean> {
    if (this.processoEmAndamento) {
      return from(
        this.sairDaPagina().then((confirmado) => {
          if (confirmado && this.lastPlanoAdd) {
            this.descartarPlano(this.lastPlanoAdd);
          }
          return confirmado;
        })
      );
    }
    return from(Promise.resolve(true)); // Retorna um `Observable<boolean>` sempre
  }

  validarPlanoDotacaoForm() {
    const regexNumero = /^\d+$/;

    this.planificacaoForm = this.fb.group({
      anexo_plano: ['http://'],
      login_pessoajuridicas_id: this.orgao_id,
      
      pessoajuridica_id: [''],
      ordem_fornecimento: ['', [Validators.required, Validators.pattern(regexNumero)]],
      validade_documento: ['', [Validators.required]],
      local_fornecimento: ['BCA'],
      descricao: [''],
    });

    // Marca processo como "em andamento" se houver alterações no formulário
    this.planificacaoForm.valueChanges.subscribe(() => {
      this.processoEmAndamento = true;
    });
  }

  inserirDadosNaApi(planificacao: any) {
    this.pre_despacho_service.registar(planificacao).subscribe({
      next: (response) => {
        this.processoEmAndamento = true; // Processo concluído
        this.flagProdutosForm = true;
        this.lastPlanoAdd = response.response_id.toString()
      },
      error: (err) => {
        this.flagLoading = false;
        console.log('erro do post sem form data: ' + err);
      },
      complete: () => {
        this.flagLoading = false;
        console.log('completado com sucesso a operação sem post do form data')
      }
    })
  }



  selecionarDocumentoDoFront(event: any) {
    this.documentoSelecionado = event.target.files[0]
    const fileName = this.documentoSelecionado.name;
    const extension = fileName.split('.').pop();
    console.log('É um arquivo', extension);

    const reader = new FileReader();
    this.planificacaoForm.patchValue({
      file: this.documentoSelecionado
    })
    reader.readAsDataURL(this.documentoSelecionado);

    // Faz algo com a extensão, por exemplo:
    if (extension === 'pdf') {
      console.log('É um arquivo PDF', extension);
      //console.log(this.ficheiroService.createImageBlob(this.documentoSelecionado, extension))
    } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
      console.log('É uma imagem');
    }

    this.pdfFlag = false;
    console.log('Imagem:' + this.documentoSelecionado.name)

  }


  public reiniciarFormulario(): void {
    this.planificacaoForm.reset();
    this.pdfFlag = true;
  }

  descartarPlano(id: any) {
    this.planoDotacaoService.eliminar(id).subscribe({
      next: (response) => {
        //this.buscarPlanos();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => {
        this.router.navigate(['/piips/sigv/planificacao/a/listar/']);
      }
    });
  }

  sairDaPagina(): Promise<boolean> {
    return Swal.fire({
      title: "Atenção!",
      html: `Sr(a). <strong>${this.nomeUtilizador}</strong>, Você tem alterações não salvas. Tem certeza de que deseja sair?`,
      icon: "warning",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      confirmButtonText: "Sim, Sair!",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-primary px-2 mr-1",
        cancelButton: "btn btn-danger ms-2 px-2",
      },
    }).then((result: any) => result.isConfirmed);
  }


  limparEstadoProcessamento() {
    //alert('chamou')
    //this.flagLoading = true;
    this.processoEmAndamento = false;
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
      })
        .pipe(
          finalize((): void => {

          })
        )
        .subscribe((response: any): void => {
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
}