import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TripDataService } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTripComponent implements OnInit {

  editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private tripService: TripDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Retrieve trip code from the URL
    let tripCode = this.route.snapshot.paramMap.get('tripCode');

    if (!tripCode) {
      alert("Something's wrong, couldn't find where I stashed the tripCode!");
      this.router.navigate(['']);
      return;
    }

    // Initialize the form
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Load the existing trip data
    this.tripService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.trip = value.find(t => t.code === tripCode) as Trip;

          if (!this.trip) {
            this.message = 'No trip found with that code';
          } else {
            // Date inputs need yyyy-MM-dd; API returns full ISO timestamps
            const tripForForm = {
              ...this.trip,
              start: this.toDateInputValue(this.trip.start)
            };
            this.editForm.patchValue(tripForForm);
            this.message = `Trip: ${tripCode} found`;
          }
          console.log(this.message);
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  private toDateInputValue(value: string | Date): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value).substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
  }

  public onSubmit() {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripService.updateTrip(this.editForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}