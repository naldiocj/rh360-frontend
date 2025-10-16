import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../core/helper/file.service';
import { AgenteArquivoService } from '../../core/service/agente-arquivo.service';
import { finalize } from 'rxjs';
import { AgenteService } from '../../core/service/agente.service';

@Component({
  selector: 'app-arquivo',
  templateUrl: './arquivo.component.html',
  styleUrls: ['./arquivo.component.css'],
})
export class ArquivoComponent implements OnInit {
  public simpleForm: any
  isLoading: boolean = false;
  options: any = {};
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
    const tipo:string | null =  this.fileService.getTipoBlob(file)

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

  ngOnDestroy(): void { }
  turn: boolean = true;
  ok: boolean = true;
}
