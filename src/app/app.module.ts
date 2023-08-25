import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './todos/todos.component';
import { ActionsComponent } from './bot/actions/actions.component';
import { Step1Component } from './bot/step1/step1.component';
import { Step2Component } from './bot/step2/step2.component';
import { Step3Component } from './bot/step3/step3.component';
import { HoverBorderDirective } from './bot/actions/hover-border.directive';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    ActionsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    HoverBorderDirective,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
