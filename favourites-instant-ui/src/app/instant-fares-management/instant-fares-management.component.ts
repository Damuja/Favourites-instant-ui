// src/app/instant-fares-management/instant-fares-management.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Post } from '../data-grid/post.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-instant-fares-management',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './instant-fares-management.component.html',
  styleUrls: ['./instant-fares-management.component.css']
})
export class InstantFaresManagementComponent{
  instantFares: Post[] = [];
  filteredInstantFares: Post[] = [];
  searchTerm: string = '';
  addInstantFareModalOpen: boolean = false;
  newInstantFare: Post = { id: 0, title: '', body: '', favorites: [], instantFares: [] };

  columnsToDisplay: string[] = ['id', 'title', 'action'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((data: Post[]) => {
      this.instantFares = data;
      this.filteredInstantFares = data;
    });
  }

  onSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm.trim() === '') {
      this.filteredInstantFares = this.instantFares;
    } else {
      this.filteredInstantFares = this.instantFares.filter((fare) =>
        fare.title.toLowerCase().includes(searchTerm)
      );
    }
  }

  openAddInstantFareModal(): void {
    this.addInstantFareModalOpen = true;
  }

  closeAddInstantFareModal(): void {
    this.addInstantFareModalOpen = false;
  }

  saveInstantFare(): void {
    if (this.newInstantFare.title && this.newInstantFare.body) {
      this.newInstantFare.id = Math.floor(Math.random() * 1000); // Just generating a random ID
      this.instantFares.push(this.newInstantFare);
      this.filteredInstantFares = [...this.instantFares];
      this.closeAddInstantFareModal();
    }
  }

  deleteInstantFare(fare: Post): void {
    const index = this.instantFares.indexOf(fare);
    if (index !== -1) {
      this.instantFares.splice(index, 1);
      this.filteredInstantFares = [...this.instantFares];
    }
  }
}
