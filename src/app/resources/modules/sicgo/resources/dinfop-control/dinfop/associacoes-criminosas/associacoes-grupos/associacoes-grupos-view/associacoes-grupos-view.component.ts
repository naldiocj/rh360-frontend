import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarGrupoComGrupoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-grupo-com-grupo/associar-grupo-com-grupo.service';

@Component({
  selector: 'sicgo-dinfop-associacoes-grupos-view',
  templateUrl: './associacoes-grupos-view.component.html',
  styleUrls: ['./associacoes-grupos-view.component.css']
})
export class AssociacoesGruposViewComponent implements OnInit {
  grupoData: any; 
  @Input() grupoId:  number = 0;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/kv.jpg';

  constructor(
    private ficheiroService: FicheiroService,
    private grupoService: AssociarGrupoComGrupoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

      this.carregarDados();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoId'] && this.grupoId) {
      this.carregarDados();
    }
  }

  carregarDados(): void {
    this.grupoService.ver(this.grupoId).subscribe({
      next: (data) => {
        this.grupoData = data;
        console.log('Dados do Grupo:', this.grupoData);
      },
      error: (err) => {
        console.error('Erro ao buscar dados do grupo:', err);
      }
    });
  }



  calculateAge(birthData: string | number | Date) {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      let idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
      }

      this.idade = idade;
    } else {
      alert('Por favor, insira uma data de nascimento válida.');
    }
  }
}
