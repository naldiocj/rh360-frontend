import { Component, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { AuthService } from '@core/authentication/auth.service';
import { HelpingService } from '../../core/helping.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { DashboardService } from '../../core/service/dashboard.service';
import { AquartelamentoService } from '../../core/aquartelamento.service';
import { AquartelamentoAtribuirService } from '../../core/aquartelamento-atribuir.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardMaterialComponent implements OnInit {
  public dashboard: any;
  public pontos: any = 0;
  public explosivos: any;
  Total: any;
  organicas: any;
  extravio: any;
  expolho: any;
  crime: any;
  is!: number;
  db: any;
  listas: any;
  public provincia: any;
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
    private toast: IziToastService,
    private mat: AquartelamentoService,
    private materialAtribuido: AquartelamentoAtribuirService
  ) {}

  ngOnInit(): void {
    
    this.iniciarDashboard();
    this.is = this.help.isUser;
    this.pontos ? 0 : this.pontos;
    this.help.DataPorIp().subscribe({
      next: async (rep: any) => {
        //   console.log(await rep);
        this.provincia = rep;
      },
      error: () => {
        this.toast.alerta('Não foi possivel pegar a provincia');
      },
    });
  }

  public get getModulo() {
    return `${this.per.orgao?.sigla} - ${this.per.orgao?.nome_completo}`;
  }

  public iniciarDashboard() {
       this.setData();
  }

  public setData() {
    forkJoin({
      todosMateriais: this.mat.listar([]),
      extraviando: this.materialAtribuido.listar({ materialEstado: 'Extraviando' }),
      crime: this.materialAtribuido.listar({ materialEstado: 'Crime' }),
      Expolho: this.materialAtribuido.listar({ materialEstado: 'Expolho' }),
      atribuidos: this.materialAtribuido.listar([])
    }).subscribe({
      next: ({ todosMateriais, extraviando,crime,Expolho,atribuidos }) => {
        const totalItems = todosMateriais.filter((item: any) => item).length;
        const extravioItems = extraviando.filter((item: any) => item).length;
        const crimeTotal = crime.filter((item: any) => item).length;
        const expolhoTotal = Expolho.filter((item: any) => item).length;
        const totalAtribuidos = atribuidos.filter((item: any) => item).length;
  
        const dashboard = {
          Total: totalItems,
          extravio: extravioItems,
          crime: crimeTotal,
          expolho: expolhoTotal,
          atribuidos: totalAtribuidos,
        };
  
        this.setDashboard(dashboard);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
      }
    });
  }

  public setDashboard(data: any) {
    console.log(data)
    this.dashboard = [
      {
        total: data.Total || 0,
        nome: 'Total de Material de Aquartelamento',
        url: '/piips/sigae/aquartelamento-listar',
        icon: '../../../../../../assets/img/icons do sigae/Gun.png',
        canSee: true,
      },

      {
        total: data.atribuidos,
        nome: 'Total de Material atribuidos',
        url: '/piips/sigae/aquartelamento-atribuidos',
        icon: '../../../../../../assets/img/icons do sigae/Explosive.png',
        canSee: true,
      },
      {
        total: data.extravio || 0,
        nome: 'Total de Material extraviados',
        url: '/piips/sigae/aquartelamento-extravio',
        icon: '../../../../../../assets/img/icons do sigae/Explosive.png',
        canSee: true,
      },
      {
        total: data.expolho,
        nome: 'Total de Material em expolhos',
        url: '/piips/sigae/aquartelamento-expolho',
        icon: '../../../../../../assets/img/icons do sigae/Explosive.png',
        canSee: true,
      },

      {
        total: data.crime,
        nome: 'Total de Material em Crimes',
        url: '/piips/sigae/aquartelamento-crime',
        icon: '../../../../../../assets/img/icons do sigae/Explosive.png',
        canSee: true,
      },
    ];
  }
}
