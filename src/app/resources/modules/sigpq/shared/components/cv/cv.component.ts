import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { CursosService } from '@resources/modules/sigef/core/service/cursos.service';
import { CargosService } from '@resources/modules/sigpq/core/service/Cargos.service';
import { CursoFuncionarioService } from '@resources/modules/sigpq/core/service/Curso-Funcionario.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit, OnChanges, OnDestroy {

  public patentes: any = []
  public funcionario: any = null
  public cargos: any = null
  public cursos: any = null
  public carregando: boolean = false

  @Input() public agenteId: any = null

  public destroy$ = new Subject<void>()
  constructor(private route: ActivatedRoute,
    private funcionarioService: FuncionarioService,
    private cargoService: CargosService,
    private cursoFuncionariosService: CursoFuncionarioService,
    private provimentoService: ProvimentoService,
    private formatarData: FormatarDataHelper) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agenteId'].currentValue != changes['agenteId'].previousValue && this.agenteId != null) {
      this.comporCV()
    }
  }

  private comporCV() {
    this.carregando = true;
    forkJoin([
      this.funcionarioService.buscarUm(this.getId),
      this.cargoService.listar({ pessoafisicaId: this.getId }),
      this.provimentoService.listarTodos({ pessoa_id: this.getId }),
      this.cursoFuncionariosService.listarTodos({ pessoafisica_id: this.getId })

    ]).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {
        this.carregando = false;

        console.log(this.funcionario)
      })
    ).subscribe({
      next: ([funcionario, cargos, provimentos, cursos]) => {
        this.funcionario = funcionario
        this.cargos = cargos
        this.patentes = provimentos
        this.cursos = cursos
      }
    })
  }

  private get getId() {
    return this.agenteId
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


}
