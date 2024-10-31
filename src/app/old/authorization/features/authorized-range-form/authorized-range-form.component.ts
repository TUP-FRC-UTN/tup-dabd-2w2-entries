import { Component, inject, OnInit } from '@angular/core';
import { AuthDTO, AuthorizedRange } from '../../models/authorized-range.model';
import { AuthorizedRangeService } from '../../services/authorized-range.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRangeService } from '../../services/auth-range.service';

@Component({
  selector: 'app-authorized-range-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authorized-range-form.component.html',
})
export class AuthorizedRangeFormComponent{
  
  authorizedRange: AuthorizedRange = {
    //auth_type_id: 0,
  //  external_id: 0,
    visitor_id: 0,
    auth_entity_id:null,
    date_from: null,
    date_to: null,
    hour_from: null,
    hour_to: null,
    day_of_weeks: [],
    plot_id: 0,
    comment: '',
  };

  daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  private authorizedRangeService = inject(AuthorizedRangeService);
  private router = inject(Router)
  
  constructor() {}

  onSubmit(): void {
    if (!this.authorizedRange.date_from) {
      this.authorizedRange.date_from = null;
    } else {
      this.authorizedRange.date_from = moment(this.authorizedRange.date_from).isValid()
        ? moment(this.authorizedRange.date_from).format('DD-MM-YYYY')
        : null;
    }
  
    if (!this.authorizedRange.date_to) {
      this.authorizedRange.date_to = null;
    } else {
      this.authorizedRange.date_to = moment(this.authorizedRange.date_to).isValid()
        ? moment(this.authorizedRange.date_to).format('DD-MM-YYYY')
        : null;
    }
  
    console.log(this.authorizedRange);
  
    this.authorizedRangeService.registerAuthorizedRange(this.authorizedRange).subscribe({
      next:(data)=>{
        alert("Se registro el rango con exito")
        this.router.navigate(['']);
      },
      error: (err)=>{
        console.error('error: ' , err)
      }
    })
  }
}
