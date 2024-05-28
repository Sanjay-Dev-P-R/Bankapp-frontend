import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-acno',
  templateUrl: './delete-acno.component.html',
  styleUrls: ['./delete-acno.component.css']
})
export class DeleteAcnoComponent {

  @Input() deleteAcno:any //@input is decorator called to get child function from another component

  //user defined event  
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  cancel(){
    this.onCancel.emit();//Emits an event containing a given value.

  }

  deleteFromChild(){
    this.onDelete.emit();//emits an event containning a given value
  }
}
