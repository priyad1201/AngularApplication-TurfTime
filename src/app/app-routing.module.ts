import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/Home/Home.component';
import { LoginComponent } from './components/Login/Login.component';
import { RegisterComponent } from './components/Register/Register.component';
import { AuthenticateGuard } from '../guards/authenticate.guard';
import { AdminHomeComponent } from './components/Admin-Home/Admin-Home.component';
import { AdminAddGameComponent } from './components/Admin-AddGame/Admin-AddGame.component';
import { AdminViewGameComponent } from './components/Admin-ViewGame/Admin-ViewGame.component';
import { AdminBookingDetailsComponent } from './components/Admin-BookingDetails/Admin-BookingDetails.component';
import { ContactUsComponent } from './components/ContactUs/ContactUs.component';
import { AdminEditGameComponent } from './components/Admin-EditGame/Admin-EditGame.component';
import { BookingDetailsComponent } from './components/BookingDetails/BookingDetails.component';
import { ViewGameDetailsComponent } from './components/ViewGameDetails/ViewGameDetails.component';
import { BookSlotComponent } from './components/BookSlot/BookSlot.component';
import { BookingInformationComponent } from './components/BookingInformation/BookingInformation.component';
import { BookingSummaryComponent } from './components/BookingSummary/BookingSummary.component';
import { PaymentDetailsComponent } from './components/PaymentDetails/PaymentDetails.component';
import { ProfileComponent } from './components/Profile/Profile.component';
import { AdminViewFeedbackComponent } from './components/Admin-ViewFeedback/Admin-ViewFeedback.component';
import { SearchComponent } from './components/Search/Search.component';
import { RoleBasedGuard } from 'src/guards/role-based.guard';
import { DeactivateGuard } from 'src/guards/deactivate.guard';


const routes: Routes = [
  { path:'', component: HomeComponent },
  { path:'login', component: LoginComponent },
  { path:'register', component: RegisterComponent },
  { path:'user-home', component: HomeComponent},
  { path:'contactus', component: ContactUsComponent},
  { path:'admin-home',
    component: AdminHomeComponent,
    canActivate: [AuthenticateGuard,RoleBasedGuard],
    data:{
      role: 'Admin'
    }
  },
  { path:'admin-addGame',
    component: AdminAddGameComponent,
    canActivate:[AuthenticateGuard, RoleBasedGuard],
    data:{
      role: 'Admin'
    }
  },
  { path:'admin-viewGame', component: AdminViewGameComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'Admin'}},
  { path:'admin-editGame/:id', component: AdminEditGameComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'Admin'}},
  { path:'admin-viewBookingDetails', component: AdminBookingDetailsComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'Admin'}},
  { path:'admin-viewFeedback', component: AdminViewFeedbackComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'Admin'}},
  { path:'user-bookSlot', component: BookSlotComponent},
  { path:'user-search/:searchValue', component:SearchComponent},
  { path:'user-profile', component:ProfileComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'User'}},
  { path:'user-bookingDetails', component: BookingDetailsComponent},
  { path:'user-bookingDetails/:id', component: BookingDetailsComponent},
  { path:'user-bookingSummary', component: BookingSummaryComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'User'}},
  { path:'user-paymentDetails/:id', component: PaymentDetailsComponent, canActivate:[AuthenticateGuard,RoleBasedGuard],canDeactivate:[DeactivateGuard], data:{ role: 'User'}},
  { path:'user-bookingInformation', component: BookingInformationComponent, canActivate:[AuthenticateGuard,RoleBasedGuard], data:{ role: 'User'}},
  { path:'user-viewGameDetails/:id', component: ViewGameDetailsComponent},
  { path:'**', component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [

  ]
})
export class AppRoutingModule { }
