import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


/* Services */
import { CommonService } from './providers/common.service';
import { ApiService } from './providers/api.service';
import { UserService } from './providers/user.service';

/* Guards */
import {AuthGuard} from "./guards/auth.guard";

/* Routings */
import { AppRoutingModule } from './app.routing';


/* Pages */
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChangePasswordComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    NgbModule.forRoot(),
    FormsModule,    
  ],
  providers: [
    CommonService,
    ApiService,
    UserService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
