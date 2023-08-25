import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionType } from 'src/interfaces/action';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component {
  @Output() nextStep = new EventEmitter<ActionType | null>();
  @Output() runCustomBot = new EventEmitter<ActionType | null>();
  @Input() activeStep: number = 1;

  moveToNextStep(action: ActionType) {
    this.nextStep.emit(action);
  }

  runBot() {
    this.runCustomBot.emit();
  }
}
