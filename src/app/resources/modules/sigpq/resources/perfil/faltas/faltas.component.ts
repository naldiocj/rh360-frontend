import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { FuncaoService } from '@resources/modules/sigpq/core/service/Funcao.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { ModalService } from '@core/services/config/Modal.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { LicencaParaFuncionarioService } from '../../../core/service/Licenca-funcionario.service';
import { funcaoGenericaGerarAnos, funcaoGenericaGerarMeses } from '../../../../../../core/functions/functions';

@Component({
  selector: 'app-sigpq-faltas',
  templateUrl: './faltas.component.html',
  styleUrls: ['./faltas.component.css']
})
export class FaltasComponent implements OnInit {

  public totalBase: number = 0
  @Input() public pessoaId: any = 5
  public pagination = new Pagination()
  public funcaos: Array<any> = []
  public funcao: any
  public id: any
  public fileUrl: any
  public documento: any
  public carregarDocumento: boolean = false;
  @Input() funcionario: any


  filtro = {
    page: 1,
    perPage: 50,
    search: "",
    mes: 'null',
    ano:'null',
    tipo_licenca_id:42,
  }

  constructor(
    private licenasService: LicencaParaFuncionarioService,
    private formatarData: FormatarDataHelper,
    private modalService: ModalService,
    private ficheiroService: FicheiroService,
    public formatarDataHelper: FormatarDataHelper,
  ) { }

   public anos: Array<Select2OptionData> = []
   public meses: Array<Select2OptionData> = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }


  ngOnInit(): void {
    this.listarFuncao()
    this.preencherAnoEMesPadrao()
  }

  preencherAnoEMesPadrao() {
    // Preencher os anos de 2020 até 2030
    this.anos=funcaoGenericaGerarAnos()

    // Lista de meses
    this.meses=funcaoGenericaGerarMeses()
  }


  listarFuncao() {
    const opcao = {
      ...this.filtro,
      pessoafisica_id: this.pessoaId
    }
    this.licenasService
      .listarTodasLicencas(opcao)
      .subscribe((response) => {
        this.funcaos = response.data;
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    }else if (key == 'ano') {
      this.filtro.ano = $e;
    }else if (key == 'mes') {
      this.filtro.mes = $e;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.listarFuncao()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.listarFuncao()
    this.setNullFuncao()
    this.id = null
  }

  public get getPessoaId() {
    return this.pessoaId as number
  }

  public setFuncao(item: any) {
    this.funcao = item;

    console.log(item)
  }

  private setNullFuncao() {
    this.funcao = null;


  }

  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


  public eData(data: any): boolean {
    return data != '0000-00-00' ? true : false
  }


  public setId(id: any) {
    this.id = id;
  }

  public eliminarFuncao() {
    this.licenasService.eliminar(this.id).pipe().subscribe({
      next: (respponse: any) => {
        this.modalService.fechar('btn-close')
        this.recarregarPagina()
      }
    })
  }


  public construcao(): void {
    alert('Em contrução')
  }
  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }

  visualizar(documento: any) {


    const opcoes = {
      pessoaId: this.getPessoaId,
      url: ''
    }

    this.fileUrl = null


    opcoes.url = documento.anexo || null

    this.documento = documento


    if (!opcoes.url) return false

    this.carregarDocumento = true
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }
}
