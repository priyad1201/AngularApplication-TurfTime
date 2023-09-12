import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { onError, onGameAdded } from 'src/app/SweetAlert';
import { GameService } from 'src/services/game.service';

@Component({
  selector: 'app-Admin-AddGame',
  templateUrl: './Admin-AddGame.component.html',
  // styleUrls: ['./Admin-AddGame.component.css']
  styles:[`input.ng-invalid{border:1px solid red;}
        input.ng-valid{border:1px solid green;}
        input.ng-untouched{border:1px solid; }
        select.ng-invalid{border:1px solid red;}
        select.ng-valid{border:1px solid green;}
        select.ng-untouched{border:1px solid;}
        textarea.ng-untouched{border:1px solid;}`
  ]
})
export class AdminAddGameComponent implements OnInit {

  selectedFile!: File;
  addGame!: FormGroup;
  imageFormatError: undefined | string;

  constructor(private gameService: GameService, private router: Router, private formBuilder: FormBuilder, private logger: NGXLogger) { }

  ngOnInit() {
    this.addGame = this.formBuilder.group({
      sportName:['',[Validators.required,Validators.minLength(4)]],
      priceForWeekday:['',[Validators.required, Validators.pattern(/^\d+$/)]],
      priceForWeekend:['',[Validators.required, Validators.pattern(/^\d+$/)]],
      venueName:['',[Validators.required]],
      description:[''],
      category:['',[Validators.required]],
      imageUrl:["",[Validators.required]]
    });
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
  onSubmit()
  {
    const formData:FormData = new FormData();
    formData.append('sportName', this.addGame.value.sportName);
    formData.append('priceForWeekday', this.addGame.value.priceForWeekday);
    formData.append('priceForWeekend', this.addGame.value.priceForWeekend);
    formData.append('venueName', this.addGame.value.venueName);
    formData.append('description', this.addGame.value.description);
    formData.append('category', this.addGame.value.category);
    formData.append('imageUrl', this.addGame.value.imageUrl);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.gameService.addGame(formData).subscribe({
      next :()=>
      {
      onGameAdded();
      this.addGame.reset();
      this.router.navigate(['/admin-viewGame'])
      },
      error:(errorMessage)=>{
        onError(errorMessage.message);
        this.logger.error(errorMessage.message)
      }
    });
  }
}
