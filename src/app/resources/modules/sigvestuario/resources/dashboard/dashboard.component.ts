import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay, SwiperOptions} from 'swiper';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { Select2OptionData } from 'ng-select2';


// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

@Component({
  selector: 'sigvest-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public validarDataConsulta = this.formatarDataHelper.getPreviousDate(0,0,0, 'yyyy-MM-dd');
  public departamento: Array<Select2OptionData> = [];
  public estatistica: any;


  options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%'
  };

  filtro: any = {
    filtro: '',
    departamento_id: this.orgaoId,
    data_inicio: '',
    data_fim: ''
  }
 
  constructor(
    private secureService: SecureService,
    private formatarDataHelper: FormatarDataHelper,
  ) { }

  ngOnInit(): void {
    //this.validarSwiper(); 
  }

  get nomeOrgao(){
    return this.secureService.getTokenValueDecode()?.orgao?.sigla
  }

  public get orgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }


  validarSwiper(): void {
    var swiper = new Swiper(".my-swiper", {
      speed: 800,
      slidesPerView: 4.5,
      spaceBetween: 10,
      slidesPerGroup: 4,
      loop: true,
      autoplay: true,
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
      },
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      },
    });
  }


  config: SwiperOptions = {
    speed: 800,
    loop: true,
    autoplay: true,
    slidesPerView: 4.5,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      // Responsividade para diferentes tamanhos de tela
      1200: {
        slidesPerView: 7,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
    
  }; 

  images = [
    {foto : "../../../../../../assets/assets_sigvest/img/police-img1.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-3.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-4.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-5.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-6.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-7.webp"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-8.jpg"},
    {foto : "../../../../../../assets/assets_sigvest/img/images-9.jpg"},
    
  ]
  autoplayConfig = { delay: 1000, disableOnInteraction: false };
  
}
