import { Component, OnInit } from '@angular/core';
import { FetchWaterDispenseDataService } from '../fetch-water-dispense-data.service';
import { Cluster } from '../delhiCluster';
import {Sales} from './report';

declare var $:any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  title: string= "Welcome To Dashboard";
  addInfo = Date();
  from : any;
  to : Date;
  cluster : string="Select Cluster";
  ids: any;
  isActive:boolean;
  tableActive:boolean;
  selectedIds:any;
  info : any;
  dataAvailable : boolean;
  dates =[];
  sales=Sales;
  constructor(private service : FetchWaterDispenseDataService,private Cluster : Cluster) { }

  ngOnInit() {
  }

  generateReport(){
    let table = this.Cluster[this.cluster]["WaterDispenseData"][3];
    let date= new Date(this.from);
    date.setDate(date.getDate()-1);
    this.selectedIds=$('#sel2').val();  
    this.service.getChartData('report.php',this.selectedIds,table,date.toISOString().slice(0,10),this.to).subscribe(info=>this.info=info,(err)=>console.log(err),()=>{
      this.dataAvailable= true;      
      this.dataRise();
      this.tableActive=true;
    });
  }
  getIds(){
    this.service.getIds('',this.cluster,'').subscribe(ids=>this.ids=ids,(err)=>this.ids=[],()=>{
      this.isActive=true;                  
    });
  }

  dataRise(){
    this.dates=[]
    let prevRowData=this.info[0];
    let i=0;
    let lastDay_rowIndex=0;
    for( var row of this.info){
      i=i+1;
      if(prevRowData['date']!=row['date'] || this.info.length==i){
        var temp={}
        for( var data of Sales[0]){
          var prevData=this.dates.length?this.info[lastDay_rowIndex][data]:0
          temp["date"]= prevRowData["date"];
          temp[data]=prevRowData[data]-prevData;
        }
        this.dates.push(temp);       
        lastDay_rowIndex=i-2;                    
      }
    prevRowData = row; 
    }
    this.dates.shift();
  }
}