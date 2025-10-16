import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { AlistadoService } from '@resources/modules/sigef/core/service/alistado.service';
import { HabilitacoesService } from '@resources/modules/sigef/core/service/habilitacoes.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  @Input() id: any
  @Output() onSucesso: EventEmitter<any>

  alistados: any = []



  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }

  simpleForm!: FormGroup
  provincias: any = []
  habilitacoesLiterarias: any = []
  habilitacoesProfissionais: any = []
  estadocivil: any = []

  constructor(
    private fb: FormBuilder,
    private provinciaService: ProvinciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private habilitacoesService: HabilitacoesService,
    private estadocivilService: EstadoCivilService,
    private alistadosService: AlistadoService,
  ) { 
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnInit(): void {
    this.createForm();
    this.buscarProvincias();
    this.selecionarOrgaoOuComandoProvincial('Orgão');
    this.buscarHabilitacoes();
    this.buscarProfissionais();
    this.buscarEstadoCivil();
  }

  createForm(){
    this.simpleForm = this.fb.group({
      numero_guia: ['', Validators.required],
      nome_completo: ['', Validators.required],
      nome_pai: ['', Validators.required],
      nome_mae: ['', Validators.required],
      numero_bi: ['', Validators.required],
      emitido_em: ['', Validators.required],
      local_da_emissao: ['', Validators.required],
      genero: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      estado_civil_id: ['', Validators.required],
      nacionalidade: ['', Validators.required],
      provincia_id: ['', Validators.required],
      morada: ['', Validators.required],
      habilitacoes_id: ['', Validators.required],
      contacto: ['', Validators.required],
      // pessoajuridica_id: ['', Validators.required],
    })
  }

  onSubmit(){
      console.log(this.simpleForm.value)
      const type = this.getId
      ? this.alistadosService.actualizar(this.getId, this.simpleForm.value)
      : this.alistadosService.registar(this.simpleForm.value);
    
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

  get getId(){
    return this.id
  }


  buscarProvincias(){
    this.provinciaService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.provincias = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.provincias)
      }
    })
  }
  
  buscarHabilitacoes(){
    this.habilitacoesService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.habilitacoesLiterarias = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.habilitacoesLiterarias)
      }
    })
  }
  
  buscarProfissionais(){
    this.habilitacoesService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.habilitacoesProfissionais = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.habilitacoesProfissionais)
      }
    })
  }
  
  buscarEstadoCivil(){
    this.estadocivilService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.estadocivil = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.estadocivil)
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
        console.log(this.direcaoOuOrgao)
      });
  }


  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }


}
