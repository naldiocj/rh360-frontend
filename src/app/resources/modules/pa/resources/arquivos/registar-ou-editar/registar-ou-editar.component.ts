import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AgenteService } from '../../../core/service/agente.service';
import { FileService } from '../../../core/helper/file.service';
import { AgenteArquivoService } from '../../../core/service/agente-arquivo.service';
import { finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  public simpleForm: any
  public isLoading: boolean = false;
  public turn: boolean = true;
  public ok: boolean = true;
  public options: { id: number };
  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private agenteServive: AgenteService,
    private fileService: FileService,
    private arquivo: AgenteArquivoService
  ) {
    this.options = {
      id: this.agenteServive.id,
    };
  }

  ngOnInit(): void {
    this.createForm();

  }

  createForm() {

    this.simpleForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      arquivo: ['', [Validators.required, Validators.minLength(4)]],
      tipo: ['', Validators.compose([Validators.required])],
      pode_baixar: [false],
      pessoafisica_id: this.agenteServive.id
    });
  }
  onSubmit() {
    this.isLoading = true;
    this.arquivo
      .registar(this.simpleForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = true;
        })
      )
      .subscribe(() => {
        this.reiniciarFormulario();
        window.location.reload()
      });
  }

  onSelectFile(evt: any) {
    const file: File | Blob = evt.target.files.item(0);
    const tipo: string | null = this.fileService.getTipoBlob(file)

    if (this.fileService.isMaxSize(file.size)) {
      this.simpleForm.patchValue({
        arquivo: file,
        tipo: tipo
      });
    }
  }
  reiniciarFormulario() {
    this.simpleForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}


