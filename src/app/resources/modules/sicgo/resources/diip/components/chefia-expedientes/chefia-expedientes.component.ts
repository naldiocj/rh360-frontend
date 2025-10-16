import { Component, ElementRef, AfterViewInit, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-chefia-expedientes',
  templateUrl: './chefia-expedientes.component.html',
  styleUrls: ['./chefia-expedientes.component.css']
})
export class ChefiaExpedientesComponent implements OnInit {
  private isLocked = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    const inputs = this.el.nativeElement.querySelectorAll('#radiento input');
    inputs.forEach((input: HTMLInputElement) => {
      this.renderer.listen(input, 'click', (event: Event) => {
        window.performance && performance.mark('click');
        this.syncCheckedStateToAttribute(inputs, event.target as HTMLInputElement);
      });
    });

    const observer = new MutationObserver(async (mutations) => {
      if (this.isLocked) return;
      const checkedMutations = mutations.filter(m => m.type == 'attributes' && m.attributeName == 'checked');
      if (checkedMutations.length != 2) return;
      
      window.performance && performance.mark('mutation-process');
      this.isLocked = true;
      
      const [mutation1, mutation2] = checkedMutations;
      const checked1 = (mutation1.target as HTMLInputElement).checked;
      const checked2 = (mutation2.target as HTMLInputElement).checked;
      
      (mutation1.target as HTMLInputElement).checked = !checked1;
      (mutation2.target as HTMLInputElement).checked = !checked2;
      
      window.performance && performance.mark('vt-start');
      const t = (document as any).startViewTransition(() => {
        (mutation1.target as HTMLInputElement).checked = checked1;
        (mutation2.target as HTMLInputElement).checked = checked2;
      });
      
      await t.ready;
      window.performance && performance.mark('vt-ready');
      this.isLocked = false;
    });
    
    observer.observe(this.el.nativeElement.querySelector('#radiento'), {
      subtree: true,
      attributes: true,
    });
  }

  private syncCheckedStateToAttribute(candidates: NodeListOf<HTMLInputElement>, target: HTMLInputElement): void {
    if (target.hasAttribute('checked')) return;
    const prevTarget = Array.from(candidates).find(candidate => candidate.hasAttribute('checked'));
    if (prevTarget) {
      prevTarget.removeAttribute('checked');
    }
    target.setAttribute('checked', '');
  }
}
