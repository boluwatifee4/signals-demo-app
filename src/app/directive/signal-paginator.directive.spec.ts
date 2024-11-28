import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalPaginatorDirective } from './signal-paginator.directive';

@Component({
  template: `
    <div appPagination
         [items]="items"
         [pageSize]="pageSize"
         [sortFn]="sortFn"
         [filterFn]="filterFn"
         (currentPageItems)="onCurrentPageItems($event)"
         (paginationState)="onPaginationState($event)">
    </div>
  `
})
class MockComponent {
  items = [1, 2, 3, 4, 5];
  pageSize = 2;
  sortFn: ((a: number, b: number) => number) | null = null;
  filterFn: ((item: number) => boolean) | null = null;

  currentPageItems: number[] = [];
  paginationState: { page: number; pageSize: number } = { page: 1, pageSize: 2 };

  onCurrentPageItems(items: number[]) {
    this.currentPageItems = items;
  }

  onPaginationState(state: { page: number; pageSize: number }) {
    this.paginationState = state;
  }
}

describe('SignalPaginatorDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, SignalPaginatorDirective]
    });

    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should update current page items on changes', () => {
    component.items = [1, 2, 3, 4, 5];
    component.pageSize = 2;
    fixture.detectChanges();

    expect(component.currentPageItems).toEqual([1, 2]);
    expect(component.paginationState).toEqual({ page: 1, pageSize: 2 });
  });

  it('should go to the next page', () => {
    component.items = [1, 2, 3, 4, 5];
    component.pageSize = 2;
    fixture.detectChanges();

    const directive = fixture.debugElement.children[0].injector.get(SignalPaginatorDirective);
    directive.nextPage();
    fixture.detectChanges();

    expect(component.currentPageItems).toEqual([3, 4]);
    expect(component.paginationState).toEqual({ page: 2, pageSize: 2 });
  });

  it('should go to the previous page', () => {
    component.items = [1, 2, 3, 4, 5];
    component.pageSize = 2;
    fixture.detectChanges();

    const directive = fixture.debugElement.children[0].injector.get(SignalPaginatorDirective);
    directive.currentPage.set(2);
    directive.previousPage();
    fixture.detectChanges();

    expect(component.currentPageItems).toEqual([1, 2]);
    expect(component.paginationState).toEqual({ page: 1, pageSize: 2 });
  });

  it('should go to a specific page', () => {
    component.items = [1, 2, 3, 4, 5];
    component.pageSize = 2;
    fixture.detectChanges();

    const directive = fixture.debugElement.children[0].injector.get(SignalPaginatorDirective);
    directive.goToPage(3);
    fixture.detectChanges();

    expect(component.currentPageItems).toEqual([5]);
    expect(component.paginationState).toEqual({ page: 3, pageSize: 2 });
  });
});
