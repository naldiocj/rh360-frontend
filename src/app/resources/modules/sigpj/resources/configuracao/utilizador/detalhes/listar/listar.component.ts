import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public funcionario:any 
 
  public isLoading: boolean = false 
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor(private utilizadorService:UtilizadorService ,
    private route: ActivatedRoute, 
    private router:Router,  
    ) { }

  ngOnInit(): void { 
    this.buscarUser() 
  }

  public get getId() {
    return this.route.snapshot.params["id"] as number
  }

  buscarUser() {

    this.utilizadorService.verUm(this.getId).pipe(
      finalize(() => {

        this.isLoading = false;
      })
    ).subscribe((response) => { 
     // console.log("disciplinar",response)
    
      this.funcionario = response

    });

  }
 
  


}
