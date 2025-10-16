import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { AntecedenciaService } from '@resources/modules/sigpj/core/service/Antecedencia.service';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { DecisaoList } from '@resources/modules/sigpj/shared/model/decisao-list.model';
import { DisciplinarList } from '@resources/modules/sigpj/shared/model/disciplinar-list.model';
import { ParecerList } from '@resources/modules/sigpj/shared/model/parecer-list.model';
import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {

  public disciplinars?: DisciplinarList;


  public arguido?: Funcionario;
  parecerForm!: FormGroup;
  decisaoForm!: FormGroup;
  arrayFiles!: File[];


  public disciplinarTipo: string = 'Disciplinar'
  public disciplinarTotal: number = 0
  public reclamacaoTipo: string = 'Reclamacao'
  public reclamacaoTotal: number = 0
  public AntecedenciaTotal: number = 0
  public haveDatasParecer: boolean = false;
  public haveDatasDecisao: boolean = false;
  NovoParecer: any

  public pecasParecer: PecasList[] = [];
  public pecasDecisao: PecasList[] = [];
  public todosIntervenientes: any[] = [];
  public dadosParecer?: ParecerList
  public dadosDecisao?: DecisaoList
  public isLoading: boolean = false;
  public pagination = new Pagination();
  totalBase: number = 0;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };
  constructor(
    private disciplinar: DisciplinarService,
    private route: ActivatedRoute,
    private parecer: ParecerDisciplinarService,
    private decisao: DecisaoDisciplinarService,
    private funcionarioServico: FuncionarioService,
    private arguidoServico: ArguidoDisciplinarService,
    private router: Router,
    private antecedenciaService: AntecedenciaService
  ) { }

  ngOnInit(): void {
    this.buscarUmDisciplinar();
    // this.buscarIntervenientes();

    // this.buscarDadosParecer()
    // this.buscarPecasParecer()

    // this.buscarDadosDecisao()
    // this.buscarPecasDecisao()

  }

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }

  onView(item: any) {
    // console.log("selected", item)
    this.parecer.verUm(item.id)
      .subscribe(response => {
        //console.log("dados do parecer", response)
        if (!response || !response == null || !response == undefined) {
          window.alert('Dados Vazios no Parecer!')
          return
        }

        this.decisao.verUm(item.id)
          .subscribe(response1 => {
            if (!response1 || !response1 == null || !response1 == undefined) {
              window.alert('Dados Vazios na Decisao!')
              return
            }

            this.router.navigate(['/piips/sigpj/processo/disciplinar/detalhes/listagem/visualizar', item.id])
          })
      })


  }

  clicked(id: number) {

  }

  buscarIntervenientes() {
    this.arguidoServico
      .listar(this.filtro, this.getId)
      .subscribe((response: any) => {
        this.todosIntervenientes = response.data;

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  buscarUmDisciplinar() {
    this.disciplinar
      .verUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        console.log(response);

        this.disciplinars = response;
        // this.buscarUmArguido(response.funcionario_id);
        // this.antecedentesDisciplinar(response.funcionario_id)
        // this.antecedentesReclamacao(response.funcionario_id)
      });
  }

  buscarUmArguido(arguido_id: number) {
    this.funcionarioServico
      .buscarUm(arguido_id)
      .pipe(finalize(() => { }))
      .subscribe((response) => {
        //console.log("arguido", response)
        this.arguido = response;
      });
  }

  excluirInterveniente(event: any) {
    //console.log(event)
    if (event.acusado == true) {
      window.alert('Acusado nao pode ser eliminado!')
      return
    }
    this.arguidoServico.eliminar(event.id)
      .subscribe((response) => {
        // console.log('eliminado', response)
        this.buscarIntervenientes()
      })


  }

  filtrarInterve(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarIntervenientes();
  }

  recarregarInterve() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarIntervenientes();
  }

  buscarPecasParecer() {

    this.isLoading = true;

    // this.parecer.listarPecas(this.filtro, this.getId)
    //   .subscribe((response) => {
    //     console.log('Pecas parecer', response)
    //     this.pecasParecer = response.data

    //     this.totalBase = response.meta.current_page ?
    //       response.meta.current_page === 1 ? 1
    //         : (response.meta.current_page - 1) * response.meta.per_page + 1
    //       : this.totalBase;

    //     this.pagination = this.pagination.deserialize(response.meta);
    //   });

  }

  filtrarPecasParecer(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarPecasParecer()
  }

  recarregarPecasParecer() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarPecasParecer()
  }

  verFile(file: any) {
    // console.log("btn do file foi precionado")
    const pos = file.nome.lastIndexOf('.');
    const extensao = pos >= 0 ? file.nome.slice(pos + 1) : ''

    //  var ext = file.nome.split('/').pop();
    // ext = ext.indexOf('.') < 1 ? '' : ext.split('.').pop();

    if (extensao == 'pdf') {
      window.alert(' Nao e permitido visualizar arquivo pdf')
      return
    }

    const buffer = new Uint8Array(file.blob.data)
    const blob = new Blob([buffer], { type: `image/${extensao}` })
    const url = window.URL.createObjectURL(blob)

    window.open(url, '_blank')

  }

  downloadFile(file: any) {
    // console.log("btn de download foi precionado")
    const pos = file.nome.lastIndexOf('.');
    const extensao = pos >= 0 ? file.nome.slice(pos + 1) : ''


    let a = document.createElement('a')
    a.style.display = 'none';
    document.body.appendChild(a)



    if (extensao === 'pdf') {
      const buffer = new Uint8Array(file.blob.data)
      const blob = new Blob([buffer], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = file.nome
      a.click()
      window.URL.revokeObjectURL(url)
      return
    }

    const buffer = new Uint8Array(file.blob.data)
    const blob = new Blob([buffer], { type: `image/${extensao}` })
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = file.nome
    a.click()
    window.URL.revokeObjectURL(url)

  }

  buscarDadosParecer() {
    this.parecer.verUm(this.getId)
      .subscribe(response => {
        this.dadosParecer = response
      })

  }

  filtrarPecasDecisao(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarPecasDecisao()
  }

  buscarPecasDecisao() {

    this.isLoading = true;
    this.decisao.listarPecas(this.filtro, this.getId)
      .subscribe((response) => {

        this.pecasDecisao = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });

  }

  recarregarPecasDecisao() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarPecasDecisao()
  }

  buscarDadosDecisao() {
    this.decisao.verUm(this.getId)
      .subscribe(response => {
        // console.log('dados decisao', response)
        //this.decisaoID = response.id
        this.dadosDecisao = response

      })
  }

  antecedentesDisciplinar(arguido: any) {
    this.antecedenciaService.listarDisciplinar(arguido)
      .subscribe(response => {
        this.disciplinarTotal = response.total
      })
  }

  antecedentesReclamacao(arguido: any) {
    this.antecedenciaService.listarReclamacao(arguido)
      .subscribe(response => {
        this.reclamacaoTotal = response.total
      })
  }

}
