import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { BooksService } from 'src/services/books.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { HomeRoutingModule } from './home-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { WishListComponent } from './components/wishlist/wishlist.component';
@NgModule({
  declarations: [
    HomeComponent,
    SearchResultComponent,
    BookDetailsComponent,
    WishListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    HomeRoutingModule,
    DynamicDialogModule,
    PaginatorModule,
    ScrollPanelModule,
    ToastModule,
    ButtonModule
  ],
  providers: [BooksService, DialogService, MessageService],
})
export class HomeModule {}
