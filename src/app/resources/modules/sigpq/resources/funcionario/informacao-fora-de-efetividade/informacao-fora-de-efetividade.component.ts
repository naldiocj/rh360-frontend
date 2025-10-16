import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FuncionarioService } from '../../../../../../core/services/Funcionario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuncionarioHistoricoEstadoService } from '../../../../../../core/services/Funcionario-historico-estado.service';

@Component({
  selector: 'sigpq-informacao-fora-de-efetividade',
  templateUrl: './informacao-fora-de-efetividade.component.html',
  styleUrls: ['./informacao-fora-de-efetividade.component.css']
})
export class InformacaoForaDeEfetividadeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,private funcionarioServico: FuncionarioService,private funcionariohistoricoestado:FuncionarioHistoricoEstadoService) {
      /* this.inicializarFormulario(); */
      this.formulario = this.fb.group({
        data_inicio_inatividadeData: [this.agenteSelecionado?.data_inicio_inatividade || '', [Validators.required]],
        duracao_inatividade: [this.agenteSelecionado?.duracao_inatividade||'']
      });
     }



  @Output() eventSucesso = new EventEmitter<boolean>();
  @Input() agenteSelecionado:any
  @Input() propositoModal:'visualizar'|'atualizar'|'retomar'='visualizar'
  formulario!: FormGroup;
  duracaoInvalida: boolean = false;
  dataInvalida: boolean = false;

  ngOnInit() {
    this.data_inicio_inatividadeData=''
    this.duracao_inatividade=''
  }

  resetForm() {
    this.formulario.reset();
    this.data_inicio_inatividadeData = '';
    this.duracao_inatividade = '';
  }


  calcularFimInatividade(data_inicio:string,duracao:number):string
  {
     if(duracao==-1) return "Sem data"
     else if(duracao>0)
     {
      return this.calcularDataFinal(data_inicio,duracao)
     }
     return "S/N"
  }

  calcularDataFinal(dataInicial: string, duracaoDias: number): string {
    // Converte a string da data inicial em um objeto Date
    const [dia, mes, anoHora] = dataInicial.split('/');
    const [ano, hora] = anoHora.split(' ');

    const data = new Date(`${ano}-${mes}-${dia}T${hora}`); // Formato: yyyy-mm-ddTHH:mm:ss

    // Adiciona a duração em dias
    data.setDate(data.getDate() + duracaoDias);

    // Formata a data final de volta para o formato desejado
    const diaFinal = String(data.getDate()).padStart(2, '0');
    const mesFinal = String(data.getMonth() + 1).padStart(2, '0'); // Os meses em JavaScript começam do zero
    const anoFinal = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    return `${diaFinal}/${mesFinal}/${anoFinal} ${horas}:${minutos}:${segundos}`;
}

data_inicio_inatividadeData:string='';
data_inicio_inatividadeHora:string='';
duracao_inatividade:string='';
data_inicio_inatividade:any;

updateAgentes()
     {
       this.eventSucesso.emit(true);
     }

editarEstado(id: any) {
     {
      const data_inicio_inatividade = new Date(this.formulario.value.data_inicio_inatividadeData).toISOString().split("T")[0]
      const duracao_inatividade = this.formulario.value.duracao_inatividade;

      const formData = new FormData();
      formData.append('data_inicio_inatividade', data_inicio_inatividade);
     if(this.propositoModal=='atualizar') formData.append('duracao_inatividade', duracao_inatividade.toString());
     if(this.propositoModal=='retomar'){
      formData.append('sigpq_situacao_id', '1');
      formData.append('sigpq_estado_reforma_id', 'null');
      formData.append('sigpq_estado_id', 'null');
      formData.append('duracao_inatividade', 'null');
     }

     if(this.propositoModal=='retomar') this.registarHistorico(id, formData);
     else this.funcionarioServico.editarEstado(id, formData).subscribe(
        (response) => {
          this.updateAgentes()
        },
        (error) => {
          console.error("Erro ao editar estado:", error);
        }
      );
    }
  }

validarData() {
  const hoje = new Date();
  const dataInatividade = new Date(this.data_inicio_inatividadeData);

  // Verifica se a data está no futuro
  this.dataInvalida = this.propositoModal=='atualizar'?dataInatividade > hoje:dataInatividade < hoje;
}

validarDuracao() {
  const duracao = Number(this.duracao_inatividade);
  this.duracaoInvalida = (isNaN(duracao) || duracao <= 0);
}

registarHistorico(id:string, _formData:any)
{
      const formData = new FormData();
      const data_inicio_inatividade = new Date( this.agenteSelecionado.data_inicio_inatividade|| this.agenteSelecionado.updated_at).toISOString();
      formData.append('data_inicio_inatividade', data_inicio_inatividade);
      formData.append('duracao_inatividade', this.agenteSelecionado.duracao_inatividade);
      formData.append('sigpq_situacao_id', this.agenteSelecionado.sigpq_situacao_id);
      formData.append('sigpq_estado_reforma_id', this.agenteSelecionado.sigpq_estado_reforma_id);
      formData.append('sigpq_estado_id', this.agenteSelecionado.sigpq_estado_id);
      formData.append('pessoafisica_id', this.agenteSelecionado.id);
  this.funcionariohistoricoestado.registar(formData).subscribe(
    (response)=>{
      this.restaurarEfetividade(id, _formData);
    }
    ,
    (error)=>{
      console.log("Não foi possível cadastrar o historico:",error)
    }
  )
}

restaurarEfetividade(id:string, _formData:any)
{
  const formData = new FormData();
      const data_inicio_inatividade = new Date(this.formulario.value.data_inicio_inatividadeData).toISOString();
      formData.append('data_inicio_inatividade', data_inicio_inatividade);
      formData.append('duracao_inatividade', 'null');
      formData.append('sigpq_situacao_id', '1');
      formData.append('sigpq_estado_reforma_id', 'null');
      formData.append('sigpq_estado_id', 'null');
      formData.append('pessoafisica_id', this.agenteSelecionado.id);
  this.funcionariohistoricoestado.registar(formData).subscribe(
    (response)=>{
      this.funcionarioServico.editarEstado(id, formData).subscribe(
        (response) => {
          this.updateAgentes()
        },
        (error) => {
          console.error("Erro ao editar estado:", error);
        }
      );
    }
    ,
    (error)=>{
      console.log("Não foi possível cadastrar o historico:",error)
    }
  )
}


}
