import { Component, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { AuthService } from '@core/authentication/auth.service';
import { HelpingService } from '../../core/helping.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { DashboardService } from '../../core/service/dashboard.service';
import { ArmaService } from '../../core/service/arma.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public dashboard: any;
  public pontos: any = 0;
  public explosivos: any;
  Total: any;
  organicas: any;
  municoes: any;
  recolha: any;
  estraviadas: any;
  entrada: any;
  crime: any;
  caca: any;
  defesa: any;
  convenio: any;
  desportiva: any;
  empresa: number = 0;
  variavel: any = [];
  is!: number;
  db: any;
  listas: any;
  public provincia:any;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  public armas: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public id: number = 0;

  constructor(
    private per: AuthService,
    private help: HelpingService,
    private toast:IziToastService,
    private arma:ArmaService,
    private dash:DashboardService
  ) {}

  ngOnInit(): void {
    this.iniciarDashboard();
    this.filtro.orgao_id = this.per.orgao.sigla;
    this.is = this.help.isUser;
    this.pontos ? 0 : this.pontos;
    this.help.DataPorIp().subscribe({
      next:async (rep: any) => {
     //   console.log(await rep);
        this.provincia = rep;
      },
      error:()=>{
  this.toast.alerta('Não foi possivel pegar a provincia');
      }
    });
  }

  public get getModulo() {
    return `${this.per.orgao?.sigla} - ${this.per.orgao?.nome_completo}`;
  }

  public iniciarDashboard(){

    this.filtro.orgao_id = this.per.orgao.sigla;
   this.dash.listar(this.filtro).subscribe({
    next:(p)=>{
      console.log(p);
      let dashboard = {
        'explosivos':p.explosivos,
        'Total':p.Total,
        'organicas':p.organicas,
        'municoes':p.municoes,
        'recolha':p.recolha,
        'estraviadas':p.estraviadas,
        'entrada':p.entrada,
        'crime':p.crime,
        'caca':p.caca,
        'defesa':p.defesa,
        'convenio':p.convenio,
        'desportiva':p.desportiva,
        'empresa':null,
        'variavel':p.variavel
      };
      this.setDashboard(dashboard);
    },
    error:()=>{
      this.toast.alerta('Não foi possivel lista o dahsboard');
    }
   })


  }

   public setData(){
         //organicas
         this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.classificacao_id == 3);
          this.organicas = item.length;
        });
        this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.classificacao_id == 1);
          this.crime = item.length;
        });
    
        this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.classificacao_id == 2);
          this.entrada = item.length;
        });
    
        this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.categoria == 3);
          this.empresa = item.length;
        });
    
        this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.classificacao_id == 4);
          this.recolha = item.length;
        });
    
        this.listas = this.arma.filtrar().subscribe((e: any) => {
          var item = e.filter((gun: any) => gun.classificacao_id == 5);
          this.estraviadas = item.length;
        });
   }

  public setDashboard(data:any) {
    this.dashboard = [
      {
        total: data.Total,
        nome: 'Total de Armas',
        url: '/piips/sigae/armas',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },

      {
        total: data.explosivos,
        nome: 'Total de Explosivos',
        url: '/piips/sigae/explosivo',
        icon: '../../../../../../assets/img/icons do sigae/Explosive.png',
canSee:true
      },
      {
        total: data.municoes,
        nome: 'Total de Munições',
        url: '/piips/sigae/municoes',
        icon: '../../../../../../assets/img/icons do sigae/Rifle Magazine.png',
canSee:true
      },
      {
        total: data.caca,
        nome: 'Armas de Caça',
        url: '/piips/sigae/armas-caca',
        icon: '../../../../../../assets/img/icons do sigae/Sniper Rifle .png',
canSee:true
      },
      {
        total: data.crime,
        nome: 'Envolvidas em Crimes',
        url: '/piips/sigae/armas-crime',
        icon: '../../../../../../assets/img/icons do sigae/No Weapons.png',
canSee:true
      },
      {
        total: data.organicas,
        nome: 'Armas Organicas',
        url: '/piips/sigae/armas-organica',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },
      {
        total: data.entrada,
        nome: 'Armas de Entrega Voluntaria',
        url: '/piips/sigae/armas-entrada',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },
      {
        total: data.recolha,
        nome: 'Armas de Recolha Coersiva',
        url: '/piips/sigae/armas-recolha',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },
      {
        total: data.estraviadas,
        nome: 'Armas de Extravio',
        url: '/piips/sigae/armas-estraviada',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
        canSee:true
      },
      {
        total: data.desportiva,
        nome: 'Armas de Desportivas',
        url: '/piips/sigae/armas-desportivas',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },
      {
        total: data.defesa,
        nome: 'Armas de Defesa Pessoal',
        url: '/piips/sigae/armas-defesa',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
canSee:true
      },
      {
        total: data.convenio,
        nome: 'Armas de Convenio com a FAA',
        url: '/piips/sigae/armas-convenio',
        icon: '../../../../../../assets/img/icons do sigae/Sniper Rifle .png',
canSee:true
      },
 
    ];
  }
}
