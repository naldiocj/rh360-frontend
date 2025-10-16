import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ModalService {

    abrir(item: string) {
        const closeModalBtn: HTMLElement | null = document.getElementById(item);
        closeModalBtn?.click();
    }

    fechar(item: string) {
        const closeModalBtn: HTMLElement | null = document.getElementById(item);
        closeModalBtn?.click();
    }

    public fecharTodos() {

      const body: any = document.body
      if (body.classList.toString().includes('modal-open')) {
        body?.classList.remove('modal-open')

      }

      const modals: Array<HTMLDivElement> | any = Array.from(document.querySelectorAll('.modal'))

      if (modals) {
        if (modals instanceof Array) {
          modals.forEach((modal: HTMLDivElement | any): void => {
            modal.style.display = 'none'
          })
        }
      }
      const backdrop: HTMLDivElement = document.querySelector('.modal-backdrop') as HTMLDivElement;
      if (backdrop) {
        backdrop.classList.remove('show');
        document.body.removeChild(backdrop);

      }
    }
}
