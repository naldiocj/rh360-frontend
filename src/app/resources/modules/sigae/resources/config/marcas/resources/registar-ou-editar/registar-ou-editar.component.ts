import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar-marca',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;

  public options: any = {
    width: '100%',
    placeholder: 'selcione uma opção',
  };
  public form!: FormGroup;
  public modelos: any;
  public carregando: boolean = false;
public modelo_id!:number;
  constructor(
    private fb: FormBuilder,
    private marcasSerice: MarcasArmasService,
    private Modelo: TiposArmasService,
    private usuario:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.getModelo();
    this.criarForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id != null) {
      this.buscarMarca(this.id);
    }
  }

  private buscarMarca(id: any) {
    this.marcasSerice
      .um(id)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.fillForm(res);
        },
      });
  }

  public getModelo() {
    this.Modelo.listar({}).subscribe({
      next: (res: any) => {
        this.modelos =res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  public getModeloArma($event: any|number) {
if($event!=null){
 this.modelo_id = $event;
}
    console.log(this.modelo_id)
  }

  private fillForm(data: any) {
    this.form.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      descricao: data.descricao,
      tipo_id: data.tipo_id,
    });
  }
  private criarForm() {
    this.form = this.fb.group({
      nome: [
        '',
        Validators.compose([Validators.required]),
      ],
      sigla: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      descricao: [
        'criado pelo sistema',
      ],
      tipo_id: [
        '',
        Validators.compose([Validators.required]),
      ],
    });
  }

  public onSubmit() {
    this.carregando = true;
    if(this.modelo_id!=null){
      this.form.value.modelo_id = this.modelo_id;
    }
 this.form.value.descricao==null?'sem texto':this.form.value.descricao;
    console.log(this.form.value)
    const type = this.marcaId
      ? this.marcasSerice.actualizar(this.marcaId, this.form.value)
      : this.marcasSerice.registar(this.form.value);
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

  public get marcaId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }
}
