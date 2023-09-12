import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { onSuccess } from 'src/app/SweetAlert';
import { GameService } from 'src/services/game.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Admin-EditGame',
  templateUrl: './Admin-EditGame.component.html',
  styleUrls: ['./Admin-EditGame.component.css']
})
export class AdminEditGameComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private router: Router,
              private formBuilder: FormBuilder,
              private logger: NGXLogger){ }

  gameDetails: any;
  editGame!: FormGroup;
  selectedFile!: File;
  imageFormatError: undefined | string;
  ngOnInit(){
    this.editGame = this.formBuilder.group({
      sportName:[''],
      category:[''],
      priceForWeekday:[''],
      priceForWeekend:[''],
      venueName:[''],
      description:[''],
      imageUrl:[''],
    })
    let gameId = this.route.snapshot.paramMap.get('id');
    if(gameId){
      this.gameService.getGame(gameId).subscribe((result)=>{
        if(result){
          this.gameDetails = result;
          this.editGame.patchValue({
            sportName: result.sportName,
            category: result.category,
            priceForWeekday: result.priceForWeekday,
            priceForWeekend: result.priceForWeekend,
            venueName: result.venueName,
            description: result.description,
          });
        }
      });
    }
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if(this.selectedFile){
        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedFormats.includes(this.selectedFile.type)){
          this.imageFormatError=undefined;
        }
        else{
          this.imageFormatError = "Please select a valid image format file";
        }
      }
    }
  }
  onSubmit(){
    const formData:FormData = new FormData();
    formData.append('sportName', this.editGame.value.sportName);
    formData.append('priceForWeekday', this.editGame.value.priceForWeekday);
    formData.append('priceForWeekend', this.editGame.value.priceForWeekend);
    formData.append('venueName', this.editGame.value.venueName);
    formData.append('description', this.editGame.value.description);
    formData.append('category', this.editGame.value.category);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.gameService.editGame(this.gameDetails.id,formData).subscribe({
      next:()=>{
        onSuccess('Game Updated Successfully')
        this.router.navigate(['/admin-viewGame']);
      },
      error:(errorMessage)=>{
        this.logger.error(errorMessage.message)
      }
    });
  }
}
