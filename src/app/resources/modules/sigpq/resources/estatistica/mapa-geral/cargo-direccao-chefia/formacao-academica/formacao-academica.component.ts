import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-formacao-academica',
  templateUrl: './formacao-academica.component.html',
  styleUrls: ['./formacao-academica.component.css']
})
export class FormacaoAcademicaComponent implements OnInit {

  constructor(private apiEstatistica:EstatisticasService ) { }
  defaluValue:boolean=false;
  formacaoAcademica:boolean=this.defaluValue;
  composicaosFormacao:any
  ngOnInit(): void {
    this.loadDados()
  }


  toggleformacaoAcademica(){
    this.formacaoAcademica=!this.formacaoAcademica
  }

  loadDados()
  {
    this.apiEstatistica.listar_todos_formacao_academica().pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response)
      this.composicaosFormacao=response
    })
  }

 // Objeto inicial 'dados'
 dados = { phd: 0, mest: 0, lice: 0, doutor: 0 };

// Função para verificar o valor e somar ao campo correto
 hasValue(value:number, defalt:String = '') {
  // Define o valor a ser somado (caso o valor seja válido)
  const valorSomar = value ? value : 0;

  // Verifica qual é o campo com base no 'default' e atualiza o objeto 'dados'
  switch (defalt.toLowerCase()) {
    case 'phd':
      this.dados.phd += valorSomar;
      break;
    case 'mest':
    case 'mestrado':
      this.dados.mest += valorSomar;
      break;
    case 'lice':
    case 'licenciatura':
      this.dados.lice += valorSomar;
      break;
    case 'doutor':
      this.dados.doutor += valorSomar;
      break;
    default:
      // Se o 'default' não for reconhecido, não faça nada ou retorne uma mensagem
      console.warn(`Tipo não reconhecido: ${defalt}`);
      break;
  }

  return valorSomar;
}




}
