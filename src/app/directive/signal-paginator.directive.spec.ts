import { SignalPaginatorDirective } from './signal-paginator.directive';

describe('SignalPaginatorDirective', () => {
  let directive: SignalPaginatorDirective<any>;

  beforeEach(() => {
    directive = new SignalPaginatorDirective();
    jest.spyOn(directive.currentPageItems, 'emit');
    jest.spyOn(directive.paginationState, 'emit');
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should update current page items on changes', () => {
    const items = [1, 2, 3, 4, 5];
    directive.items = items;
    directive.pageSize = 2;
    directive.ngOnChanges({
      items: {
        currentValue: items,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(directive.currentPageItems.emit).toHaveBeenCalledWith([1, 2]);
    expect(directive.paginationState.emit).toHaveBeenCalledWith({ page: 1, pageSize: 2 });
  });

  it('should go to the next page', () => {
    directive.items = [1, 2, 3, 4, 5];
    directive.pageSize = 2;
    directive.ngOnChanges({
      items: {
        currentValue: directive.items,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    directive.nextPage();

    expect(directive.currentPage()).toBe(2);
    expect(directive.currentPageItems.emit).toHaveBeenCalledWith([3, 4]);
  });

  it('should go to the previous page', () => {
    directive.items = [1, 2, 3, 4, 5];
    directive.pageSize = 2;
    directive.currentPage.set(2);
    directive.ngOnChanges({
      items: {
        currentValue: directive.items,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    directive.previousPage();

    expect(directive.currentPage()).toBe(1);
    expect(directive.currentPageItems.emit).toHaveBeenCalledWith([1, 2]);
  });

  it('should go to a specific page', () => {
    directive.items = [1, 2, 3, 4, 5];
    directive.pageSize = 2;
    directive.ngOnChanges({
      items: {
        currentValue: directive.items,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    directive.goToPage(3);

    expect(directive.currentPage()).toBe(3);
    expect(directive.currentPageItems.emit).toHaveBeenCalledWith([5]);
  });
});
