import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssociarGrupoComGrupoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-grupo-com-grupo/associar-grupo-com-grupo.service';

@Component({
  selector: 'app-ver-associacao-grupos',
  templateUrl: './ver-associacao-grupos.component.html',
  styleUrls: ['./ver-associacao-grupos.component.css']
})
export class VerAssociacaoGruposComponent implements OnInit {
  grupoData: any;
  grupoId: any;

  constructor(
    private grupoService: AssociarGrupoComGrupoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Captura o ID da rota (caso esteja usando rotas com parâmetros)
    this.grupoId = this.route.snapshot.paramMap.get('id');
    if (this.grupoId) {
      this.carregarDados(this.grupoId);
    }
  }

  carregarDados(id: any): void {
    this.grupoService.ver(id).subscribe({
      next: (data) => {
        this.grupoData = data;
        console.log('Dados do Grupo:', this.grupoData);
      },
      error: (err) => {
        console.error('Erro ao buscar dados do grupo:', err);
      }
    });
  }
}
