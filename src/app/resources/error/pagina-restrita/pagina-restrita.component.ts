import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-pagina-restrita',
  templateUrl: './pagina-restrita.component.html',
  styleUrls: ['./pagina-restrita.component.css']
})
export class PaginaRestritaComponent implements OnInit {

  constructor(
    private secureService: SecureService
  ) { }

  ngOnInit(): void {
  }

  get usuario_nome_completo(): string {
    return this.secureService.getTokenValueDecode().user?.nome_completo || '';
  }

  public voltarParaPaginaAnterior (): void {
    history.go(-1);
  }
}
