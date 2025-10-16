
import { Component, OnInit } from '@angular/core';


import { AgenteService } from '../../core/service/agente.service';
import { finalize } from 'rxjs';
import { PerfilService } from '../../core/service/perfil.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilsHelper } from '@core/helper/utilsHelper';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfil: any
  public isLoading: boolean = false;
  public fileUrl: any
  public nome!: string
  public email!: string
  public pessoa: any
  public id!: number
  public activo!: boolean
  public options: any = {}


  constructor(private agenteSegure: AgenteService,
    private perfilService: PerfilService,
    private funcionarioService: FuncionarioService,
    public utilsHelper: UtilsHelper,
    private ficheiroService: FicheiroService) {
    this.nome = this.agenteSegure.name
    this.email = this.agenteSegure.email
    this.id = this.agenteSegure.id
    this.activo = this.agenteSegure.activo;
    this.options = {
      search: "",
      id: this.id
    }
  }


  public get getPessoaId() {
    return this.agenteSegure.id
  }


  ngOnInit(): void {

    // this.mostrarPerfil()
    this.buscarFuncionario()
  }

  mostrarPerfil() {
    this.isLoading = true;
    this.perfilService.listar(this.options).pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe((response) => {
      this.perfil = response
    })
  }


  public buscarFuncionario() {
    this.isLoading = true;
    this.funcionarioService.buscarUm(this.getPessoaId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.verFoto(response?.foto_efectivo)
        this.perfil = response
      }
    })
  }

  verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }

  public setPessoa(item: any) {
    this.pessoa = item;
  }

  public setNullPessoa() {
    this.pessoa = null;
  }
}
