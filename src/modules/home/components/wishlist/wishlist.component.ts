import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BooksService } from 'src/services/books.service';
import { Book } from 'src/types/book';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  private booksSubscription = new Subscription();
  constructor(private readonly booksService: BooksService) {}

  ngOnInit(): void {
    this.booksSubscription = this.booksService.wishListBooks$.subscribe(
      (books) => {
        this.books = books;
      }
    );
  }

  onRemoveBook(book: Book) {
    this.booksService.removeBook(book);
  }

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }
}
