import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { PatenteService } from '../../../../../../../core/services/Patente.service';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public pagination = new Pagination();
  public carregando: boolean = false;
  public patentes:any
  public patente:any

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy:'nome'
  }
  public regimes: Array<Select2OptionData> = []

  constructor(private patentesService:PatenteService) { }

  ngOnInit() {

    this.buscarPatentes()
  }

  public setPatente(patente: any) {
    this.patente = patente
  }

  recarregarPagina()
  {
    this.buscarPatentes()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e.target.value;
    }
    else if (key == 'regime') {
      //this.filtro.regime = $e;
    }
    this.buscarPatentes()
  }


  private buscarPatentes(): void {
    const options = { ...this.filtro };
    this.patentesService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response.data
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  public eliminar(identificador:any)
  {
    /* this.tipoFuncaoService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarFuncao()
      })
    ).subscribe((sucess:any) => {
      console.log("Resultado:",sucess)
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    } */
  }

}
