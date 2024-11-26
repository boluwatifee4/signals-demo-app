import { Component, effect } from '@angular/core';
import { SignalPaginatorDirective } from './directive/signal-paginator.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [SignalPaginatorDirective, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  data: string[] = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  visibleItems: string[] = [];

  constructor() {
    effect(() => {
      console.log('Visible Items Changed:', this.visibleItems);
    });
  }
  sortBy = (a: string, b: string) => a.localeCompare(b);
  filterBy = (item: string) => item.includes('1');

}
