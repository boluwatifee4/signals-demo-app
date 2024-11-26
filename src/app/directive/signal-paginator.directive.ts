import { computed, Directive, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appPagination]',
  standalone: true,
  exportAs: 'pagination',
})
export class SignalPaginatorDirective<T> implements OnChanges {
  // Declare input properties
  @Input() items: T[] = [];
  @Input() pageSize = 10;
  @Input() sortFn: ((a: T, b: T) => number) | null = null;
  @Input() filterFn: ((item: T) => boolean) | null = null;

  @Output() currentPageItems = new EventEmitter<T[]>();
  @Output() paginationState = new EventEmitter<{ page: number; pageSize: number }>();

  // Declare private properties
  private currentPage = signal(1);
  private totalPages = computed(() => Math.ceil(this.filteredAndSortedItems().length / this.pageSize));

  // explanation
  // The filteredAndSortedItems computed property filters and sorts the items based on the filterFn and sortFn properties.
  // The filterFn property is a function that filters the items based on a condition.
  // The sortFn property is a function that sorts the items based on a condition.
  // The computed property returns the filtered and sorted items based on the filterFn and sortFn properties.
  // The ngOnChanges method is called whenever the items, pageSize, sortFn, or filterFn properties change.

  private filteredAndSortedItems = computed(() => {
    let data = this.items;
    if (this.filterFn) data = data.filter(this.filterFn);
    if (this.sortFn) data = data.sort(this.sortFn);
    return data;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['pageSize'] || changes['sortFn'] || changes['filterFn']) {
      this.updateCurrentPageItems();
    }
  }

  // explanation
  // The updateCurrentPageItems method calculates the start and end indexes of the current page so that it can emit the items that belong to the current page.
  // The start index is calculated by subtracting 1 from the currentPage value and multiplying it by the pageSize value.
  // The end index is calculated by adding the pageSize value to the start index.
  // The paginatedItems variable stores the items that belong to the current page by slicing the filteredAndSortedItems array using the start and end indexes.
  // Finally, the currentPageItems and paginationState events are emitted with the paginatedItems and the current page and pageSize values, respectively.

  private updateCurrentPageItems(): void {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedItems = this.filteredAndSortedItems().slice(start, end);
    this.currentPageItems.emit(paginatedItems);
    this.paginationState.emit({ page: this.currentPage(), pageSize: this.pageSize });
  }


  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.updateCurrentPageItems();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.updateCurrentPageItems();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updateCurrentPageItems();
    }
  }

}