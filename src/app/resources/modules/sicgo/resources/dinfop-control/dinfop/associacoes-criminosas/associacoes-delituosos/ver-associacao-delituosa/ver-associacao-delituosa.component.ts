import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-associacao-delituosa',
  templateUrl: './ver-associacao-delituosa.component.html',
  styleUrls: ['./ver-associacao-delituosa.component.css']
})
export class VerAssociacaoDelituosaComponent implements OnInit {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
  }

}
