import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { QueixaService } from '@resources/modules/sigiac/core/service/Queixa.service';
import { Funcionario } from '@shared/models/Funcionario.model';
@Component({
  selector: 'sigiac-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {

  dadosForm!: FormGroup;
  public receiveDatas?: Funcionario
  public isLoading: boolean = false
  constructor(private fb: FormBuilder,
    private queixaServico: QueixaService,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm() 
  }

  createForm() {
    this.dadosForm = this.fb.group({
      id: [null],
      natureza_infrancao: [null, [Validators.required]],
      nome_completo: [null, [Validators.required]],
      apelido: [null, [Validators.required]],
      data_nascimento: [null, [Validators.required]],
      genero: [null, [Validators.required]],
      estado_civil: [null, [Validators.required]],
      naturalidade: [null, [Validators.required]],
      residencia_bi: [null, [Validators.required]],
      bi_ou_cedula: [null, [Validators.required]],
      validade_bi	: [null, [Validators.required]],
      nome_pai: [null, [Validators.required]],
      nome_mae: [null, [Validators.required]],
      ocupacao: [null, [Validators.required]],
      residencia_atual: [null, [Validators.required]],
      contactos: [null, [Validators.required]],
      obs: [null]
    });
  }

  getAcused(item: Funcionario) {
    this.receiveDatas = item

  }

 
  registrar() {
    const nome_funcionarioInput = document.getElementById('nome_funcionario') as HTMLInputElement;
    const nome_funcionario = nome_funcionarioInput?.value || '';

    const nip_funcionarioInput = document.getElementById('nip_funcionario') as HTMLInputElement;
    const nip_funcionario = nip_funcionarioInput?.value || '';

    const genero_funcionarioInput = document.getElementById('genero_funcionario') as HTMLInputElement;
    const genero_funcionario = genero_funcionarioInput?.value || '';
   
    const orgao_funcionarioInput = document.getElementById('orgao_funcionario') as HTMLInputElement;
    const orgao_funcionario = orgao_funcionarioInput?.value || '';

    const patente_nome_funcionarioInput = document.getElementById('patente_nome_funcionario') as HTMLInputElement;
    const patente_funcionario = patente_nome_funcionarioInput?.value || '';  

    const apelido_funcionarioInput = document.getElementById('apelido_funcionario') as HTMLInputElement;
    const apelido_funcionario = apelido_funcionarioInput?.value || '';  

    const inputs = {
      //dados acusado
      id_acusado: this.receiveDatas?.id,
      nome_funcionario: nome_funcionario,
      nip_funcionario: nip_funcionario,
      orgao_funcionario: orgao_funcionario,
      patente_funcionario: patente_funcionario,
      genero_funcionario: genero_funcionario,
      apelido_funcionario: apelido_funcionario,
      //dados queixa
      obs: this.dadosForm.value.obs,
      natureza_infrancao: this.dadosForm.value.natureza_infrancao,
      //dados cidadao
      nome_completo: this.dadosForm.value.nome_completo,
      apelido: this.dadosForm.value.apelido,
      data_nascimento: this.dadosForm.value.data_nascimento,
      genero: this.dadosForm.value.genero,  
      estado_civil: this.dadosForm.value.estado_civil,
      naturalidade: this.dadosForm.value.naturalidade,
      residencia_bi: this.dadosForm.value.residencia_bi,
      bi_ou_cedula: this.dadosForm.value.bi_ou_cedula,
      validade_bi: this.dadosForm.value.validade_bi,
      nome_pai: this.dadosForm.value.nome_pai,
      nome_mae: this.dadosForm.value.nome_mae,
      ocupacao: this.dadosForm.value.ocupacao,
      residencia_atual: this.dadosForm.value.residencia_atual,
      contactos: this.dadosForm.value.contactos
    }
   // alert(this.receiveDatas?.id)
   //alert(this.dadosForm.invalid)
  //if (!this.dadosForm.invalid || inputs.genero == "0" || inputs.naturalidade == "0") {
    if (inputs.genero == "0" || inputs.naturalidade == "0") {
      alert("não pode submeter campos vazios!")
      return
    }

     

    if (!this.receiveDatas || this.receiveDatas == undefined) {
      if (!inputs.obs) {
        alert("Acusado não foi encontrado?, informe detalhes no campo de observação!")
        return
      }else{
        if(!inputs.bi_ou_cedula){
          $('#error-bi').show(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
        }else if(!inputs.nome_completo){
          $('#error-nome').show(); 
          $('#error-bi').hide();  
        }else if(!inputs.contactos){
          $('#error-nome').hide(); 
          $('#error-contactos').show(); 
        }else if(!inputs.data_nascimento){
          $('#error-nascimento').show(); 
          $('#error-naturalidade').hide(); 
          $('#error-bi').hide(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
        }else if(!inputs.naturalidade){
          $('#error-naturalidade').show(); 
          $('#error-bi').hide(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
          $('#error-nascimento').hide(); 

        }else if(!inputs.residencia_atual){
          $('#error-residencia_atual').show(); 
          $('#error-nascimento').hide(); 
          $('#error-naturalidade').hide(); 
          $('#error-bi').hide(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
        }else if(!inputs.natureza_infrancao){
          $('#error-natureza_infrancao').show(); 
          $('#error-residencia_atual').hide(); 
          $('#error-nascimento').hide(); 
          $('#error-naturalidade').hide(); 
          $('#error-bi').hide(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
        }else{
          $('#error-natureza_infrancao').hide(); 
          $('#error-nome').hide(); 
          $('#error-contactos').hide(); 
          $('#error-residencia_atual').hide();    
          $('#error-nascimento').hide(); 
          $('#error-naturalidade').hide();  
          $('#error-bi').hide(); 
          //Enviando os dados
          this.queixaServico.registrar(inputs)
          .subscribe((value) => {
           // this.router.navigate(['/piips/sigiac/queixa/listagem'])
          })
       //   alert(inputs.nome_completo) 
        }
      }

      /*this.queixaServico.registrar(inputs)
        .subscribe((value) => {
          this.router.navigate(['/piips/sigiac/queixa/listagem'])
          
        })
        
      return */
    }else if(!inputs.bi_ou_cedula){
      $('#error-bi').show(); 
      $('#error-nome').hide(); 
      $('#error-contactos').hide(); 
    }else if(!inputs.nome_completo){
        $('#error-nome').show(); 
        $('#error-bi').hide(); 
        $('#error-nome').hide();  
      }else if(!inputs.contactos){
        $('#error-nome').hide(); 
        $('#error-contactos').show(); 
      }else if(!inputs.naturalidade){
        $('#error-naturalidade').show(); 
        $('#error-bi').hide(); 
        $('#error-nome').hide(); 
        $('#error-contactos').hide(); 
        $('#error-nascimento').hide(); 

      }else if(!inputs.data_nascimento){
        $('#error-nascimento').show(); 
        $('#error-naturalidade').hide(); 
        $('#error-bi').hide(); 
        $('#error-nome').hide(); 
        $('#error-contactos').hide(); 
      }else if(!inputs.residencia_atual){
        $('#error-residencia_atual').show(); 
        $('#error-nascimento').hide(); 
        $('#error-naturalidade').hide(); 
        $('#error-bi').hide(); 
        $('#error-nome').hide(); 
        $('#error-contactos').hide(); 
      }else if(!inputs.natureza_infrancao){
        $('#error-natureza_infrancao').show(); 
        $('#error-residencia_atual').hide(); 
        $('#error-nascimento').hide(); 
        $('#error-naturalidade').hide(); 
        $('#error-bi').hide(); 
        $('#error-nome').hide(); 
        $('#error-contactos').hide(); 
      }else{
        $('#error-natureza_infrancao').hide(); 
        $('#error-nome').hide(); 
        $('#error-contactos').hide(); 
        $('#error-residencia_atual').hide();    
        $('#error-nascimento').hide(); 
        $('#error-naturalidade').hide();  
        $('#error-bi').hide(); 
        //Enviando os dados
        //$('#btn-enviar-formulario-queixa').hide;
        this.queixaServico.registrar(inputs)
        .subscribe((value) => {
         // this.router.navigate(['/piips/sigiac/queixa/listagem'])
        })
     //   alert(inputs.nome_completo) 
      }
  }
  


}
