import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FeedbackService } from 'src/services/feedback.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Admin-ViewFeedback',
  templateUrl: './Admin-ViewFeedback.component.html',
  styleUrls: ['./Admin-ViewFeedback.component.css']
})
export class AdminViewFeedbackComponent implements OnInit {
  feedbackList: any;
  isSelected: boolean = false;
  constructor(private feedbackService: FeedbackService, private logger: NGXLogger) { }

  ngOnInit() {
    this.feedbackService.getAllFeedback().subscribe({
      next:(reponse)=>{
        this.feedbackList = reponse;
        this.logger.log(this.feedbackList);
      },
      error:(errorMessage)=>{
        this.logger.error(errorMessage.message)
      }
    });
  }
  deleteFeedback(feedbackId:number){
    this.logger.warn("You are trying to delete feedback!")
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedbackService.deleteFeedback(feedbackId).subscribe(()=>{
          this.logger.info("Feedback Deleted");
          this.ngOnInit();
        })
        Swal.fire(
          'Deleted!',
          'Your data has been deleted.',
          'success'
        )
      }
    });
  }
  generateStarsArray(): number[] {
    const maxStars = 5;
    const starsArray = Array.from({ length: maxStars }, (_, index) => index + 1);
    return starsArray;
  }
  toggleClass(){
    this.isSelected = !this.isSelected;
  }
}
