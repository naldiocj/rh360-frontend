import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '../../../../../../shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { LicencaParaFuncionarioService } from '../../../core/service/Licenca-funcionario.service';
import { TipoLicencasService } from '../../../core/service/TipoLicencas.service';
import { funcaoGenericaGerarAnos, funcaoGenericaGerarMeses } from '../../../../../../core/functions/functions';

@Component({
  selector: 'app-sigpq-licencas',
  templateUrl: './licencas.component.html',
  styleUrls: ['./licencas.component.css']
})
export class LicencasComponent implements OnInit {

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

  public anos: Array<Select2OptionData> = []
  public meses: Array<Select2OptionData> = []

  filtro = {
    page: 1,
    perPage: 5,
    search: "",
    mes: 'null',
    ano:'null',
    tipo_licenca_id:'null',
  }

  constructor(
    private licenasService: LicencaParaFuncionarioService,
    private tipoLicenca:TipoLicencasService
  ) {

   }

   public _tipolicencas: Array<Select2OptionData> = []
   public teste:any;

   options: any = {
    placeholder: "Selecione uma opção",
    width: '100%', // Garante que o select ocupa toda a largura do contêiner
};



   ngOnInit(): void {
    //this.listarFuncao()
   this.preencherLicencas()
   this.preencherAnoEMesPadrao()
  }

  preencherAnoEMesPadrao() {
    // Preencher os anos de 2020 até 2030
    this.anos=funcaoGenericaGerarAnos()

    this.meses=funcaoGenericaGerarMeses()
  }

   preencherLicencas() {

    const opcao = {
      /* ...this.filtro,
      pessoafisica_id: this.pessoaId */
    }

    this.tipoLicenca.listar(opcao).pipe().subscribe({
        next: (response: any) => {
          const org = response.map((item: any) => ({ id: item.id, text: item.nome }));
      this._tipolicencas=org // Preenchendo a variável
        }
      })
  }


  listarFuncao() {
    const opcao = {
      ...this.filtro,
      pessoafisica_id: this.pessoaId
    }
    this.licenasService
      .listarTodasLicencas(opcao)
      .subscribe((response:any) => {
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
    }else if (key == 'tipo_licenca_id') {
      this.filtro.tipo_licenca_id = $e;
    } else if (key == 'ano') {
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


  public eData(data: any): boolean {
    return data != '0000-00-00' ? true : false
  }


  public setId(id: any) {
    this.id = id;
  }

  public eliminarFuncao() {
    this.licenasService.eliminar(this.id).pipe().subscribe({
      next: (respponse: any) => {
        //this.modalService.fechar('btn-close')
        this.recarregarPagina()
      }
    })
  }


  public construcao(): void {
    alert('Em contrução')
  }


}

