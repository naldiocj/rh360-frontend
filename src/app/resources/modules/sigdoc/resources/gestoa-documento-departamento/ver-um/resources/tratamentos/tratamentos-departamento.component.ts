import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { TratamentoDepartamentoService } from '@resources/modules/sigdoc/core/service/Tratamento-departamento.service';
import { Pagination } from '@shared/models/pagination';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigdoc-tratamentos',
  templateUrl: './tratamentos-departamento.component.html',
  styleUrls: ['./tratamentos-departamento.component.css'],
})
export class TratamentosDepartamentoComponent implements OnInit, OnChanges {
  public tratamentos: any;
  @Input() correspondencia: any;
  @Output() onCarregar!:EventEmitter<any>
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public fileUrl: any;
  public fileUrls: { anexo?: any; anexo_entrada?: any } = {}; // Armazenar URLs de ambos os documentos
  public carregarDocumento: boolean = false;
  public documento: any;
  public isLoading: boolean = false;
  public simpleForm: any;

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,
  };

  constructor(
    private tratamentoCorrespondenciaService: TratamentoDepartamentoService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private ficheiroService: FicheiroService,
    private formatarDataHelper: FormatarDataHelper,
    private route: ActivatedRoute,
  ) { 
    this.onCarregar =  new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['correspondencia'].previousValue !=
      changes['correspondencia'].currentValue
    ) {
      this.buscarTratamentos();
    }
  }
  ngOnInit(): void { 
    
  }
  private buscarTratamentos() {
    const options = {
      ...this.filtro,
      sigdoc_departamento_id: this.getCorrespondenciaId,
    };
    this.isLoading = true;
    this.tratamentoCorrespondenciaService
      .listarTodos(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.tratamentos = response.data;
          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });

  }

  public getStatus(cor: string): string {
    if (cor === '#8B4513') {
      return 'Recebido';
    } else if (cor === '#4682B4') {
      return 'Em tratamento';
    } else if (cor === '#6c757d') {
      return 'Pendente';
    } else {
      return 'Concluído'; // Adicione mais lógica aqui se necessário, por exemplo, para outras cores
    }
  }
  

  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public get getCorrespondenciaId() {
    return this.correspondencia?.id as number;
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get minhaCorrespondencia() {
    return this.getOrgaoId == this.correspondencia?.pessoajuridica_id;
  }

  public get getCorrespondencia() {
    return this.correspondencia
  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarTratamentos();
    this.onCarregar.emit({carregar: true})
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarTratamentos();
  }

  public construcao() {
    alert('Hello world');
  }

  public visualizar(documento: any) {
    const opcoes = {
      pessoaId: documento?.pessoafisica_id,
      url: '',
    };

    this.fileUrls = { anexo: null, anexo_entrada: null }; // Resetar URLs
    this.documento = documento;
    this.carregarDocumento = true;

    // Carregar o anexo de sigdoc_trata_corres_detalhes
    if (documento.anexo) {
      opcoes.url = documento.anexo;
      this.ficheiroService
        .getFileStore(opcoes)
        .pipe(
          finalize(() => {
            if (!documento.anexo_entrada) this.carregarDocumento = false; // Finaliza se não houver anexo_entrada
          })
        )
        .subscribe((file: any) => {
          this.fileUrls.anexo = this.ficheiroService.createImageBlob(file);
        });
    }

    // Carregar o anexo_entrada de sigdoc_entrada_expedientes
    if (documento.anexo_entrada) {
      opcoes.url = documento.anexo_entrada;
      this.ficheiroService
        .getFileStore(opcoes)
        .pipe(
          finalize(() => {
            this.carregarDocumento = false; // Finaliza após carregar anexo_entrada
          })
        )
        .subscribe((file: any) => {
          this.fileUrls.anexo_entrada = this.ficheiroService.createImageBlob(file);
        });
    }

    if (!documento.anexo && !documento.anexo_entrada) {
      this.carregarDocumento = false; // Se não houver documentos, não carrega
    }

    return true;
  }

  public getDataExtensao(data: any) {
    return this.formatarDataHelper?.dataExtensao(data, true)
  }

  public eData(data: any): boolean {
    return data == null ? false : data != '0000-00-00' ? true : false
  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }

  public upperCase(text: any) {
    return text ? text.toString().toUpperCase() : 'S/N'
  }

  public temAnexado(anexo: any) {
    return anexo != null ? 'Sim' : 'Não'
  }

  public get getId() {
    return this.route.snapshot.params['id'];
  }
  public get getTipo() {

    return this.route.snapshot.params['tipo'];
  }

  public get isEnviada() {
    return ['enviado'].includes(this.getTipo.toString().toLowerCase())
  }
  public get isRecebida() {
    return ['recebido'].includes(this.getTipo.toString().toLowerCase())
  }
}
