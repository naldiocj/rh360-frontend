import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../core/service/cursos.service';
import { FormadoresService } from '../../core/service/formadores.service';
import { InstituicoesService } from '../../core/service/instituicoes.service';
import { options } from '@fullcalendar/core/preact';
import { AlistadoService } from '../../core/service/alistado.service';
import { InstruendoService } from '../../core/service/instruendos.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AuthService } from '@core/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public dashboards: any;
  public getTotal: number = 0;
  public total: number=0;
  public Total!: number;
  public Cursos: any = 0;
  public instituicoes: any = 0;
  public Formadores: any = 0;
  public Alistados: any = 0;
  public Formandos: any = 0;
  public Instruendo: any = 0;
  public Disciplinas: any = 0;
  public especial: any = 0;
  public geral: any = 0;

  constructor(
    private cursosService: CursosService,
    private FormadoresService: FormadoresService,
    private InstituicoesService: InstituicoesService,
    private AlistadosService: AlistadoService,
    private per: AuthService,
    private router:Router

  ) {}

  ngOnInit(): void {
    this.setDashboard();
    this.getCursos();
    this.getFormadores();
    this.getInstituicao();
    this.Instruendo();
  }

  public get getModulo() {
    return `${this.per.orgao?.sigla} - ${this.per.orgao?.nome_completo}`;
  }

  getCursos(): void {
    this.cursosService.listar(options).subscribe((data) => {
      this.Cursos = data;
      this.getTotal = this.Cursos.length;
      console.log(this.Cursos.length);
    });
  }

  getFormadores(): void {
    this.FormadoresService.listar(options).subscribe((data) => {
      this.Formadores = data;
      this.getTotal = this.Formadores.length;
      console.log(this.Formadores.length);
    });
  }

  getAlistados(): void {
    this.AlistadosService.listar(options).subscribe((data) => {
      this.Alistados = data;
      this.getTotal = this.Alistados.length;
      console.log(this.Alistados.length);
    });
  }

  getInstruendo(): void {
    this.AlistadosService.listar(options).subscribe((data) => {
      this.Instruendo = data;
      this.getTotal = this.Alistados.length;
      console.log(this.Instruendo.length);
    });
  }

  getInstituicao(): void {
    this.InstituicoesService.listar(options).subscribe((data) => {
      this.instituicoes = data;
      this.getTotal = this.instituicoes.length;
      console.log(this.instituicoes.length);
    });
  }

  public get ano() {
    var time = new Date();
    var data = time.getFullYear();
    return data;
  }

  
  public setDashboard() {
    this.dashboards = [
    
      {
        total: this.Formadores,
        nome: 'Total de Formadores',
        url: '/piips/sigef/formadores',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
     
      {
        total: this.Alistados,
        nome: 'Total de Alistados',
        url: '/piips/sigef/alistados',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.Instruendo,
        nome: 'Total de Instruedos',
        url: '/piips/sigef/instruendos',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.instituicoes,
        nome: 'Total de Intituicoes',
        url: '/piips/sigef/instituicoes',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.Cursos,
        nome: 'Total de Cursos',
        url: '/piips/sigef/cursos',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.Disciplinas,
        nome: 'Total de Disciplinas',
        url: '/piips/sigef/displinas',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.especial,
        nome: 'Total de Regime Especial',
        url: '/piips/sigef/regimeEspecia',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.geral,
        nome: 'Total de Regime Geral',
        url: '/piips/sigef/regimeGeral',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
      {
        total: this.geral,
        nome: 'Total de homens/mulheres',
        url: '/piips/sigef/alistados',
        icon: '../../../../../../assets/sigef/dashboard/Document Writer.png',
        canSee:true,
      },
    ];
  }

  public redirect(url:any){
    return this.router.navigate(['/piips'+url]);
  }
}
