import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr'
import { DashboardModule } from './dashboard/dashboard.module';
import {CookieService} from 'ngx-cookie-service'
import { ListService } from './list.service';
import { ErrorsModule } from './errors/errors.module';
import { SocketService } from './socket.service';
import { SharedModule } from './shared/shared.module';
import { HistoryService } from './history.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UserModule,
    DashboardModule,
    SharedModule,
    ErrorsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [CookieService,ListService,SocketService,HistoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
