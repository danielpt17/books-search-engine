import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  skip,
  switchMap,
  take,
} from 'rxjs';
import { BooksService } from 'src/services/books.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Book } from 'src/types/book';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { BookDetailsComponent } from './components/book-details/book-details.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly searchSubject = new BehaviorSubject<string>('');
  private searchSubscription = new Subscription();
  totalBooks = 0;
  searchResults: Book[] = [];
  ref: DynamicDialogRef | undefined;
  @ViewChild('p', { static: false }) paginator: Paginator | undefined;
  enablePagination = false;
  constructor(
    private readonly booksService: BooksService,
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.subscribeToSearchInputChange();
  }

  onBookClicked(book: Book) {
    this.ref = this.dialogService.open(BookDetailsComponent, {
      header: 'Book details',
      data: book,
    });
    this.ref.onClose.subscribe((book: Book) => {
      if (book) {
        this.onAddBookClicked(book);
      }
    });
  }

  onAddBookClicked(book: Book) {
    this.booksService.addBook(book);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Book added to wishlist',
    });
  }

  onInputChange(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }

  subscribeToSearchInputChange() {
    this.searchSubscription = this.searchSubject
      .pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchQuery) => this.booksService.search(searchQuery))
      )
      .subscribe(
        (res) => {
          this.resetPaginator();
          if (res.totalItems === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'No books found, please try something else',
            });
          }
          this.searchResults = res.items;
          this.totalBooks = res.totalItems;
          this.cdr.markForCheck();
        },
        (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        }
      );
  }

  onPageChange(state: PaginatorState) {
    if (this.enablePagination) {
      this.booksService
        .search(this.searchSubject.getValue(), state.page!)
        .pipe(take(1))
        .subscribe((res) => {
          this.searchResults = res.items;
          this.cdr.markForCheck();
        });
    }
  }

  resetPaginator() {
    this.enablePagination = false;
    this.paginator?.changePage(0);
    this.enablePagination = true;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    if (this.ref) {
      this.ref.close();
    }
  }
}
