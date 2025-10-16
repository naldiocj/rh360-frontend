import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MarcasArmasService } from "@resources/modules/sigae/core/service/marcas-armas.service";
import { ModeloService } from "@resources/modules/sigae/core/service/modelo.service";

import { finalize } from "rxjs";

@Component({
  selector: "app-editar-ou-registar-modelo",
  templateUrl: "./editar-ou-registar.component.html",
  styleUrls: ["./editar-ou-registar.component.css"],
})
export class EditarOuRegistarComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public form!: FormGroup;
  public calibres:any
  public options:any ={
    width:'100%',
    placeholder:'selecione uma opção'
  }

  public carregando: boolean = false;
  constructor(private fb: FormBuilder, 
    private modeloService: ModeloService,
    private Calibre: MarcasArmasService,
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.getCalibre();
    this.criarForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id != null) {
      this.buscarModelos(this.id);
    }
  }

  private buscarModelos(id: any) {
    this.modeloService
      .um(id)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.fillForm(res);
        },
      });

  }
      
  public getCalibre() {
    this.Calibre.listar({}).subscribe({
      next: (res: any) => {
        this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  public getCalibreArma($event: any|number) {
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
      nome: [
        "",
        Validators.compose([Validators.required,Validators.minLength(1)]),
      ],
      sigla: [
        "",
        Validators.compose([Validators.required]),
      ],
      descricao: [
        "criado pelo sistema",
      ],
      marca_id: [
        "",
        Validators.compose([Validators.required]),
      ],
    });
  }

  public onSubmit() {
    this.carregando = true;
    this.form.value.descricao==null?'sem texto':this.form.value.descricao;
    const type = this.modeloId
      ? this.modeloService.actualizar(this.modeloId, this.form.value)
      : this.modeloService.registar(this.form.value);
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
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  public get modeloId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }
}
