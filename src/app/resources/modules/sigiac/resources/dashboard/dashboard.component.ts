import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';  

@Component({
  selector: 'app-sigpq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public isLoading: boolean = false

  chart: any = {
    documentoPendente:  {
      total: 0,
      nome: "Documentos Pendentes"
    },
    disciplinar: {
      total: 0,
      nome: "Processo Disciplinar"
    },
    reclamacao:  {
      total: 0,
      nome: "Reclamações"
    },
    diverso:  {
      total: 0,
      nome: "Processos Diversos"
    },
   
  }
 
  constructor() { }

  ngOnInit(): void {



  } 
 

} 