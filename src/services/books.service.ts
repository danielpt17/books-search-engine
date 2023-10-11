import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  throwError
} from 'rxjs';
import { Book } from 'src/types/book';

@Injectable()
export class BooksService {
  BASE_URL = `https://www.googleapis.com/books/v1/volumes?q=`;

  private wishListBooks = new BehaviorSubject<Book[]>([]);
  wishListBooks$ = this.wishListBooks.asObservable();
  constructor(private readonly httpClient: HttpClient) {}

  addBook(book: Book) {
    const currentBooks = this.wishListBooks.getValue();
    this.wishListBooks.next([...currentBooks, book]);
  }

  removeBook(bookToRemove: Book) {
    const currentBooks = this.wishListBooks
      .getValue()
      .filter((book) => book.title !== bookToRemove.title);
    this.wishListBooks.next([...currentBooks]);
  }

  public search(
    query?: string,
    page = 0
  ): Observable<{ totalItems: number; items: Book[] }> {
    const url = `${this.BASE_URL}${query}&maxResults=20&startIndex=${page}`;
    return this.httpClient.get(url).pipe(
      map((res: any) => ({
        totalItems: res.totalItems,
        items: res.items
          ? res.items.map((item: any) => {
              let book = item.volumeInfo;
              return {
                title: book.title,
                description: book.description || null,
                categories: book.categories || null,
                authors: book.authors || null,
                image: book?.imageLinks?.smallThumbnail || null,
              };
            })
          : [],
      })),
      catchError((error: Error) => {
        return throwError(() => error);
      })
    );
  }
}
