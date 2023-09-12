import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, map} from 'rxjs';
import { IGame } from 'src/models/game';
import { AuthenticateService } from 'src/services/authenticate.service';
import { BookedslotService } from 'src/services/bookedslot.service';
import { CartService } from 'src/services/cart.service';
import { GameService } from 'src/services/game.service';
import { OfferService } from 'src/services/offer.service';
import { UserDataService } from 'src/services/user-data.service';
import Swal from 'sweetalert2';
import { timeSlots } from 'src/app/environments/environment';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-BookingDetails',
  templateUrl: './BookingDetails.component.html',
  styleUrls: ['./BookingDetails.component.css'],
  styles:[`input.ng-invalid{border:1px solid red;}
        input.ng-valid{border:1px solid green;}
        input.ng-untouched{border:1px solid; }
        select.ng-invalid{border:1px solid red;}
        select.ng-valid{border:1px solid green;}
        select.ng-untouched{border:1px solid;}
        textarea.ng-untouched{border:1px solid;}`
  ]
})
export class BookingDetailsComponent implements OnInit {

  minDate:any = "";
  gameData!: IGame;
  gamesList!: IGame[];
  userDetails: any;
  bookSlot!: FormGroup;
  bookingDetails: any;
  result: any;
  errorMessage: undefined|  string;
  display:boolean = false;
  timeSlots = timeSlots;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private userDataService: UserDataService,
              private authService: AuthenticateService,
              private formBuilder: FormBuilder,
              private bookedSlotService: BookedslotService,
              private cartService: CartService,
              private router: Router,
              private offerService: OfferService,
              private logger: NGXLogger) { }

  ngOnInit() {

    this.userDataService.getEmailFromStore().subscribe(value=>{
      const EmailFromToken = this.authService.getEmailFromToken();
      const emailId = value || EmailFromToken;
      this.authService.getUser(emailId).subscribe((data)=>{
        if(data){
          this.userDetails = data;
        }
      })
    });
    let gameId = this.route.snapshot.paramMap.get('id');
    gameId && this.gameService.getGame(gameId).subscribe((data)=>{
      if(data){
        this.gameData = data;
        this.bookSlot.get('venueName')?.setValue(this.gameData.venueName);

        this.onInputChange();
        this.bookSlot.get('sportName')?.setValue(this.gameData.sportName);
      }
    });
    // this.fetchDetails();
    this.getDate();
    this.bookSlot = this.formBuilder.group({
      venueName:['',Validators.required],
      sportName: ['', Validators.required],
      dateOfSlot:['', Validators.required],
      timeSlots:['', Validators.required]
    })
    const combinedChanges = combineLatest([
      this.bookSlot.get('venueName')?.valueChanges,
      this.bookSlot.get('sportName')?.valueChanges,
      this.bookSlot.get('dateOfSlot')?.valueChanges
    ]);
    combinedChanges.subscribe(() => {
      this.checkSlotAvailability();
      this.display = true;
    });
  }


  getDate(){
    var date:any = new Date();
    var toDate:any = date.getDate();
    if(toDate < 10){
      toDate = '0' + toDate;
    }
    var month:any = date.getMonth() + 1;
    if(month < 10){
      month = '0' + month;
    }
    var year = date.getFullYear();
    this.minDate = year + "-" + month + "-" + toDate;
  }

  // fetchDetails(){
  //   this.gameService.getAllGames().subscribe((data:Game[])=>{
  //     if(data){
  //       this.gamesList = data;
  //     }
  //   })
  // }
  onInputChange(){
    this.gameService.getSportAvailableInVenue(this.bookSlot.value.venueName).subscribe((response:IGame[])=>{
      if(response){
        this.gamesList = response;
      }
    });
  }

  showSlot(){
    return this.display;
  }

  toggleTimeSlotSelection(timeSlot: any): void {
    timeSlot.selected = !timeSlot.selected;
    this.errorMessage  = undefined;
  }

  checkSlotAvailability(): void {

    const venueName = this.bookSlot.value.venueName;
    const sportName = this.bookSlot.value.sportName;
    const date = new Date(this.bookSlot.get('dateOfSlot')?.value).toISOString();

    this.bookedSlotService.checkSlotAvailability(venueName, sportName, date).subscribe({
      next: (response) => {
        if(response){
          this.timeSlots.forEach((timeSlot) => {
            const slotAvailability = response.find((slot) => {
              return slot.startTime === timeSlot.startTime && slot.endTime === timeSlot.endTime;
            });
            timeSlot.available = slotAvailability ? false : true;
          });
        }
        else{
          this.logger.info("All slots are available")
        }

        // to check if the date and time are expired
        const selectedDate = new Date(this.bookSlot.value.dateOfSlot);

        if (selectedDate.getDate() === new Date().getDate()) {
          const currentTime = new Date().getTime();
          for (let timeSlot of this.timeSlots) {
            const timestamp = getTimeStamp(timeSlot.startTime).getTime();

            if (timestamp < currentTime) {
              timeSlot.available = false;
            } else {
              timeSlot.available = true;
            }
          }
        }
      },
      error: () => {
        this.logger.error("Error while retrieving game details");
      },
    });
  }
  validateForm() {
    Object.keys(this.bookSlot.controls).forEach(controlName => {
      this.bookSlot.get(controlName)?.markAsTouched();
    });
  }
  async onSubmit(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
    }
    this.validateForm();
    const selectedSlots = this.timeSlots
                          .filter(slot => slot.selected)
                          .map(slot => ({ startTime: slot.startTime, endTime: slot.endTime }));;
    if (selectedSlots.length === 0) {
      this.errorMessage = "Select Atleast One Slot";
      return;
    }

    this.bookingDetails = {
      reservationId: "",
      venueName:this.bookSlot.value.venueName,
      sportName:this.bookSlot.value.sportName,
      sportImageUrl: "",
      dateOfSlot:new Date(this.bookSlot.value.dateOfSlot).toISOString(),
      dateOfBooking: new Date().toISOString(),
      timeSlots:selectedSlots,
      pricePerHour: await this.isWeekend(this.bookSlot.value.dateOfSlot,this.bookSlot.value.sportName),
      numberOfHours : selectedSlots.length,
      totalAmount: getTotalAmount(selectedSlots.length,await this.isWeekend(this.bookSlot.value.dateOfSlot,this.bookSlot.value.sportName)),
      paymentStatus: 'unpaid'
    }
    if(this.offerService.isOfferValid){
      this.bookingDetails.pricePerHour = this.transform(this.bookingDetails.pricePerHour)
      this.bookingDetails.totalAmount = getTotalAmount(selectedSlots.length,this.bookingDetails.pricePerHour)
    }
    this.gameService.getGameDetails(this.bookSlot.value.sportName).subscribe((response)=>{
      this.bookingDetails.sportImageUrl = response.imageUrl;
      this.cartService.addToBooking(this.userDetails.userId,this.bookingDetails);
    });
  }
  transform(value: any): any {
    const offerPrice = value - (20/100) * value;
    return offerPrice;
  }
  async isWeekend(date: Date, sportName: string): Promise<number> {
    try {
      const data = await this.gameService.getGameDetails(sportName).toPromise();
      if (data) {
        this.result = data;
      }

      const dateOfSlot = new Date(date);
      if (!(dateOfSlot instanceof Date)) {
        this.logger.warn("Invalid date object");
        return 0;
      }

      const dayOfWeek = dateOfSlot.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return this.result.priceForWeekend;
      } else {
        return this.result.priceForWeekday;
      }
    } catch (error) {
      this.logger.error("Error while retrieving game details")
      return 0;
    }
  }
}
function getTotalAmount(hours:number,price:number):number{
  return hours*price;
}
function getTimeStamp(startTime:string){
  const time = new Date();
  let [hours, minutes] = (startTime.match(/\d+/g) || []).map(Number);
  let period = (startTime.match(/[AaPp][Mm]/) || [])[0]?.toUpperCase();

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  time.setHours(hours);
  time.setMinutes(minutes);
  return time;
}
