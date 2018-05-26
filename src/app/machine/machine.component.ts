import { Component, OnInit,AfterContentChecked ,DoCheck} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import { Dropdown } from './dropdown'
import {CookieService} from 'angular2-cookie/core'
import '../../assets/scripts/collapse.js'
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent{
  user = 'Admin';
  title = 'DASHBOARD';
  param=[];
  url:string;
  id:string;
  dropdownlist = Dropdown; 
  currDiv: string;
  
  constructor(private router : Router,private cookieService : CookieService) { }
  ngOnIt(){
    window.location.reload();
  }
  ngDoCheck(){
    $('app-error').addClass('col-sm-10');     
    $('app-water-dispense').addClass('col-sm-10'); 
    $('app-transaction').addClass('col-sm-10');   
    $('app-supervisor').addClass('col-sm-10');
    $('app-operator').addClass('col-sm-10');
    $('body ').css({'background':"whitesmoke"});  
    
  }
  ngAfterContentChecked(){
    let param=this.router.url.split('/');
    this.url= param[param.length-1];
    this.id = param[param.length-2];
    this.currDiv = this.cookieService.get('prevDiv');
    
  }
  
  toggle(){
    $('.verticalNav').animate({opacity:"0"},500);
    $('#verticalCollapse').animate({maxWidth:"0%"},500);    
  }

}
