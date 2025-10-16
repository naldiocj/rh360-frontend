import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncaosService } from '@resources/modules/sigef/core/service/funcaos.service';
import { PermissionsService } from '@resources/modules/sigef/core/service/permissions.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css'],
})
export class RegistrarOuEditarComponent implements OnInit {
  simpleForm!: FormGroup;
  filtro = {
    page: 1,
    perPage: 1,
    regime: 1,
    search: '',
  };

  public funcaos: Array<Select2OptionData> = [];
  isLoading: boolean = false;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  @Input() public id: any;
  @Output() public onSucesso!: EventEmitter<any>;

  constructor(
    private fb: FormBuilder,
    private funcaosService: FuncaosService,
    private permissionsService: PermissionsService
  ) {
    this.onSucesso = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.createForm();
    this.buscarFuncoes();
  }

  createForm() {
    this.simpleForm = this.fb.group({
      nome_funcao: ['', [Validators.required]],
      permission_id: ['', [Validators.required]],
    });
  }

  onSubmit() {
    const type = this.getId
      ? this.funcaosService.actualizar(this.getId, this.simpleForm.value)
      : this.funcaosService.registar(this.simpleForm.value);

    type
      .pipe(
        finalize((): void => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.resetForm();
          this.onSucesso.emit({ registar: true });
        },
      });
  }

  buscarFuncoes() {
    this.permissionsService
      .listar({})
      .subscribe({
        next: (res: any) => {
          this.funcaos = res.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          console.log(this.funcaos);
        },
      });
  }

  private resetForm() {
    this.simpleForm.reset();
  }
  private get getId() {
    return this.id;
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncoes();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }


  
}
