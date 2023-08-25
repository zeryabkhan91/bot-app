import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SelectorService } from 'src/app/services/selector-service.service';
import { getXPath } from 'src/helpers';
import { InputSelector } from 'src/interfaces/action';

@Directive({
  selector: '[appHoverBorder]'
})
export class HoverBorderDirective implements OnInit, OnDestroy {
  isSelectingElement: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private selectorService: SelectorService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event.routerEvent instanceof NavigationEnd) {
        const queryParams = this.route.snapshot.queryParams;
        const activeStep = queryParams['activeStep'];

        if (!activeStep || activeStep === 'step1' || activeStep === 'step3') {
          this.enableEventListeners();
        } else {
          this.disableEventListeners();
        }
      }
    });

    this.selectorService.getToggleContainer().subscribe((value) => {
      this.isSelectingElement = value;
      if (!value) return

      const element = document.querySelector('[appHoverBorder]');
      this.renderer.removeAttribute(element, 'appHoverBorder');
      element?.removeAttribute('appHoverBorder');


      const paths = this.selectorService.getSelectedXPathsByInput('parentSelector');
      let firstChild = paths[0] as string;

      if (typeof paths[0] !== 'string') firstChild = paths[0]?.content as string;

      const result = document.evaluate(firstChild, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

      const targetElement = result.singleNodeValue;

      if (targetElement?.parentElement) {
       this.renderer.setAttribute(targetElement?.parentElement, 'appHoverBorder', '');
       this.el.nativeElement = targetElement?.parentElement
      }  


      this.selectorService.removeAll();
    })

    this.selectorService.getSelectedXPathsObservAble().subscribe(xpath => {
      if (!xpath.length) {
        this.enableEventListeners(); 
        this.deselectAllElement(this.selectorService.getToggleContainer() ? this.selectorService.previousSelector : null);
      }
    });

  }

  ngOnDestroy(): void {
    this.disableEventListeners();
  }

  private enableEventListeners(): void {
    const element = this.el.nativeElement;

    element.addEventListener("click", this.handleClick);
    element.addEventListener("mouseover", this.handleMouseOver);
    element.addEventListener("mouseout", this.handleMouseOut);
  }

  private handleMouseOver = (event: Event) => {

    const target = event.target as HTMLElement;

    if (this.isSelected(target)) return

    target.setAttribute('previousBorderStyle' , window.getComputedStyle(target).border);
    target.setAttribute('previousOutlineStyle' , window.getComputedStyle(target).outline);

    target.style.border = "2px solid red";
    target.style.outline = "2px solid red";
  };

  private handleMouseOut = (event: Event) => {
    if (!this.isSelected(event.target as HTMLElement)) {
      const target = event.target as HTMLElement;

      const previousBorderStyle = target.getAttribute('previousBorderStyle');
      const previousOutlineStyle = target.getAttribute('previousOutlineStyle');

      target.style.border = previousBorderStyle || "none";
      target.style.outline = previousOutlineStyle || "none";
    }
  };

  private handleClick = (event: Event) => {

    const target = event.target as HTMLElement;

    event.preventDefault()

    if (this.isSelected(target)) {
      this.deselectElement(target, null);
    } else {
      const parentElement = target.parentElement;
      if (parentElement && this.isSelected(parentElement)) {
        return;
      }

      this.selectElement(target);
    }
  };

  private isSelected(target: HTMLElement): boolean {
    const path = getXPath(target) as string;

    const selectedXPaths: (string | InputSelector)[] = this.selectorService.getSelectedXPaths(null);

    let isSelected = false;

    if (Array.isArray(selectedXPaths)) {
      if (typeof selectedXPaths[0] === 'string') {
        isSelected = selectedXPaths.includes(path);
      } else {
        isSelected = selectedXPaths.some((item: string | InputSelector) => {
          if (typeof item === 'string') {
            return false; 
          }
          return item.path === path;
        });

      }
    }

    return isSelected;
  }

  private selectElement(target: HTMLElement): void {
    target.style.border = "2px solid green";
    target.style.outline = "2px solid green";

    const path = getXPath(target)
    if (path) this.selectorService.addSelectedXPath(path);


    if (!this.isSelectingElement && this.selectorService.getSelectedXPaths(null).length >= 2) {
      const siblings = Array.from(target.parentElement?.children || []);

      siblings.forEach((sibling: any) => {
        const path = getXPath(sibling);


        const selectedXPaths: (string | InputSelector)[] = this.selectorService.getSelectedXPaths(null);

        let isSelected = false;

        if (Array.isArray(selectedXPaths)) {
          if (typeof selectedXPaths[0] === 'string') {
            isSelected = selectedXPaths.includes(path);
          } else {
            isSelected = selectedXPaths.some((item: string | InputSelector) => {
              if (typeof item === 'string') {
                return false; 
              }
              return item.content === path;
            });
          }
        }

        if (isSelected) return

        sibling.setAttribute('previousBorderStyle', window.getComputedStyle(sibling).border);
        sibling.setAttribute('previousOutlineStyle', window.getComputedStyle(sibling).outline);

        sibling.style.border = "2px solid blue";
        sibling.style.outline = "2px solid blue";

        this.selectorService.addSelectedXPath(path);
      });

      this.disableEventListeners();
    }
  }

  private deselectAllElement(selector: string | null) {
    const xpaths = this.selectorService.getSelectedXPaths(selector);

    xpaths.forEach((xpath: string | InputSelector) => {
      let path = xpath as string;

      if (typeof xpath !== "string") path = xpath.path as string


      const { singleNodeValue } = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

      this.deselectElement(singleNodeValue as HTMLElement, selector)
    })
  }

  private deselectElement(target: HTMLElement, selector: string | null): void {
    const previousBorderStyle = target.getAttribute('previousBorderStyle');
    const previousOutlineStyle = target.getAttribute('previousOutlineStyle');

    target.style.border = previousBorderStyle || "none";
    target.style.outline = previousOutlineStyle || "none";

    const path = getXPath(target)
    if (!selector) this.selectorService.removeSelectedXPath(path);
  }

  private disableEventListeners(): void {
    const element = this.el.nativeElement;

    element.removeEventListener("click", this.handleClick);
    element.removeEventListener("mouseover", this.handleMouseOver);
    element.removeEventListener("mouseout", this.handleMouseOut);
    element.style.border = "none";
    element.style.outline = "none";
  }
}
