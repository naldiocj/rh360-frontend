import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'sigvest-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges{
  @Input() estatistica!: any[];
  box = [
    {
      titulo:"Plano de Necessidades",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-clipboard2-data-fill",
      link:'/piips/sigvest/planificacao/plano-de-necessidades/listar'
    },
    {
      titulo: "Planificações de Distribuição",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-clipboard2-data-fill",
      link:'/piips/sigvest/planificacao/plano-de-distribuicao'
    },
    {
      titulo: "Total de Fornecimentos",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-house-down-fill",
      link:'/piips/sigvest/abastecimento/fornecimento-minint'
    },
    {
      titulo: "Total de Distribuições",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-house-up-fill",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Total de Dotações",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-people-fill",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Solicitações de reforço",
      dados: 20,
      colour: '#041b4e',
      icone: "fa fa-sign-language",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo:"Total Tipos de Meios",
      dados: 20,
      colour: '#041b4e',
      icone: "bi bi-dribbble",
      link:'/piips/sigvest/configuracoes/tipo-de-meios'
    },
    {
      titulo: "Estatística",
      dados: 20,
      colour: '#198754',
      icone: "bi bi-box2-fill",
      link:'/piips/sigvest/estatistica'
    },
    {
      titulo: "Meios descartados",
      dados: 20,
      colour: '#dc3545',
      icone: "bi bi-trash-fill",
      link:'/piips/sigvest/dashboard'
    },
  ]

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estatistica']) {
      //console.log('A lista foi alterada:', changes['estatistica'].currentValue);
      //this.percorrerObjeto(this.estatistica)
    }
  }

  ngOnInit(): void {
    //this.percorrerObjeto(this.estatistica)
  }


  percorrerObjeto(obj:any) {
    //let caixa: HTMLElement | any = document.querySelector('#imgpreview')
    //this.total = obj.total_abastecimento.total
    this.box = [
      {
        titulo: "Total de Abastecimentos",
        dados: obj.total_abastecimento?.total ?? 0,
        colour: '#041b4e',
        icone: "bi bi-house-down-fill",
        link:'/piips/sigv/abastecimento/externo/listar'
      },
      {
        titulo: "Total de Distribuições",
        dados: obj.total_distribuicao?.total ?? 0,
        colour: '#041b4e',
        icone: "bi bi-house-up-fill",
        link:'/piips/sigv/distribuicao/comandos-orgaos/listar'
      },
      {
        titulo: "Total de Dotações",
        dados: obj.total_dotacao?.total,
        colour: '#041b4e',
        icone: "bi bi-people-fill",
        link:'/piips/sigv/distribuicao/dotacao/listar'
      },
      {
        titulo: "Solicitações de reforço",
        dados: obj.total_pedidos?.total ?? 0,
        colour: '#041b4e',
        icone: "fa fa-sign-language",
        link:'/piips/sigv/pedido/listar'
      },
      {
        titulo:"Total de Planificações",
        dados: obj.total_planos?.total ?? 0,
        colour: '#041b4e',
        icone: "bi bi-clipboard2-data-fill",
        link:'/piips/sigv/planificacao'
      },
      {
        titulo:"Total Grupos Calóricos",
        dados: obj.total_grupo_calorico?.total ?? 0,
        colour: '#041b4e',
        icone: "bi bi-cup-hot-fill",
        link:'/piips/sigv/categoria/listar'
      },
      {
        titulo: "Produtos Abastecidos",
        dados: obj.total_produtos_abastecido?.total ?? 0,
        colour: '#041b4e',
        icone: "bi bi-info-circle",
        link:'/piips/sigv/dashboard'
      },
      {
        titulo: "Produtos em reserva",
        dados: obj.total_reserva?.total ?? 20,
        colour: '#198754',
        icone: "bi bi-box2-fill",
        link:'/piips/sigv/estoque'
      },
      {
        titulo: "Produtos descartados",
        dados: obj.total_produtos_descartados?.total ?? 20,
        colour: '#dc3545',
        icone: "bi bi-trash-fill",
        link:'/piips/sigv/dashboard'
      },
    ]
  }
  //imagens= ['', '']; fa fa-truck
 /*  cartoes = [
    {titulo: 'Total de Abastecimento',   total: 120,   col:'col-3', cor: '#041b4e', icon: 'bi bi-house-down-fill',  rota: '/piips/sigv/abastecimento'},
    {titulo: 'Total de Distribuições',  total: 504 ,   col:'col-3', cor: '#041b4e', icon: 'bi bi-house-up-fill',  rota: '/piips/sigv/distribuicao/listar'},
    /* {titulo: 'Total de Produtos Abastecido existente',   total: 14500,   col:'col-4', cor: '#041b4e', icon: 'bi bi-folder-fill', rota: '/piips/sigv/abastecimento'}, */
    /* {titulo: 'Total de Produtos Distribuido',  total: 12560 ,   col:'col-4', cor: '#041b4e', icon: 'bi bi-archive-fill', rota: '/piips/sigv/abastecimento'}, */
    /* {titulo: 'Total de Dotações',   total: 101,   col:'col-3', cor: '#041b4e', icon: 'fa fa-users', rota: '/piips/sigv/abastecimento'},
    {titulo: 'Total de Produtos em Reserva',   total: 1490 , col:'col-3', cor: '#198754', icon: 'bi bi-archive-fill', rota: '/piips/sigv/abastecimento'},
    {titulo: 'Total de Produtos Descartado',   total: 200 ,  col:'col-3', cor: '#dc3545', icon: 'bi bi-trash-fill', rota: '/piips/sigv/abastecimento'},
    {titulo: 'Total de Pedidos / Requisições', total: 788 ,  col:'col-3', cor: '#041b4e', icon: 'fa fa-sign-language', rota: '/piips/sigv/pedido/listar'},
    {titulo: 'Total de Grupos Calóricos/ PNA',      total: 20 ,  col:'col-3', cor: '#041b4e', icon: 'fa fa-coffee', rota: '/piips/sigv/categoria/listar'},
    {titulo: 'Total de Planificações / PNA', total: 98 ,  col:'col-3', cor: '#041b4e', icon: 'fa fa-book', rota: '/piips/sigv/planificacao'}, */
    /* {titulo: 'Total de Fornecedores / PNA',    total: 24 , col:'col-4', cor: '#041b4e', icon: 'bi bi-truck-front-fill', rota: '/piips/sigv/abastecimento'}, */
 /*  ]; */
}