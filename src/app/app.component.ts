import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    this.scrollToTop();
  }
  title = 'TurfTime';
  scrollToTop(){
    let mybutton = document.getElementById("btn-back-to-top");
    window.onscroll = function () {
      scrollFunction();
    };
    function scrollFunction() {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        mybutton!.style.display = "block";
      } else {
        mybutton!.style.display = "none";
      }
    }
    mybutton!.addEventListener("click", backToTop);

    function backToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
}
