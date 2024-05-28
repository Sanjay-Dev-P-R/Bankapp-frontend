import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf'
import 'jspdf-autotable' 

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  searchTerm:string=''
  searchkey:string='' //to hold the search values
  transactions:any=[]

  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.transactionHistory().subscribe((result:any)=>{
      console.log(result);
      this.transactions=result.transactions
      console.log(this.transactions);
      
    },
    (result:any)=>{
      console.log(result.error.message);
      
    })
  }

  search(event:any){
    console.log(event.target.value);
    this.searchkey=event.target.value
  }


  // generate pdf
  generatePdf(){

    // 1 create an object for jspdf
    var pdf = new jspdf();
    // 2 setup row for the table
    let thead =['Type','From Account','To Account','Amount']
    let tbody =[]

    // setup properties for the table
    pdf.setFontSize(16)
    pdf.text('Mini Statements',15,10)


    // 4 to display as table ,we need to convert array of objects into nested array
    for (let item of this.transactions){
      let temp= [item.type,item.fromAcno,item.toAcno,item.amount];//nest array
      tbody.push(temp)
    }

    // 5 Convert nested array into table structure using jspdf-autotable
    (pdf as any).autoTable(thead,tbody)
    
    // to open pdf in another tab
    pdf.output('dataurlnewwindow')

    // 7 to download or save pdf
    pdf.save('TransactionHistory.pdf')
  }
  
}
