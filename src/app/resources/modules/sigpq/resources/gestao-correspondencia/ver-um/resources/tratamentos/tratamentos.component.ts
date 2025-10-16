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
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { TratamentoCorrespondenciaService } from '@resources/modules/sigpq/core/service/Tratamento-correspondencia.service';
import { Pagination } from '@shared/models/pagination';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-tratamentos',
  templateUrl: './tratamentos.component.html',
  styleUrls: ['./tratamentos.component.css'],
})
export class TratamentosComponent implements OnInit, OnChanges {
  public tratamentos: any;
  @Input() correspondencia: any;
  @Output() onCarregar!:EventEmitter<any>
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public fileUrl: any;
  public carregarDocumento: boolean = false;
  public documento: any;
  public simpleForm: any;

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,
  };

  constructor(
    private tratamentoCorrespondenciaService: TratamentoCorrespondenciaService,
    private fb: FormBuilder,
    private secureService: SecureService,
    private ficheiroService: FicheiroService,
    private formatarDataHelper: FormatarDataHelper
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
  ngOnInit(): void { }
  private buscarTratamentos() {
    const options = {
      ...this.filtro,
      sigpq_correspondencia_id: this.getCorrespondenciaId,
    };

    this.tratamentoCorrespondenciaService
      .listarTodos(options)
      .pipe()
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

    this.fileUrl = null;

    opcoes.url = documento.anexo || null;
    this.documento = documento;

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.carregarDocumento = false;
        })
      )
      .subscribe((file: any) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });

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
}
