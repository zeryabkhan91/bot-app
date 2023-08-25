import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectorService } from 'src/app/services/selector-service.service';
import { ActionType, InputSelector } from 'src/interfaces/action';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  activeStep = 1;

  constructor(private router: Router, private route: ActivatedRoute, private selectorService: SelectorService) { }
  selectedXPaths: string[] = [];

  ngOnInit() {
    this.selectorService.getSelectedXPathsObservAble().subscribe(xPaths => {
      this.selectedXPaths = xPaths as string[];
    });

    this.route.queryParams.subscribe(params => {
      const activeStepParam = params['activeStep'] as string;

      if (activeStepParam) {
        this.activeStep = parseInt(activeStepParam?.replace('step', ''));
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { activeStep: 'step1' },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  moveToNextStep(action: ActionType | null) {

    if (action?.isInput) {
      this.activeStep = 3;
      this.selectorService.setActiveSelector('inputSelector');
      this.updateQueryParam();

      return;
    }

    if (action?.isBackRoute) {
      this.activeStep = 2;
      action.content && this.selectorService.setContentForXpath('inputSelector', action.content || '')
      this.updateQueryParam();

      return;
    }


    if (action?.isButton) {
      this.activeStep = 3;
      this.selectorService.setActiveSelector('buttonSelector');
      this.updateQueryParam();

      return;
    }

    this.activeStep += 1;
    this.updateQueryParam();
  }

  private updateQueryParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { activeStep: "step" + this.activeStep },
      queryParamsHandling: 'merge'
    });
  }

  runBot() {
    const paths = this.selectorService.getAllXPaths();

    for (const input of paths['inputSelector']) {
      const inputContent = input as InputSelector;

      const inputElement = document.evaluate(inputContent.path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLInputElement;

      if (inputElement) {
        inputElement.value = inputContent.content || '';
      }
    }
  
    for (const buttonPath of paths['buttonSelector']) {
      const buttonElement = document.evaluate(buttonPath as string, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
      if (buttonElement) {
        buttonElement.click();
      }
    }

    this.selectorService.emptyAll()
  }
}
