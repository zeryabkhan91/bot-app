import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectorService } from 'src/app/services/selector-service.service';
import { ActionType } from 'src/interfaces/action';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit, OnDestroy {
  @Input() activeStep: number = 1;
  @Output() nextStep = new EventEmitter<ActionType | null>();
  activeSelector: string = '';
  toggleText: boolean = false;
  content: string = '';

  constructor(private selectorService: SelectorService) { }

  ngOnDestroy(): void {
    this.selectorService.setToggleContainer();
  }

  ngOnInit(): void {
    this.selectorService.setToggleContainer();
    this.activeSelector = this.selectorService.activeSelector;
  }

  resetAllSelected() {
    if (!this.toggleText && this.activeSelector === 'inputSelector') {
      this.content = ''
      this.toggleText = false;
    }

    this.selectorService.removeAll();
  }

  saveNewPreset() {
    if (!this.toggleText && this.activeSelector === 'inputSelector') {
      this.toggleText = !this.toggleText;
      return;
    }

    this.nextStep.emit({ isBackRoute: true, content: this.content })
  }

}
