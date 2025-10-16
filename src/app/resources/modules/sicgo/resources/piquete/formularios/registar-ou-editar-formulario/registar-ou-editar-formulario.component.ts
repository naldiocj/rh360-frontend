import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@resources/modules/sicgo/core/service/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { TipoformularioService } from '@resources/modules/sicgo/core/service/piquete/tipoformulario.service';
import { Select2OptionData } from 'ng-select2';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar-formulario',
  templateUrl: './registar-ou-editar-formulario.component.html',
  styleUrls: ['./registar-ou-editar-formulario.component.css']
})
export class RegistarOuEditarFormularioComponent implements OnInit {

  public tipoformularios: any;
  public documento: any
  public fileUrl: any
  public carregarDocumento: boolean = false;
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  documentos: any;
  selectedDocumentId: any;
  constructor(private fb: FormBuilder,
    private ocorrenciaService: OcorrenciaService,private tipoformularioService:TipoformularioService,private ficheiroService: FicheiroService, private secureService: SecureService) { }

  ngOnInit(): void {
    this.buscarTipoformularios();

  }

  openDocuments() {
    if (!this.selectedDocumentId) {
      alert('Por favor, selecione um documento válido.');
      return;
    }

    this.ficheiroService.getDocumentById(this.selectedDocumentId).subscribe((documento) => {
      if (documento && documento.url) {
        this.fileUrl = documento.url;
        window.open(this.fileUrl, '_blank');
      } else {
        alert('Documento não encontrado.');
      }
    }, (error) => {
      console.error('Erro ao buscar o documento:', error);
      alert('Erro ao buscar o documento.');
    });
  }

  buscarTipoformularios() {
    const options = {};
    this.tipoformularioService
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any) => {
          this.tipoformularios = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }


  selectedType: string = '';

  openDocument() {
    let url = '';
    switch (this.selectedType) {
      case 'pdf':
        url = 'path/to/your/pdf/document.pdf';
        break;
      case 'docx':
        url = 'path/to/your/docx/document.docx';
        break;
      case 'txt':
        url = 'path/to/your/txt/document.txt';
        break;
      default:
        alert('Selecione um tipo de documento válido.');
        return;
    }
    window.open(url, '_blank');
  }

  public visualizar(documento: { remetente_id: number, anexo: string }) {
    const opcoes = {
      pessoaId: documento?.remetente_id,
      url: documento.anexo || null
    };

    this.fileUrl = null;
    this.documento = documento;

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false;
      }),
      catchError((error) => {
        console.error('Erro ao carregar o documento:', error);
        return of(null);
      })
    ).subscribe((file) => {
      if (file) {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      }
    });

    return true;
  }

  uploadForm!: FormGroup;
  newsTypes: string[] = ['Tipo 1', 'Tipo 2', 'Tipo 3']; // Adapte conforme necessário
  file: File | undefined;

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

public form(){
  this.uploadForm = this.fb.group({
    date: ['', Validators.required],
    title: ['', Validators.required],
    reference: ['', Validators.required],
    subject: ['', Validators.required],
    newsType: ['', Validators.required],
    searchCriteria: ['', Validators.required],
  });
}

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      if (this.file) {
        formData.append('file', this.file);
      }

      // Enviar o FormData para o backend
      // this.http.post('/api/upload', formData).subscribe(response => {
      //   console.log('Upload com sucesso', response);
      // });
    }
  }

}
