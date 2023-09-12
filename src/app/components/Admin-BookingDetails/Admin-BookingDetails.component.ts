import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AuthenticateService } from 'src/services/authenticate.service';

@Component({
  selector: 'app-Admin-BookingDetails',
  templateUrl: './Admin-BookingDetails.component.html',
  styleUrls: ['./Admin-BookingDetails.component.css']
})
export class AdminBookingDetailsComponent implements OnInit {
  bookedSlot:any;
  constructor(private userService: AuthenticateService, private logger: NGXLogger) { }

  ngOnInit() {
    this.userService.getAllUser().subscribe((response)=>{
      this.logger.log(response);
      this.bookedSlot = response;
    })
  }

}
