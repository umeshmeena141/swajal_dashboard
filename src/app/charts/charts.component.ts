import { Component, OnInit,Input, ViewChild,AfterViewInit,AfterContentChecked,OnChanges,AfterViewChecked,AfterContentInit} from '@angular/core';
import {Chart} from 'chart.js';
import {WaterDispenseComponent} from '../water-dispense/water-dispense.component'
import {waterDispenserParam} from '../water-dispense/waterDispenserparam'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Cluster } from '../delhiCluster';
import { ThrowStmt } from '@angular/compiler';


declare var jquery:any;
declare var $ :any; 


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  private _property1: string;
  private chartData : any;
  @Input() 
  set property1(property1:string){
    this._property1=property1;
    this.checkGraph = true;
  };
  @Input() property2:string;
  Data1=[];
  Data2=[];
  type : string;
  data : any;
  options: any;
  label : string;
  labelString:string;
  checkGraph : boolean=true;
  cluster :string

  constructor(private water : WaterDispenseComponent,private Cluster : Cluster,private router : Router,private route: ActivatedRoute) { 
    this.cluster = route.snapshot.paramMap.get('cluster');
  }
  ngOnInit(){
    this.chartData = this.water;
    if(this.chartData.chartData.length){
      this.ConvertIntoArray(this.chartData.chartData,this._property1,this.property2);
      this.Chart('bar');
    }
  }
  ngAfterContentChecked(){
    if(this.checkGraph || this.chartData.dataChange){
      if(this.Cluster[this.cluster].WaterDispenseData[0].indexOf(this._property1)>=0){
        let index = this.Cluster[this.cluster].WaterDispenseData[0].indexOf(this._property1); 
        this.label = this.Cluster[this.cluster].WaterDispenseData[1][index];  
        this.labelString = this.Cluster[this.cluster].WaterDispenseData[1][index]+(this.Cluster[this.cluster].WaterDispenseData[2][index]?' (in ':'')+this.Cluster[this.cluster].WaterDispenseData[2][index]+(this.Cluster[this.cluster].WaterDispenseData[2][index]?')':'');
      }
      else if(this.Cluster[this.cluster].RoData[0].indexOf(this._property1)>=0){
        let index = this.Cluster[this.cluster].RoData[0].indexOf(this._property1);
        this.label = this.Cluster[this.cluster].RoData[1][index];          
        this.labelString =  this.Cluster[this.cluster].RoData[1][index]+(this.Cluster[this.cluster].RoData[2][index]?' (in ':'')+this.Cluster[this.cluster].RoData[2][index]+(this.Cluster[this.cluster].RoData[2][index]?')':'');
      }
      else if (this.Cluster[this.cluster].CupDispenseData[0].indexOf(this._property1)>=0){
        let index = this.Cluster[this.cluster].CupDispenseData[0].indexOf(this._property1);
        this.label = this.Cluster[this.cluster].CupDispenseData[1][index];          
        this.labelString =  this.Cluster[this.cluster].CupDispenseData[1][index]+(this.Cluster[this.cluster].CupDispenseData[2][index]?' (in ':'')+this.Cluster[this.cluster].CupDispenseData[2][index]+(this.Cluster[this.cluster].CupDispenseData[2][index]?')':'');
      }
      this.ConvertIntoArray(this.chartData.chartData,this._property1,this.property2);
      this.Chart('bar');
      if(this.chartData.chartData.length){
        this.checkGraph = false;
        this.chartData.dataChange = false;
      }
    }
  }
  
  ngOnChanges(){
    this.ConvertIntoArray(this.chartData.chartData,this._property1,this.property2);
    this.Chart('bar');
  }

  Chart(type:string){
    this.type= type;
    this.data= {
      labels : this.Data2,
        datasets: [{
            label: this.label,
            data: this.Data1,
            backgroundColor: this.backGroundColor[this._property1],
            borderWidth: 1,
            lineTension : 0
        }
      ]
      
    };
    this.options= {
        scales: {
            yAxes: [{
              scaleLabel:{
                display :true,
                labelString : this.labelString
                },
              ticks: {
                  beginAtZero:true
                }
            }]
        }
    }
  }

  ConvertIntoArray(data,property1:string,property2:string):void{  
    this.Data1=[];
    this.Data2=[];
    for(let obj of data){
      this.Data1.push(parseInt(obj[property1]));
      this.Data2.push(obj[property2]);
    }
  }
  backGroundColor=
    { "Total_Volume_Dispensed":"#3498DB",
     "Total_Recharge":"#1ABC9C",
     "Total_collection_from_Card":"#16A085",
     "Total_collection_from_coin":"#27AE60",
     "pH_of_water":"#3498DB",
     "Total_Collection_Sale":"#2ECC71",

     "Backwash_cycle_count":"#A93226",
     "Temperature":"#E74C3C",
     "tds_inlet":"#8E44AD",
     "tds_outlet":"#6600cc",
     "flow_inlet":"#F39C12",
     "flow_reject":"#D35400",
     "current_rwp":"#95A5A6",
     "current_hpp":"#7F8C8D",
     "total_treated_volume":"#2980B9",
     "total_reject_volume":"#3498DB",
     "Tank_Level":"#1ABC9C",

     "TotalCupsDispensed":"#3498DB",
     "TotalCoinCollection":"#16A085",
     "TotalCardCollection":"#27AE60",

     "Trip_Total_Volume_Dispensed":"#0033cc",
     "Trip_Total_Smartcard_Collection":"#1ABC9C",
     "Trip_Total_CoinCollection":"#16A085",
     "Trip_Total_Card_Recharge":"#27AE60",
     "Trip_Actual_Amount_Collection":"#00cc00",

  }
  

}
