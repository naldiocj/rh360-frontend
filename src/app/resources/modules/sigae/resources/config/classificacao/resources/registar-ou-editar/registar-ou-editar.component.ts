import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassificacaoArmasService } from './../../../../../core/service/classificacao-armas.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';

@Component({
  selector: 'app-registar-ou-editar-class',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public form!: FormGroup;
public entidade:any;
public tipos:any;
options:any={
  placeholder:"selecione uma opção",
  width:'100%'
}
  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private classificacao:ClassificacaoArmasService,
    private entity:EntidadesService,
    private Tipo:TiposArmasService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.criarForm();
    this.buscarentidades()
    this.buscarTipo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id != null) {
      this.buscarClass(this.id);
    }
  }

  private buscarClass(id: any) {
    this.classificacao
      .um(id)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.fillForm(res);
        },
      });
  }

  private fillForm(data: any) {
    this.form.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      descricao: data.descricao,
    });
  }
  private criarForm() {
    this.form = this.fb.group({
      nome: [
        "",
        Validators.compose([Validators.required, Validators.minLength(1)]),
      ],
      sigla: [
        "",
        Validators.compose([Validators.required, Validators.minLength(1)]),
      ],
      descricao: [
        "criando pelo sistema",
      
      ],
    });
  }

  public onSubmit() {
    this.carregando = true;
    this.form.value.descricao==null?'sem texto':this.form.value.descricao;
    const type = this.classId
      ? this.classificacao.actualizar(this.classId, this.form.value)
      : this.classificacao.registar(this.form.value);
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

  public get classId() {
    return this.id;
  }

  public fechar(){
    this.onSucess.emit({ success: true });
  }

  private buscarentidades() {
    this.entity
      .listar({})
      .subscribe({
        next: (res) => {
          this.entidade = res.map((p: any) => ({ id: p.id, text: p.nome }));

        },
      });
  }

  
  private buscarTipo() {
    this.Tipo
      .listar({})
      .subscribe({
        next: (res) => {
          this.tipos = res.map((p: any) => ({ id: p.id, text: p.nome }));

        },
      });
  }

}
