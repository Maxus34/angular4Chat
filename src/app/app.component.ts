import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  public title :string = 'app';
  
  public ngOnInit(){
    this.handlePageResizing();
  }

  private handlePageResizing(){
    let app :any = document.querySelector('.app');

    function onResize () {
      let height = window.innerHeight;
      app.style.height = height + "px";
    }
    
    onResize();  
    window.onresize = onResize;
  }
}
