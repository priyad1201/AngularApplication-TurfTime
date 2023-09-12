import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from 'src/services/authenticate.service';
import { FeedbackService } from 'src/services/feedback.service';
import { GameService } from 'src/services/game.service';
import { UserDataService } from 'src/services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-BookingInformation',
  templateUrl: './BookingInformation.component.html',
  styleUrls: ['./BookingInformation.component.css']
})
export class BookingInformationComponent implements OnInit {
  userCart:any;
  sportName!: string;
  gameDetails: any[] = [];
  closeResult = '';
  feedbackForm!: FormGroup;
  filteredBookings: any;
  ratingValue: number = 0;

  constructor(private userDataService: UserDataService,
              protected authService: AuthenticateService,
              private gameService: GameService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private feedbackService: FeedbackService) { }
  ngOnInit() {
    this.userDataService.getEmailFromStore().subscribe(value=>{
      const EmailFromToken = this.authService.getEmailFromToken();
      const emailId = value || EmailFromToken;
      this.authService.getUser(emailId).subscribe((data)=>{
        if(data){
          this.userCart = data;

          this.filteredBookings = this.userCart.myBookings;
          for (const booking of this.userCart.myBookings) {
            const sportName = booking.sportName;
            if (sportName) {
              this.gameService.getGameDetails(sportName).subscribe((response) => {
                if (response) {
                  if(booking.paymentStatus == "paid"){
                    this.gameDetails.push(response);
                  }
                }
              });
            }
          }
        }
      })
    });
    this.feedbackForm = this.formBuilder.group({
      ratings:['',Validators.required],
      comments: ['',],
    })
  }
  filterBookings(status: 'All' | 'Upcoming' | 'Completed') {
    const currentDate = new Date();
    if (status === 'All') {
      this.filteredBookings = this.userCart.myBookings;
    } else {
      this.filteredBookings = this.userCart.myBookings.filter((booking: any) => {
        const bookingDate = new Date(booking.dateOfSlot);
        if (status === 'Upcoming') {
          return bookingDate >= currentDate;
        } else{
          return bookingDate < currentDate;
        }
      });
    }
  }

  setRating(value: number): void {
    this.ratingValue = value;
  }
  submitFeedback(){
    const feedback ={
      userId: this.userCart.userId,
      fullName: this.userCart.fullName,
      emailId: this.userCart.emailId,
      ratings: this.ratingValue,
      comments: this.feedbackForm.value.comments,
      feedbackDate: new Date().toISOString()
    }
    this.feedbackService.addFeedback(feedback).subscribe((reponse)=>{
      const Toast = Swal.mixin({
        toast:true,
        position: 'top-end',
        customClass:{
          popup:'colored-toast'
        },
        showConfirmButton:false,
        timer:1500,
        timerProgressBar: false
      })
      Toast.fire({
        icon: 'success',
        title: 'Feedback submitted successfully',
        background: 'green' ,
        color: 'white'
      })
    })
  }
  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
