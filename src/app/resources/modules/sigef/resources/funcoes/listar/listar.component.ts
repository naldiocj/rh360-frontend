import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncaosService } from '@resources/modules/sigef/core/service/funcaos.service';
import { PermissionsService } from '@resources/modules/sigef/core/service/permissions.service';
import { Pagination } from '@shared/models/pagination';
import { error } from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  public pagination = new Pagination();
  public isLoading: boolean = false;
  public totalBase: number = 0;
  public ShowItem: any;
  public permicoes: Array<Select2OptionData> = [];
  public simpleForm!: FormGroup;
  public filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
  };
  public options: any = {
    width: '100%',
    placeholder: 'selecione uma opção',
  };

  funcoes: any;
  id: any = [];

  constructor(
    private funcaosService: FuncaosService,
    private permissionService:PermissionsService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.listarFuncoes();
    this.buscarPermicoes()
    this.startForm();
  }
  listarFuncoes() {
    this.funcaosService.listar(this.filtro).subscribe({
      next: (response: any) => {
        this.funcoes = response.data;
        console.log(response);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      },
    });
  }

  public Actualizar() {
    this.funcaosService.actualizar(this.id,this.simpleForm.value);
  }
  startForm() {
    this.simpleForm = this.fb.group({
      nome_funcao: ['', [Validators.required]],
      permission_id: ['', [Validators.required]],
    });
  }
public getData(data:any){
this.setId(data.id);
this.UpdateForm(data);
}
  UpdateForm(data: any) {
    this.simpleForm.patchValue({
      nome_funcao: data.nome_funcao,
      permission_id: data.permission_id,
    });
  }

  public setId(id: number) {
    this.id = id;
  }
  public setItem(item: any) {
    this.ShowItem = item;
  }

  buscarPermicoes() {
    this.permissionService
      .listar({})
      .subscribe({
        next: (res: any) => {
          this.permicoes = res.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          console.log(this.permicoes);
        },
      });
  }

  filtrarPagina(key: any, $e: any) {
    console.log($e);
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
  }

  public Recarregar(){
    var filtro:any;
    this.filtro =  filtro = {
      page: 1,
      perPage: 10,
      regime: 1,
      search: '',
    }; 
  }

  public apagar(){
    this.funcaosService.deletar(this.id).subscribe({
      next:(p)=>{
   //return null;
      },
      error:(p)=>{
return error("Erro ao eliminar o item!");
      }
    })
  }
}
