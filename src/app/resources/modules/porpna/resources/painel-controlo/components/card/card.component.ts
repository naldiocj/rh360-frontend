import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'porpna-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() title!: string
  @Input() total!: string
  @Input() actual!: string
  @Input() icon!: string
  @Input() link!: string


  public calc = (total: string, actual: string): any => {
    let t_: number = Number.parseFloat(total)
    let a_: number = Number.parseFloat(actual)

    let result: number = (100 * a_) / t_;

    if (isNaN(result) || result == 0) {
      return {
        sinal: 'negative',
        number: `0%`
      }
    } else {


      if (result > 50) {
        return {
          sinal: 'positive',
          number: `+${result.toFixed(2)}%`
        }
      } else {
        return {
          sinal: 'negative',
          number: `-${result.toFixed(2)}%`
        }
      }
    }

  }

}
