import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssinaturaDigitalService } from '@resources/modules/sigpq/core/service/Assinatura-Digital.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-passe',
  templateUrl: './passe-profissional.component.html',
  styleUrls: ['./passe-profissional.component.css']
})
export class PasseProfissionalComponent implements OnInit, OnChanges {


  public isLoading = false
  public fileUrl: any = null
  public assinaturaUrl: any = null
  public assinatura: any = null
  @Input() public agente: any
  @Input() public imprimir: boolean = false
  @Output() public onFechar!: EventEmitter<void>


  constructor(private ficheiroService: FicheiroService, private assinaturaDigital: AssinaturaDigitalService) {
    this.onFechar = new EventEmitter<void>
  }

  ngOnInit(): void {
    this.buscarAssinatura()
  }
  public buscarAssinatura() {
    const options = {
      patente: 'Comissário-geral'
    }

    this.assinaturaDigital.listarTodos(options).pipe(
      finalize((): void => {

      })
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agente'].previousValue != changes['agente'].currentValue) {
      this.verFoto(this.agente?.foto_efectivo)
    }
  }


  verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.pessoaId,
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

  verAssinatura(assinatura: any): boolean | void {

    if (!assinatura) return false

    const opcoes = {
      pessoaId: assinatura?.pessoafisica_id,
      url: assinatura?.assinatura
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
      this.assinaturaUrl = this.ficheiroService.createImageBlob(file);
    });
  }

  public get pessoaId() {
    return this.agente?.pessoa_id
  }

  public isPatente(patente: number) {
    return patente <= 10
  }

  public fechar() {
    this.onFechar.emit()
    this.fileUrl = null
  }

  public imprim = (cv: any) => {
    const paraImprir: any = document.querySelector(`#${cv}`)
    if (paraImprir) {
      setTimeout(() => {
        document.body.innerHTML = paraImprir.outerHTML
        window.print()
        window.location.reload()
      }, 500)

    }
  }

  public toMaiscula(nome: string) {
    return nome?.toString()?.toUpperCase()
  }








}
