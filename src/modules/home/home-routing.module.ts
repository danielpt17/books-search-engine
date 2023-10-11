import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { WishListComponent } from './components/wishlist/wishlist.component';

const homeRoutes: Routes = [
  {
    path: 'search',
    component: HomeComponent,
  },
  {
    path: 'wishlist',
    component: WishListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
