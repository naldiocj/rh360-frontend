import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AssociarDelituosoComDelituoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-delituoso-com-delituoso.service';
import { AssociarGrupoComGrupoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-grupo-com-grupo/associar-grupo-com-grupo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-associacao-grupos',
  templateUrl: './listar-associacao-grupos.component.html',
  styleUrls: ['./listar-associacao-grupos.component.css']
})
export class ListarAssociacaoGruposComponent implements OnInit {
  isLoading!: boolean;
  totalBase: any;
  pagination: any;
  associacaoGrupos: any;
  public isOffcanvasVisible: number | any;
  public isOffVisible: number | any;
  @Input() searchDelituoso = '';

  constructor(
    private cdRef: ChangeDetectorRef,
    private associarGrupos: AssociarGrupoComGrupoService) { }


  ngOnInit() {
    this.buscarAssociacao()
  }

  buscarAssociacao() {
    this.isLoading = true;
    this.associarGrupos.listarTodos({}).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: any) => {
      this.associacaoGrupos = response;
      this.cdRef.detectChanges();
      // Verifique se `response.meta` está definido
      if (response.meta) {
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      } else {
        console.warn("A estrutura da resposta não contém 'meta'.");
        // Trate o caso onde `meta` não está definido, se necessário
      }


    });
}




public toggle(id: any): void {
  // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


  const main: HTMLElement | any = document.querySelector('#main_');
  const asidebar: HTMLElement | any = document.querySelector('#asidebar');

  if (main && asidebar) {
    let asideLeft: string | any = asidebar.style.right;
    let mainLeft: string | any = main.style.marginRight;
    if (this.isOffcanvasVisible == id) {
      this.isOffcanvasVisible = null;
      this.isOffcanvasVisible == id;

      if (asideLeft == '' || asideLeft == '0px') {
        asideLeft = '-300px';
        mainLeft = '0px';
      }
      // Alterna a visibilidade
    } else if (this.isOffcanvasVisible != id) {
      this.isOffcanvasVisible = id; // Abre o novo sidebar e fecha o anterior

      asideLeft = '0px';
      mainLeft = '400px';
    }
    asidebar.style.right = asideLeft;
    main.style.marginRight = mainLeft;
  }
}


//INTERVENIENT
public KV(id: any): void {
  // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir~~
  console.log('antes : ', id);

  // if (this.isOffcanvasVisible === id) {
  this.isOffVisible = id;

  // Alterna a visibilidade
  // }

}
}
