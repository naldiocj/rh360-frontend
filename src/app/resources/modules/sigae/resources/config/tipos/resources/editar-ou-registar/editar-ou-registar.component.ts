import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-editar-ou-registar-tipo',
  templateUrl: './editar-ou-registar.component.html',
  styleUrls: ['./editar-ou-registar.component.css'],
})
export class EditarOuRegistarComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public form!: FormGroup;
  public marcas: any;

  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private tipoArmasService: TiposArmasService,
    private Marca: MarcasArmasService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.criarForm();
    this.getMarcas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id != null) {
      this.buscarTipos(this.id);
    }
  }

  private buscarTipos(id: any) {
    this.tipoArmasService
      .um(id)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.fillForm(res);
        },
      });
  }
  private getMarcas() {
    this.Marca.listar({}).subscribe({
      next: (res: any) => {
        this.marcas = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
    console.log(this.marcas);
  }

  public getMarcaArma($event: any | number) {
    this.form.value.marca_id = $event;
  }

  private fillForm(data: any) {
    this.form.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      descricao: data.descricao,
      marca_id: data.marca_id,
    });
  }
  private criarForm() {
    this.form = this.fb.group({
      nome: ['', Validators.compose([Validators.required])],
      sigla: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      descricao: ['criado pelo sistema'],
      marca_id: [null],
    });
  }

  public onSubmit() {
    this.carregando = true;
    this.form.value.descricao == null ? 'sem texto' : this.form.value.descricao;
    const type = this.classId
      ? this.tipoArmasService.actualizar(this.classId, this.form.value)
      : this.tipoArmasService.registar(this.form.value);
    type
      .pipe(
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (): void => {
          this.resetForm();
          this.removerModal();
          this.onSucess.emit({ success: true });
        },
      });
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get classId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }
}
