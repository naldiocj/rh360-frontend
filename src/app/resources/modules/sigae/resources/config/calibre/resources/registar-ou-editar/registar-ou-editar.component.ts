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
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar-calibres',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public form!: FormGroup;
  public marca: any;
  public modelos: any;
  options: any = {
    placeholder: 'selecione uma opçao',
    width: '100%',
  };
  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private calibreService: CalibreService,
    private Modelo:ModeloService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.criarForm();
   this.getModelo();
    this.buscarCalibre(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id != null) {
      this.buscarCalibre(this.id);
    }
  }

  private buscarCalibre(id: any) {
    this.calibreService
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
        this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  public getModeloArma($event: any | number) {
    this.form.value.modelo_id = $event;
  }
  private fillForm(data: any) {
    this.form.patchValue({
      nome: data.nome,
      modelo_id: data.modelo_id,
      descricao: data.descricao,
    });
  }
  private criarForm() {
    this.form = this.fb.group({
      nome: [
        '',
        Validators.compose([Validators.required]),
      ],
      modelo_id: [
        ''
      ],
      descricao: [
        'Criado pelo sistema',
      ],
    });
  }

  public onSubmit() {
    this.carregando = true;
 this.form.value.descricao==null?'sem texto':this.form.value.descricao;
    const type = this.calibreId
      ? this.calibreService.actualizar(this.calibreId, this.form.value)
      : this.calibreService.registar(this.form.value);
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

  public get calibreId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }


}
