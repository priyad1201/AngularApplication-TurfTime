import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/Login/Login.component';
import { RegisterComponent } from './components/Register/Register.component';
import { HeaderComponent } from './components/Header/Header.component';
import { FooterComponent } from './components/Footer/Footer.component';
import { HomeComponent } from './components/Home/Home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { AdminHomeComponent } from './components/Admin-Home/Admin-Home.component';
import { AdminAddGameComponent } from './components/Admin-AddGame/Admin-AddGame.component';
import { AdminViewGameComponent } from './components/Admin-ViewGame/Admin-ViewGame.component';
import { AdminEditGameComponent } from './components/Admin-EditGame/Admin-EditGame.component';
import { AdminBookingDetailsComponent } from './components/Admin-BookingDetails/Admin-BookingDetails.component';
import { OfferPricePipe } from './pipes/OfferPrice.pipe';
import { FormatMobileNumberPipe } from './pipes/FormatMobileNumber.pipe';
import { ContactUsComponent } from './components/ContactUs/ContactUs.component';
import { BookingDetailsComponent } from './components/BookingDetails/BookingDetails.component';
import { ViewGameDetailsComponent } from './components/ViewGameDetails/ViewGameDetails.component';
import { BookSlotComponent } from './components/BookSlot/BookSlot.component';
import { BookingInformationComponent } from './components/BookingInformation/BookingInformation.component';
import { SpecialOffersComponent } from './components/SpecialOffers/SpecialOffers.component';
import { UniqueEmailValidatorDirective } from './directives/UniqueEmail.directive';
import { BookingSummaryComponent } from './components/BookingSummary/BookingSummary.component';
import { PaymentDetailsComponent } from './components/PaymentDetails/PaymentDetails.component';
import { ProfileComponent } from './components/Profile/Profile.component';
import { AdminViewFeedbackComponent } from './components/Admin-ViewFeedback/Admin-ViewFeedback.component';
import { SearchComponent } from './components/Search/Search.component';
import { DeactivateGuard } from 'src/guards/deactivate.guard';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ContactUsComponent,
    AdminHomeComponent,
    AdminAddGameComponent,
    AdminViewGameComponent,
    AdminEditGameComponent,
    AdminBookingDetailsComponent,
    OfferPricePipe,
    FormatMobileNumberPipe,
    BookingDetailsComponent,
    ViewGameDetailsComponent,
    BookSlotComponent,
    BookingInformationComponent,
    SpecialOffersComponent,
    UniqueEmailValidatorDirective,
    BookingSummaryComponent,
    PaymentDetailsComponent,
    ProfileComponent,
    AdminViewFeedbackComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    LoggerModule.forRoot(environment.logging)

  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  DeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
