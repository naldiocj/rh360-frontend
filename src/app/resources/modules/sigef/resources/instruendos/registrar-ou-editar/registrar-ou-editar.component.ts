import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { InstruendoService } from '@resources/modules/sigef/core/service/instruendos.service';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css']
})
export class RegistrarOuEditarComponent implements OnInit {

  simpleForm!: FormGroup

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 1,
    regime: 1,
    search: ''
  }

  isLoading: boolean = false;
  provincias: any = []
  estadoCivil: any = []


  @Input() id: any
  @Output() public onSucesso!: EventEmitter<any>;

  constructor(
    private fb: FormBuilder,
    private instruendoService: InstruendoService,
    private provinsiaService: ProvinciaService,
    private estadocivilService: EstadoCivilService,
    private provinciasService: ProvinciaService,


  ) {
    this.onSucesso = new EventEmitter<any>()
   }

  ngOnInit(): void {
    this.createForm();
    this.buscarProvincias();
    this.buscarEstadoCivil();
  }


  createForm(){
    this.simpleForm = this.fb.group({
      numero_des_admissao: ['', [Validators.required]],
      num_ord_despacho: ['', [Validators.required]],
      num_nip: ['', [Validators.required]],
      num_nuri: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      nome_pai: ['', [Validators.required]],
      nome_mae: ['', [Validators.required]],
      naturalidade: ['', [Validators.required]],
      morada: ['', [Validators.required]],
      num_bilhete: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required]],
      idEstado_civil: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      tam_calcado: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      mais_contacto: ['', [Validators.required]],
      email: ['', [Validators.required]],
      num_conta: ['', [Validators.required]],
      num_iban: ['', [Validators.required]],
      banco: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      loca_instrucao: ['', [Validators.required]],
      especialidade: ['', [Validators.required]],
      ano_conclusao: ['', [Validators.required]],
      cursos: ['', [Validators.required]],
      desc_experiencia: ['', [Validators.required]],
      linguas: ['', [Validators.required]],
      provincia_aloc: ['', [Validators.required]],
      regiao_militar_prov: ['', [Validators.required]],
      provincia_recr: ['', [Validators.required]],
    })
  }

  onSubmit(){
    const type = this.getId
    ? this.instruendoService.actualizar(this.getId, this.simpleForm.value)
    : this.instruendoService.registar(this.simpleForm.value);

    type
    .pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (res: any) => {
        this.resetForm();
        this.onSucesso.emit({ registar: true })
      }
    })
  }
  

  private resetForm(){
    this.simpleForm.reset();
  }

  private get getId(){
    return this.id
  }


  buscarProvincias(){
    this.provinciasService
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

  filtrarPagine(key: any, $e: any){
    if(key == 'page'){
      this.filtro.page = $e;
    }else if (key == 'perpage'){
      this.filtro.perPage = $e;
    }else if (key == 'search'){
    }
  }

}