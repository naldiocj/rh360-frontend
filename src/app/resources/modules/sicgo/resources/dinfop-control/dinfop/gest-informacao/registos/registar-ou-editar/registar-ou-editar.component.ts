import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sicgo-registar-ou-editar-informante',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  informanteForm: FormGroup;
  tiposInformante = [
    'Anônimo', 'Identificado', 'Voluntário', 'Cooptado', 
    'Arrependido', 'Infiltrado', 'Técnico', 'Ocasional'
  ];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2MB


  constructor(private fb: FormBuilder) {
    this.informanteForm = this.fb.group({
      tipo: ['', Validators.required],
      nome: [''],
      apelido: [''],
      fotoUrl: [''], // Para armazenar URL se a foto já existir
      contato: ['', [Validators.required, this.validateContact.bind(this)]],
      dataRegistro: ['', Validators.required],
      detalhes: ['', [Validators.required, Validators.minLength(20)]],
      confiabilidade: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.informanteForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.resetCamposEspecificos();
      this.adicionarCamposEspecificos(tipo);
    });
  }

  ngOnInit(): void {
    // Initialize any required data
  }

  // Validate both phone and email
  validateContact(control: any): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;

    // Brazilian phone regex (accepts formats like (00) 0000-0000, (00) 00000-0000, 00 0000-0000, etc.)
    const phoneRegex = /^(\+\d{1,3}\s?)?(\(\d{2}\)|\d{2})[\s-]?\d{4,5}[\s-]?\d{4}$/;
    
    // Email regex
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (phoneRegex.test(value) || emailRegex.test(value)) {
      return null; // Validation passes
    } else {
      return { 'invalidContact': true }; // Validation fails
    }
  }

  // Check if contact is email
  isEmail(value: string | null): boolean {
    if (!value) return false;
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  }

  // Check if contact is phone
  isPhone(value: string | null): boolean {
    if (!value) return false;
    return /^(\+\d{1,3}\s?)?(\(\d{2}\)|\d{2})[\s-]?\d{4,5}[\s-]?\d{4}$/.test(value);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.informanteForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getCleanPhone(phone: string | null): string {
    if (!phone) return '';
    return phone.replace(/[^\d+]/g, '');
  }

  private resetCamposEspecificos() {
    ['beneficio', 'acordoLegal', 'expertise', 'vinculoCrime', 'periodoInfiltracao'].forEach(campo => {
      this.informanteForm.removeControl(campo);
    });
  }

  private adicionarCamposEspecificos(tipo: string) {
    switch (tipo) {
      case 'Cooptado':
        this.informanteForm.addControl('beneficio', this.fb.control('', Validators.required));
        this.informanteForm.addControl('acordoLegal', this.fb.control(''));
        break;
      case 'Arrependido':
        this.informanteForm.addControl('vinculoCrime', this.fb.control('', [Validators.required, Validators.minLength(20)]));
        break;
      case 'Infiltrado':
        this.informanteForm.addControl('periodoInfiltracao', this.fb.control(''));
        break;
      case 'Técnico':
        this.informanteForm.addControl('expertise', this.fb.control('', Validators.required));
        break;
    }
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Verificar tamanho do arquivo
    if (file.size > this.maxFileSize) {
      alert('O arquivo é muito grande. Tamanho máximo permitido: 2MB');
      return;
    }
    
    // Verificar tipo do arquivo
    if (!file.type.match(/image\/*/)) {
      alert('Apenas arquivos de imagem são permitidos');
      return;
    }
    
    this.selectedFile = file;
    
    // Criar pré-visualização
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.informanteForm.patchValue({
        foto: file,
        fotoUrl: reader.result?.toString()
      });
    };
    reader.readAsDataURL(file);
  }

  removeFoto(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.informanteForm.patchValue({
      foto: null,
      fotoUrl: ''
    });
    this.fileInput.nativeElement.value = '';
  }
  onSubmit() {
    if (this.informanteForm.valid) {
      console.log('Dados do informante:', this.informanteForm.value);
      // API integration would go here
      alert('Informante registrado com sucesso!');
    } else {
      this.informanteForm.markAllAsTouched();
    }
  }
}

function ViewChild(arg0: string): (target: RegistarOuEditarComponent, propertyKey: "fileInput") => void {
  throw new Error('Function not implemented.');
}
