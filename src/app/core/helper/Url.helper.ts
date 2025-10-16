import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root',
})
export class UrlService {

    constructor(private router: Router) { }

    url(url: string, params: any) {
        this.router.navigate([`/piips/${url}`], { queryParams: params });
    }

    url_direct(url:string)
    {
      this.router.navigate([`/piips/${url}`])
    }

}
