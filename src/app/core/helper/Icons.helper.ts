import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IconHelperNmg {

    /**
     * @author 'nelsonmanuelgarcia980@gmail.com - anonnymous-kira'
     */

    public toggleGirarIcon_nmg(flag: boolean, iconClass: string): any {

        let icon: HTMLElement | any = document.querySelector(`.${iconClass}`);

        if (!flag) {
            $(`.${iconClass}`).css('transition', 'all .2s linear');
            $(`.${iconClass}`).css('display', 'inline-block');
            $(`.${iconClass}`).css('transform', 'rotate(90deg)');
        } else {
            $(`.${iconClass}`).css('transform', 'rotate(0deg)');
            $(`.${iconClass}`).css('transition', 'all .2s linear');
        }

        return flag = !flag

    }
}

