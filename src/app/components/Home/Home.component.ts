import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { IGame } from 'src/models/game';
import { GameService } from 'src/services/game.service';
import { OfferService } from 'src/services/offer.service';
import { SpecialOffersComponent } from '../SpecialOffers/SpecialOffers.component';
import { FeedbackService } from 'src/services/feedback.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/services/user-data.service';
import { AuthenticateService } from 'src/services/authenticate.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  gamesList: IGame[] = [];
  active = 1;
  activeSmall = 0;
  feedbackList: any;
  feedbackForm!: FormGroup;
  userCart: any;
  ratingValue: number = 0;
  closeResult = '';

  constructor(private gameService: GameService,
              protected offerService: OfferService,
              private modalService: NgbModal,
              private feedbackService: FeedbackService,
              private formBuilder: FormBuilder,
              private userDataService: UserDataService,
              protected authService: AuthenticateService,
              private logger: NGXLogger){}

  ngOnInit():void {
    if(this.authService.isLoggedIn()){
      this.getUserDetails();
    }
    this.getAllDetails();
    this.feedbackForm = this.formBuilder.group({
      ratings:['',Validators.required],
      comments: ['',],
    })
  }

  getUserDetails(){
    this.userDataService.getEmailFromStore().subscribe(value=>{
      const EmailFromToken = this.authService.getEmailFromToken();
      const emailId = value || EmailFromToken;
      this.authService.getUser(emailId).subscribe((data)=>{
        if(data){
          this.userCart = data;
        }
      });
    });
  }
  getAllDetails(){
    this.gameService.getAllGames().subscribe({
      next:(data)=>{
        this.gamesList = data;
        this.logger.log(this.gamesList);
      },
      error:(errorMessage)=>{
        this.logger.error(errorMessage.message)
      }
    });
    this.feedbackService.getAllFeedback().subscribe({
      next:(data)=>{
        this.feedbackList = data;
        this.logger.log(this.feedbackList);
      },
      error:(errorMessage)=>{
        this.logger.error(errorMessage.message)
      }
    });
  }
  setRating(value: number): void {
    this.ratingValue = value;
  }
  openFeedback(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
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
      });
      this.ngOnInit();
    })
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
  generateStarsArray(): number[] {
    const maxStars = 5;
    const starsArray = Array.from({ length: maxStars }, (_, index) => index + 1);
    return starsArray;
  }
  open() {
		this.modalService.open(SpecialOffersComponent, { centered: true})
	}
  deleteFeedback(feedbackId:number){
    this.feedbackService.deleteFeedback(feedbackId).subscribe(()=>{
      this.ngOnInit();
    });
  }
}
