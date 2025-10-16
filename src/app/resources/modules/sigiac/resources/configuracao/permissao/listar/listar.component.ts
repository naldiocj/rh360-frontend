import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '@resources/modules/sigpj/core/service/Perfil.service';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';
import { finalize } from 'rxjs';

// templateUrl: './listar.component.html',
@Component({
  selector: 'app-listar',
  template: `<br />`,
  styleUrls: []
})
export class ListarComponent implements OnInit {

  public funcionario:any
  public role:any
  permissionForm!:FormGroup
  constructor(private utilizadorService:UtilizadorService,
    private route:ActivatedRoute,
    private perfil:PerfilService) { }

  ngOnInit(): void {
    this.buscarUser()
  }

  public get getId() {
    return this.route.snapshot.params["id"] as number
  }

  buscarUser() {

    this.utilizadorService.verUm(this.getId).pipe(
      finalize(() => {

        //this.isLoading = false;
      })
    ).subscribe((response) => {
     // console.log("funcionario",response)

      this.funcionario = response
      this.buscarPerfil(response.role_id)

    });
  }

  buscarPerfil(perfil_id:number){
    const options= {}
    this.perfil.listar(options).pipe(
      finalize(()=>{})

    )
    .subscribe(response =>{

    for(const item of response){
      if(item.id == perfil_id ){
        this.role = item
        return
      }
    }
    })
  }

  onSubmit(){
    window.alert("Definido com Sucesso!")
  }

}
