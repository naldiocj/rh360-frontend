import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgenteService } from '../../core/service/agente.service';
import { DadosPessoalService } from '../../core/service/dados-pessoal.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.css']
})
export class DadosComponent implements OnInit, OnDestroy {

  public p: any
  isLoading: boolean = false;
  public person!: any;
  public profissional: any
  public options: any = {}
  public fileUrl: any

  public pp: any
  private destroy$ = new Subject<void>()

  constructor(
    private agenteService: AgenteService,
    private personal: DadosPessoalService,
    private ficheiroService: FicheiroService,
    private funcionarioService: FuncionarioService,
    public utilsHelper: UtilsHelper) {

    this.options = {
      id: this.agenteService?.id
    }
  }

  ngOnInit(): void {
    this.buscarDadosPessoal();
    this.buscarFuncionario()
  }
  buscarDadosPessoal() {
    true;
    this.personal.listar(this.options).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.person = response
    })
  }


  public get getEmail() {
    return this.agenteService.email as string
  }

  private buscarFuncionario() {
    this.funcionarioService.buscarUm(this.getPessoaId).pipe(
      finalize((): void => {
        console.log(this.profissional)
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.profissional = response
        this.verFoto(response.foto_efectivo)
      }
    })
  }
  private verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

      }),
      takeUntil(this.destroy$)
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

  }


  private get getPessoaId() {
    return this.agenteService?.id
  }



  public imprimir = (cv: any) => {

    const paraImprir: any = document.querySelector(`#${cv}`)
    if (paraImprir) {
      document.body.innerHTML = paraImprir.outerHTML
      window.print()
      window.location.reload()
    }
  }

  public setPerson(item: any) {
    this.p = item;
    console.log(item)

  }

  setNullPerson() {
    this.p = null;
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
