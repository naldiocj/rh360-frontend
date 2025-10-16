import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpresasService } from '@resources/modules/sicgo/core/service/piquete/empresas/empresas.service';

@Component({
  selector: 'app-registro-ou-editar-empresa',
  templateUrl: './registro-ou-editar-empresa.component.html',
  styleUrls: ['./registro-ou-editar-empresa.component.css']
})
export class RegistroOuEditarEmpresaComponent implements OnInit {
  form!: FormGroup;
  etapaAtual: number = 1;

  constructor(private fb: FormBuilder, private empresaService: EmpresasService, private renderer: Renderer2) {}

 

ngOnInit(): void {
  this.form = this.fb.group({
    legalizacao: this.fb.group({
      nomeEmpresa: ['', Validators.required],
      numeroRegisto: ['', Validators.required],
      diarioRepublica: [null, Validators.required],
      despachoCGPN: [null],
      dataPublicacao: ['', Validators.required]
    }),
    operacional: this.fb.group({
      municipio: ['', Validators.required],
      bairro: ['', Validators.required],
      comuna: ['', Validators.required],
      rua: ['', Validators.required],
      numeroFuncionarios: [null, [Validators.required, Validators.min(1)]],
      actividade: ['', Validators.required],
      numeroArmas: ['']
    }),
    fiscalizacao: this.fb.group({
      statusVistoria: ['Pendente', Validators.required],
      dataVistoria: ['', Validators.required],
      datasInspecao: this.fb.control([]),
      relatorios: this.fb.control([])
    })
  });
  this.atualizarStepper();
}

/** Getters para usar no template sem risco de null */
get legalizacao(): FormGroup { return this.form.get('legalizacao') as FormGroup; }
get operacional(): FormGroup { return this.form.get('operacional') as FormGroup; }
get fiscalizacao(): FormGroup { return this.form.get('fiscalizacao') as FormGroup; }

proximaEtapa(): void {
  const grupo = this.formEtapaAtual();
  if (grupo.valid) {
    this.etapaAtual++;
    this.atualizarStepper();
  } else {
    grupo.markAllAsTouched();
  }
}

etapaAnterior(): void {
  if (this.etapaAtual > 1) {
    this.etapaAtual--;
    this.atualizarStepper();
  }
}

private formEtapaAtual(): FormGroup {
  if (this.etapaAtual === 1) return this.legalizacao;
  if (this.etapaAtual === 2) return this.operacional;
  return this.fiscalizacao;
}

onFileChange(event: Event, controlName: string, etapa: 'legalizacao' | 'operacional'): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  if (file) {
    this.form.get(etapa)?.get(controlName)?.setValue(file);
  }
}

submeter(): void {
  if (!this.form.valid) {
    this.form.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  // Percorre cada grupo de controles
  Object.entries(this.form.value).forEach(([groupName, groupValue]) => {
    Object.entries(groupValue as Record<string, any>).forEach(([key, val]) => {
      if (val instanceof File) {
        formData.append(key, val);
      } else if (val instanceof Blob) {
        formData.append(key, val, key);
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => formData.append(`${key}[${idx}]`, item));
      } else if (val !== null && val !== undefined) {
        formData.append(key, val.toString());
      }
    });
  });

  this.empresaService.registar(formData).subscribe({
    next: () => alert('Empresa registrada com sucesso!'),
    error: () => alert('Erro ao registrar empresa.')
  });
}

private atualizarStepper(): void {
  const steps = document.querySelectorAll('.steps div');
  steps.forEach((el, idx) => {
    if (idx + 1 < this.etapaAtual) {
      this.renderer.addClass(el, 'completed');
    } else {
      this.renderer.removeClass(el, 'completed');
    }
    if (idx + 1 === this.etapaAtual) {
      this.renderer.addClass(el, 'active');
    } else {
      this.renderer.removeClass(el, 'active');
    }
  });
}
}