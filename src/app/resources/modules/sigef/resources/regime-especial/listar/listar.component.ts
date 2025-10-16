import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { PatenteService } from '@core/services/Patente.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public direcaoOuOrgao: Array<Select2OptionData> = [];

  simpleForm!:  FormGroup

  patentes: any = []
  estadoCivil: any = []

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private estadocivilService: EstadoCivilService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarPatentes();
    this.buscarEstadoCivil();
    this.selecionarOrgaoOuComandoProvincial('Orgão');
  }

  createForm(){
    this.simpleForm = this.fb.group({
      regime: ['', [Validators.required]],
      nome_completo: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required]],
      patente: ['', [Validators.required]],
      proveniencia: ['', [Validators.required]],
      data_ingresso: ['', [Validators.required]],
      estado_civil: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    })
  }

  onSubmit(){
    console.log(this.simpleForm.value)
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
        console.log(this.patentes)
      }
    })
  }
 
  buscarEstadoCivil(){
    this.estadocivilService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.estadoCivil = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.estadoCivil)
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

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
  }

}
