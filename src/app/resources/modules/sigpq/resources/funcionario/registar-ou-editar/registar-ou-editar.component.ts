import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { Select2OptionData } from 'ng-select2';
import { AppConfig } from 'app/config/app.config';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',

  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {
  @ViewChild('btns', { static: true }) public btns!: ElementRef;

  public fotoCivil: any = null;
  public fotoEfectivo: any = null;

  simpleForm: any;

  isLoading: boolean = false;
  submitted: boolean = false;

  tabCount: number = 0;

  formErrors: any;

  public situacao: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'actual', text: 'Função actual' },
    { id: 'exercida', text: 'Função exercída' },
  ];

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  tituloPrincipal =
    AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp =
    AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  logoH = AppConfig.logoH; /* Ex: LOGOTIPO DE HEADER */
  imgUser = AppConfig.imgUser; /* Ex: Imagem user */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */
  useGradient = AppConfig.useGradient; /* Ex: COR DO GRADIENTE */
  colorPainel = AppConfig.colorPainel; /* Ex: COR DO PAINEL */

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private funcionarioService: FuncionarioService,
    private router: Router,
    private fb: FormBuilder // Adicionado FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializar o formulário com o campo sigpq_vinculo_id obrigatório
    this.simpleForm = this.fb.group({
      sigpq_vinculo_id: [null, Validators.required],
      // Adicione outros campos necessários aqui
    });
    if (this.getId) {
      const a = window.btoa(unescape(encodeURIComponent(this.getId)));
    }
  }

  get getParams(): any {
    return {
      getId: this.getId,
      getInfo: this.getInfo,
    };
  }

  public get getId() {
    return this.activatedRoute.snapshot.params['id'] as number;
  }

  public get getInfo() {
    return this.activatedRoute.snapshot.params['info'] as number;
  }

  public valueChanged(event: any) {
    console.log('value changed: ' + event);
  }

  public modelChanged(event: string) {
    console.log('model changed: ' + event);
  }

  proximo() {
    this.tabCount = this.tabCount + 1;
  }

  anterior() {
    this.tabCount = this.tabCount - 1;
  }

  alterarPasso(posicao: number) {
    this.tabCount = posicao;
  }

  // public get maisInformacao(): boolean {
  //   return this.getParams?.getInfo ? true : false
  // }

  public get maisInformacao(): boolean {
    if (
      this.getParams?.getInfo != null &&
      this.getParams?.getInfo !== undefined
    ) {
      return false;
    }

    return isNaN(this.getParams?.getId) ||
      this.getParams?.getId === '' ||
      this.getParams?.getId === null ||
      this.getParams?.getId === 'undefined'
      ? true
      : false;
  }

  private get role() {
    return this.authService?.role?.name?.toString().toLowerCase();
  }
  public get isAdmin() {
    return ['admin', 'root'].includes(this.role);
  }

  public onSubmit() {
    console.log('Dados do formulário enviados:', this.simpleForm.value);
    this.submitted = true;
    this.isLoading = true;

    // Validação extra para o campo órgão/destino
    const orgaoDestino = this.simpleForm.get('orgao_destino_id')?.value;
    if (
      !orgaoDestino ||
      (typeof orgaoDestino === 'object' && !orgaoDestino.id)
    ) {
      alert('Selecione uma Direção/Órgão válida!');
      this.isLoading = false;
      return;
    }

    if (this.simpleForm && this.simpleForm.valid) {
      this.funcionarioService.registar(this.simpleForm).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          alert('Funcionário registrado com sucesso!');
          // Limpar o formulário
          if (this.simpleForm.reset) {
            this.simpleForm.reset();
          }
          // Redirecionar para a lista de funcionários (ajuste a rota conforme necessário)
          this.router.navigate(['/sigpq/funcionarios']);
        },
        error: (err: any) => {
          this.isLoading = false;
          alert('Erro ao registrar funcionário!');
        },
      });
    } else {
      this.isLoading = false;
      alert('Preencha todos os campos obrigatórios!');
    }
  }
}
