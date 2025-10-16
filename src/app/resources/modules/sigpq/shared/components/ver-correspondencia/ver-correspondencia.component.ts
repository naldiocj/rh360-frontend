import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CorrespondenciaService } from '@resources/modules/sigpq/core/service/Corrrespondencia.service';
import { Subject, finalize} from 'rxjs';

@Component({
  selector: 'sigpq-ver-correspondencia',
  templateUrl: './ver-correspondencia.component.html',
  styleUrls: ['./ver-correspondencia.component.css']
})
export class VerCorrespondenciaComponent implements OnInit{

  @Input() correspondenciaId: number | null = null

  public isLoading: boolean = false
  public correspondencia: any
  @Output() onSair!: EventEmitter<any>
  constructor(private correspondenciaService: CorrespondenciaService, private ficheiroService: FicheiroService) { }



  ngOnInit(): void {
    this.onSair = new EventEmitter<any>()
  }


  
  
  public fecharModal() {
    this.onSair.emit({ sair: true })
  }
  
 
  
}
