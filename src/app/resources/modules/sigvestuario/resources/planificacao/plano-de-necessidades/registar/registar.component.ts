import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PlanoDeNecessidadesService } from '@resources/modules/sigvestuario/core/planos/plano-de-necessidades.service';
import { Select2OptionData } from 'ng-select2';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable, from } from 'rxjs';
import { CanDeactivateComponent } from '@resources/modules/sigv-version2/core/guards/registar.guard';
import Swal from 'sweetalert2';

@Component({
  selector: 'sigvest-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.css']
})
export class RegistarComponent implements OnInit , CanDeactivateComponent {
  public processoEmAndamento: boolean = false; // Indica se há alterações não salvas
  flagLoading = false; //indica se o componente está a carregar dados
  timeOutId: any; //indica o id do timeout para cancelar o timeout
  @Input() public params: any

  public planificacaoForm!: FormGroup;
  public flagBtnPlanificacaoForm: string = 'block';
  public flagProdutosForm: boolean = false;
  public lastPlanoAdd: string = '0'
  public produto_detalhe: any;
  pdfFlag: boolean = true;
  documentoSelecionado!: File;
  public tipoPlano: Array<Select2OptionData> = [];

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  get usuario_id() {
    return this.secureService.getTokenValueDecode().user?.id;
  }

  get orgao_id() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
  
  constructor(
    private planos_de_necessidades_service: PlanoDeNecessidadesService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.validarPlanificacaoForm()
  }
  
  public validarPlanificacaoForm():void {
    this.planificacaoForm = this.fb.group({
      ano_referencia_plano: [2025],
      obs_planos: [''],
      anexo_plano: ['http://'],
      pessoajuridica_id: [this.orgao_id], // departamento ou órgão receptor
      login_pessoajuridicas_id: [this.orgao_id],
      descricao: ['', Validators.required]
    });

    // Marca processo como "em andamento" se houver alterações no formulário
    this.planificacaoForm.valueChanges.subscribe(() => {
      this.processoEmAndamento = true;
    });
  }

  onSubmit() {
    if (this.planificacaoForm.invalid) { 
      return; 
    }

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


  private async inserirDadosNaApi(planificacao: any) {
    await this.planos_de_necessidades_service.registar(planificacao).subscribe({
      next: (response) => {
        this.processoEmAndamento = true; // Processo concluído
        this.flagProdutosForm = true;
        this.lastPlanoAdd = response.response_id.toString()
        console.log(response);
      },
      error: (err) => {
        console.log('erro do post sem form data: ' + err);
        this.flagLoading = false;
      },
      complete: () => {
        console.log('completado com sucesso a operação sem post do form data')
        this.flagLoading = false;
      }
    })
  }

  public buscarDetalheProdutos(item: any) {
    this.produto_detalhe = item;
  }
  
  public reiniciarFormulario(): void {
    this.planificacaoForm.reset();
    this.pdfFlag = true;
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

  descartarPlano(id: any) {
    this.planos_de_necessidades_service.eliminar(id).subscribe({
      next: (response) => {
        //this.buscarPlanos();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => {
        this.router.navigate(['/piips/sigvest/planificacao/plano-de-necessidades/listar/']);
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
        confirmButton: "btn btn-danger px-2 mr-1",
        cancelButton: "btn btn-primary ms-2 px-2",
      },
    }).then((result: any) => result.isConfirmed);
  }

  limparEstadoProcessamento() {
    this.flagLoading = true;
    this.processoEmAndamento = false;
  }
}