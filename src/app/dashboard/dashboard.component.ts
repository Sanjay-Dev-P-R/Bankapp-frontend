import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  acno:any  //for parent to child data communication
  user: String = ''
  balance: String = ''
  currentAcno: string = ''
  transferSuccess:string=''
  transferError:string=''
  Success:any;
  logoutSuccess:any
  deleteConfirmStatus:boolean=false
  deleteSuccessMsg:string=''

  constructor(private fb: FormBuilder, private api: ApiService,private logoutRouter:Router) { }
  ngOnInit(): void {

    if(!localStorage.getItem("token")){
      alert("Please Login")
      this.logoutRouter.navigateByUrl('')
    }



    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || '';
    }
    // if(localStorage.getItem('balance')){
    //   this.balance=localStorage.getItem('balance')||'';
    // }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno') || '';
    }
  }



  iscollapse: boolean = false;

  collapse() {
    this.iscollapse = !this.iscollapse
  }

  fundForm = this.fb.group({//form group
    acno: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
    amt: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],

  })

  dashboardform() {
    if (this.fundForm.valid) {
      let creditAcno = this.fundForm.value.acno;
      let password = this.fundForm.value.password;
      let amount = this.fundForm.value.amt;
      this.api.fundtransfer(creditAcno, password, amount).subscribe((result: any) => {
        console.log(result);
        this.transferSuccess=result.message;
        setTimeout(()=>{
          this.fundForm.reset();
          this.transferSuccess=''
        },2000)
      
      },
        (result: any) => {
          console.log(result.error.message);
          this.transferError=result.error.message;
          setTimeout(()=>{
            this.fundForm.reset();
            this.transferError=''
          },2000)
          

        }
      )
      // alert('Successful');
     
    }
    else {
      alert('Please enter the unfilled details')
    }

  }
  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      this.balance = result.balance
    },
      (result: any) => {
        alert(result.error.message)
      })
  }

  reset(){
    this.fundForm.reset()
  }

  logout(){    
    this.logoutSuccess=true
    setTimeout(()=>{
      // redirected to login page
    this.logoutRouter.navigateByUrl('')
    
    },3000) 
    localStorage.clear()
  }


  deleteAccount(){
    this.acno=localStorage.getItem('currentAcno')
    this.deleteConfirmStatus=true

  }

  cancelDeleteConfirm(){
    this.acno=''
    this.deleteConfirmStatus=false
  }

  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear()
      this.deleteSuccessMsg=result.message//account delted successsfully
      setTimeout(()=>{
        this.logoutRouter.navigateByUrl('')//redirected to login page
      },3000)
     
    })
  }

}
