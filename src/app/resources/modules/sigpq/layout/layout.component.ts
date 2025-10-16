import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private sec: SecureService) {

    document.body.addEventListener('click', (e: any) => {
      if(e?.target.getAttribute('id')?.toString().includes('foto-para-zoom')){
      }else{
        const image: HTMLDivElement = document.querySelector(`#preview-foto`) as HTMLDivElement
        if (image) {
          if (!image.classList.toString().includes('d-none'))
            image.classList.add('d-none')
        }

      }

    })

    // console.log(this.sec.getTokenValueDecode());

  }

  ngOnInit(): void {
    // console.log(this.sec.getTokenValueDecode());
  }

}
