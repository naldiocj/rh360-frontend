import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sigpq-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor() { }

  @Input() curso: any;
  ngOnInit() {
  }
  @Output() eventConfirmar = new EventEmitter<boolean>();
  @Output() eventCancelar = new EventEmitter<boolean>();

  onDelete()
  {
    this.eventConfirmar.emit(true);
  }

  cancelar()
  {
    this.eventCancelar.emit(true)
  }

}
