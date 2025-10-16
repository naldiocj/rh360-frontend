import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CorrespondenciaService } from '@resources/modules/sigpq/core/service/Corrrespondencia.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-enviada',
  templateUrl: './enviada.component.html',
  styleUrls: ['./enviada.component.css']
})
export class EnviadaComponent implements OnInit {

  public documento: any
  public fileUrl: any
  public carregarDocumento: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public correspondenciaId: number | null = null

  public estados = [{
    cor: '#FFA500',
    texto: 'Pendente'
  }, {
    cor: '#826AF9',
    texto: 'Expedido',
  }, {
    cor: 'rgb(64, 232, 22)',
    texto: 'Despacho'
  },
  {
    cor: '#E31212',
    texto: 'Saida'
  },
  {
    cor: '#000000',
    texto: 'Parecer'
  },
  {
    cor: '#FFFF00',
    texto: 'Pronuciamento'
  },
  ]

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,

  }

  constructor(private correspondenciaService: CorrespondenciaService, private ficheiroService: FicheiroService, private secureService: SecureService) {

  }


  ngOnInit(): void {
    this.buscarCorrespondencias()
  }

  private buscarCorrespondencias(): void {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    }
    this.correspondenciaService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        this.correspondencias = response.data


        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }
    })
  }



  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.buscarCorrespondencias()

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCorrespondencias()
  }


  public construcao() {
    alert('Em contrucao')
  }

  public validarEliminar(item: any) {

  }


  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id
  }

  setId(id: number | null) {
    this.correspondenciaId = id
  }

  public visualizar(documento: any) {


    const opcoes = {
      pessoaId: documento?.remetente_id,
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
