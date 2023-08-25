import { Component, HostListener } from '@angular/core';
import { Task } from 'src/interfaces/task';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent {
  tasks: Task[] = [
   { title: "Wake up" , isCompleted: false },
   { title: "Work" , isCompleted: false },
   { title: "Game" , isCompleted: false },
   { title: "Sleep" , isCompleted: false },
  ];

  addTask(task: string) {
    console.log(task);
    // this.tasks.push({ title: task, isCompleted: false });
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

  completeTask(index: number) {
    this.tasks[index].isCompleted = true
  }
}
