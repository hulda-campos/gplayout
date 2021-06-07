import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewComicPageRoutingModule } from './new-comic-routing.module';

import { NewComicPage } from './new-comic.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewComicPageRoutingModule,
    SharedModule
  ],
  declarations: [NewComicPage]
})
export class NewComicPageModule {}
