import { Injectable } from "@angular/core";
import { NgxIzitoastService } from "ngx-izitoast";

@Injectable({
    providedIn: 'root',
})
export class IziToastService {

    constructor(public iziToast: NgxIzitoastService) { }

    sucesso(sms: any = null) {
        this.padrao(
            "fa fa-check",
            "Sucesso:",
            sms || "operação executada com êxito!",
            "rgba(60,179,113)",
            "Green"
        );
    }

    erro(sms: any = null) {
        this.padraoError(
            "fa fa-check",
            "Erro:",
            sms || "operação executada sem êxito!"
        );
    }

    alerta(sms: any = null) {
        this.padraoAlert(
            "fa fa-check",
            "Alerta:",
            sms || "operação executada sem êxito!"
        );
    }

    // alerta() {
    //     this.iziToast.show({
    //         imageWidth: 12,
    //         icon: "fa fa-check",
    //         titleSize: "16",
    //         title: "Sucesso:",
    //         messageSize: "16",
    //         message: "operação executada com êxito!",
    //         class: "foo",
    //         theme: "light",
    //         position: "topRight",
    //         backgroundColor: "rgba(60,179,113)",
    //         progressBarColor: "Green",
    //     });
    // }

    padrao(icon: string, title: string, message: string, backgroundColor: string, progressBarColor: string): void {
        this.iziToast.show({
            timeout: 10000,
            // displayMode: 'once',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            imageWidth: 12,
            icon: icon,
            titleSize: "16",
            title: title,
            messageSize: "16",
            message: message,
            class: "foo",
            theme: "light",
            position: "topRight",
            backgroundColor: backgroundColor,
            progressBarColor: progressBarColor,
        });
    }

    padraoError(icon: string, title: string, message: string): void {
        this.iziToast.error({
            timeout: 10000,
            // displayMode: 'once',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            imageWidth: 12,
            icon: icon,
            titleSize: "16",
            title: title,
            messageSize: "16",
            message: message,
            class: "foo",
            theme: "light",
            position: "topRight"
        });
    }

    padraoAlert(icon: string, title: string, message: string): void {
        this.iziToast.warning({
            timeout: 20000,
            // displayMode: 'once',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            imageWidth: 12,
            titleSize: "16",
            title: title,
            messageSize: "16",
            message: message,
            class: "foo",
            theme: "light",
            position: "topRight"
        });
    }
}