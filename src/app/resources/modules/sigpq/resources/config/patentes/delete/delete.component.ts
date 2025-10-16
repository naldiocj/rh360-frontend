import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sigpq-delete ',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  @Input() funcaoRegime: any;
  @Output() eventConfirmar = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  onDelete()
  {
    this.eventConfirmar.emit(true);
  }

}
