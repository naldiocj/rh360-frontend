import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BiconsultaService, ConsultaResponse } from '@resources/modules/sicgo/core/service/piquete/dinfop/biconsulta/biconsulta.service';
import { Validators } from 'ngx-editor';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-busca-delituoso-bi',
  templateUrl: './busca-delituoso-bi.component.html',
  styleUrls: ['./busca-delituoso-bi.component.css']
})
export class BuscaDelituosoBiComponent implements OnInit {
  resultado: any;
  biNumber: string = '';
  isLoading: boolean = false;
  errorMessage: string = ''

  public dados: ConsultaResponse | null = null;
  private subscription!: Subscription;
  
  pesquisarDadosPessoaisForm:FormGroup = this.fb.group({
    name: ['', Validators.required],
    data_de_nascimento: ['2025-01-02', Validators.required],  // Data de nascimento
    pai: ['', Validators.required],  // Nome do pai
    mae: ['', Validators.required],  // Nome da mãe
    morada: ['', Validators.required],  // Morada
    emitido_em: ['', Validators.required],  // Emitido em
    type:['', Validators.required], 
  })

 

  constructor(private consultaService: BiconsultaService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
 
 }

 ngOnDestroy(): void {
   // Cancelar a assinatura ao destruir o componente
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }

 
 consultar() {
  if (this.biNumber.trim() === '') {
    this.errorMessage = 'O número do Bilhete de Identidade não pode ser vazio.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';  // Limpar qualquer erro anterior

  this.consultaService.consultarBI(this.biNumber).subscribe(
    (data) => {
      this.isLoading = false;
      this.pesquisarDadosPessoaisForm.patchValue({
        name: data.name, 
        data_de_nascimento: data.data_de_nascimento,  // Data de nascimento
        pai: data.pai,  // Nome do pai
        mae: data.mae,  // Nome da mãe
        morada: data.morada,  // Morada
        emitido_em: data.emitido_em,  // Emitido em

      })
      console.log('Resposta da API:', data.name);  // Exibe os dados retornados pela API
        this.resultado = data;
      
    },
    (error) => {
      this.isLoading = false;
      this.errorMessage = 'Erro ao consultar o Bilhete de Identidade. Tente novamente.';
      console.error('Erro na consulta:', error);
    }
  );
}






 

 // Método para formatar o tipo de consulta
 formatType(type: string): string {
  if (type === 'consulta de bilhete') {
    return 'Consulta de Bilhete';
  }
  return type;
}
}