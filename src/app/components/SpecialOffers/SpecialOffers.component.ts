import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/services/offer.service';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-SpecialOffers',
  templateUrl: './SpecialOffers.component.html',
  styleUrls: ['./SpecialOffers.component.css']
})
export class SpecialOffersComponent implements OnInit {

  constructor(protected offerService: OfferService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
