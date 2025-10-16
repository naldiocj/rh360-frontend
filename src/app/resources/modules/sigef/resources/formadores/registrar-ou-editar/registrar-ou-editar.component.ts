import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { CursosService } from '@resources/modules/sigef/core/service/cursos.service';
import { EspecialidadeService } from '@resources/modules/sigef/core/service/especialidade.service';
import { FormadoresService } from '@resources/modules/sigef/core/service/formadores.service';
import { InstituicoesService } from '@resources/modules/sigef/core/service/instituicoes.service';
import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css']
})
export class RegistrarOuEditarComponent implements OnInit {
  public direcaoOuOrgao: Array<Select2OptionData> = [];

  isLoading: boolean = false;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }
  simpleForm!: FormGroup

  patentes: any = []
  grauAcademico: any = []
  especialidades: any = []
  instituicoes: any = []
  cursos: any = []
  funcionarios: any = []

  clone_funcionarios: any = []
  clone_f: any = []


  @Input() id: any
  @Output() onSucesso: EventEmitter<any>


  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private grauacademicoService: TipoHabilitacaoLiterariaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private especialidadeService: EspecialidadeService,
    private instituicaosService: InstituicoesService,
    private cursosService: CursosService,
    private funcionariosService: FuncionarioService,
    private formadoresService: FormadoresService
  ) {
    this.onSucesso = new EventEmitter<any>() 
   }

  ngOnInit(): void {
    this.createForm();
    this.buscarPatentes();
    this.buscarGrauAcademico();
    this.selecionarOrgaoOuComandoProvincial('Orgão')
    this.buscarEspecialidades();
    this.buscarInstituicoes();
    this.buscarCursos();
    this.buscarFuncionarios();
    this.clone_buscarFuncionarios();
  }


  createForm(){
    this.simpleForm = this.fb.group({
      sigpg_funcionarios_id: ['', Validators.required],
      tipo_formador: ['', Validators.required],
      instituicao_ensino_id: ['', Validators.required],
      curso_id: ['', Validators.required],
    })
  }

  buscarPatentes(){
    this.patenteService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.patentes = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        // console.log(this.patentes)
      }
    })
  }
  

  buscarGrauAcademico(){
    this.grauacademicoService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.grauAcademico = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        // console.log(this.grauAcademico)
      }
    })
  }
  
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];


  selecionarOrgaoOuComandoProvincial($event: any): void {
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        // console.log(this.direcaoOuOrgao)
      });
  }


  buscarEspecialidades(){
    this.especialidadeService
    .listar({})
    .pipe(finalize((): void => {} ))
    .subscribe({
      next: (res: any) => {
        this.especialidades = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        // console.log(this.especialidades)
      }
    })
  }
  
  buscarInstituicoes(){
    this.instituicaosService
    .listar({})
    .pipe(finalize((): void => {} ))
    .subscribe({
      next: (res: any) => {
        this.instituicoes = res.map((item: any) => ({
          id: item.id,
          text: item.nome_da_escola
        }));
        // console.log(this.instituicoes)
      }
    })
  }


  buscarCursos(){
    this.cursosService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (response: any) => {
        this.cursos = response.map((item: any) => ({
          id: item.id,
          text: item.curso_nome
        }));
        // console.log(this.cursos)
      }
    })
  }

  

  buscarFuncionarios(){
    this.funcionariosService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (response: any) => {
        console.log(response)
        this.funcionarios = response.map((item: any) => ({
          id: item.id,
          text: item.numero_agente,
          nome: item.nome_completo,
          patente: item.patente_nome,
          orgao: item.sigla
        }));
        // console.log(this.funcionarios)
      }
    })
  }


  clone_buscarFuncionarios(){
    const options = {
      nip: 'nip',
    };
    this.funcionariosService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res: any) => {
          this.clone_funcionarios = res;
        },
        error: (err) => {
        },
      });
  }

  buscardados(evt: any) {
    this.clone_buscarFuncionarios();
    this.clone_f = this.clone_funcionarios.filter((v: any) => v.id == evt);
  }



onSubmit(): void {
  console.log(this.simpleForm.value)
  const type = this.getId
  ? this.formadoresService.actualizar(this.getId, this.simpleForm.value)
  : this.formadoresService.registar(this.simpleForm.value);

  type.pipe(
    finalize(() => {
    }),
  ).subscribe((response) => {
    this.removerModal()
    this.resetForm()
    this.onSucesso.emit({registar: true})
  })
}


private resetForm(){
  this.simpleForm.reset()
}

get getId() {
  return this.id
}

removerModal() {
  $('.modal').hide();
  $('.modal-backdrop').hide();
}
}