import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Book } from 'src/types/book';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  @Input() book: Book | undefined;
  @Input() showAddBtn = true;
  @Input() showRemoveBtn = false;
  @Output() bookClicked = new EventEmitter<Book>();
  @Output() addBookClicked = new EventEmitter<Book>();
  @Output() removeBookClicked = new EventEmitter<Book>();

  onBookClick(book: Book) {
    this.bookClicked.emit(book);
  }
  onRemoveBookClick(e: Event) {
    e.stopPropagation();
    this.removeBookClicked.emit(this.book);
  }
  onAddBookClick(e: Event) {
    e.stopPropagation();
    this.addBookClicked.emit(this.book);
  }
}
