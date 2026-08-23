import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCardComponent implements OnInit {
  @Input('trip') trip: any;
  @Output() tripDeleted = new EventEmitter<void>();
  private authenticationService = inject(AuthenticationService);
  readonly loggedIn = this.authenticationService.loggedIn;

  constructor(
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {}

  public isLoggedIn()
  {
    return this.authenticationService.isLoggedIn();
  }

  public editTrip(trip: any): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip', trip.code]);
  }

  public deleteTrip(trip: any): void {
    if (!confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      return;
    }

    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: (data: any) => {
          console.log('Trip deleted:', data);
          this.tripDeleted.emit();
        },
        error: (error: any) => {
          console.log('Error deleting trip: ' + error);
          alert('Failed to delete trip. Please try again.');
        }
      });
  }

  /** Coerce perPerson to a number so CurrencyPipe never crashes the card list. */
  public priceValue(value: string | number | null | undefined): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }
}