import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import {RouterModule} from '@angular/router'



@NgModule({
  declarations: [NotFoundComponent, ServerErrorComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ErrorsModule { }
