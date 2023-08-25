import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectorService } from 'src/app/services/selector-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { InputSelector } from 'src/interfaces/action';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Input() activeStep: number = 1;

  selectedXPaths$: Observable<string[] | InputSelector[]> = new Observable();

  constructor(private selectorService: SelectorService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.selectedXPaths$ = this.selectorService.getSelectedXPathsObservAble();
  }

  moveToNextStep() {
  const selectedXPaths = this.selectorService.getSelectedXPaths(null);

    if (selectedXPaths.length >= 2) {
      this.nextStep.emit();
    } else {
      this.toastr.error('Select at least two elements before proceeding.');
    }
  }

  reset() {
    this.selectorService.removeAll()
    this.selectorService.forceRemove();
  }
}
