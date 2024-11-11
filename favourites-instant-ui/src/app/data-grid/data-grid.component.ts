import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Post } from './post.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  editMode: boolean = false;
  searchType: string = 'title'; // Default search type is "title"
  currentPost: Post = { id: 0, title: '', body: '', favorites: [], instantFares: [] };
  expandedPostIds: Set<number> = new Set();
  columnsToDisplayWithExpand: string[] = ['id', 'title', 'expand'];
  currentInstantFares: any[] = [];
  favoriteSearchTerm: string = '';
  instantFareSearchTerm: string = '';
  favoriteTickets: Post[] = [];
  instantFareTickets: Post[] = [];
  alreadyAddedMessage: { favorite: string | null, instantFare: string | null } = { favorite: null, instantFare: null };
  createInstantFareModalOpen: boolean = false;
  newInstantFareTitle: string = '';
  newInstantFareDescription: string = '';
  filteredInstantFares: Post[] = [];
  
  
  // Modal state for Instant Fare
  instantFareModalOpen: boolean = false;
  
  // Temporary selection of instant fares in the modal
  selectedInstantFares: Post[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((data) => {
      this.posts = data;
      this.filteredPosts = data;
    });
  }

  onSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter((post) => {
        if (this.searchType === 'id') {
          return post.id.toString().includes(searchTerm);
        } else if (this.searchType === 'body') {
          return post.body?.toLowerCase().includes(searchTerm);
        } else {
          // Default to search by title
          return post.title.toLowerCase().includes(searchTerm);
        }
      });
    }
  }
  // This function filters the instant fares based on the search term
  searchInstantFares(): void {
    // Only filter if there’s a search term
    if (this.searchTerm.trim()) {
      this.filteredInstantFares = this.instantFareTickets.filter(fare =>
        fare.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Clear filtered list when search term is empty
      this.filteredInstantFares = [];
    }
  }

  onFavoriteSearch(): void {
    if (this.favoriteSearchTerm.trim() === '') {
      this.favoriteTickets = [];
    } else {
      this.dataService.searchFavorites(this.favoriteSearchTerm).subscribe((data) => {
        this.favoriteTickets = data;
      });
    }
  }

  onInstantFareSearch(): void {
    if (this.instantFareSearchTerm.trim() === '') {
      this.instantFareTickets = [];
    } else {
      this.dataService.searchInstantFares(this.instantFareSearchTerm).subscribe((data) => {
        this.instantFareTickets = data;
      });
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.favoriteSearchTerm = '';
    this.instantFareSearchTerm = '';
    this.filteredPosts = this.posts;
    this.favoriteTickets = [];
    this.instantFareTickets = [];
  }

  addTicketToCurrentPost(ticket: Post, type: 'favorite' | 'instantFare'): void {
    if (type === 'favorite') {
      if (!this.currentPost.favorites) {
        this.currentPost.favorites = [];
      }
      if (!this.currentPost.favorites.some((fav: { title: string; }) => fav.title === ticket.title)) {
        this.currentPost.favorites.push(ticket);
        this.alreadyAddedMessage.favorite = null;
      } else {
        this.alreadyAddedMessage.favorite = 'This favorite is already added.';
      }
      this.favoriteSearchTerm = ''; // Clear search term
      this.favoriteTickets = [];    // Reset search results
    } else if (type === 'instantFare') {
      if (!this.currentPost.instantFares) {
        this.currentPost.instantFares = [];
      }
      if (!this.currentPost.instantFares.some((fare: { title: string; }) => fare.title === ticket.title)) {
        this.currentPost.instantFares.push(ticket);
        this.alreadyAddedMessage.instantFare = null;
      } else {
        this.alreadyAddedMessage.instantFare = 'This instant fare is already added.';
      }
      this.instantFareSearchTerm = ''; // Clear search term
      this.instantFareTickets = [];    // Reset search results
    }
  }

  removeTicketFromCurrentPost(ticketTitle: string, type: 'favorite' | 'instantFare'): void {
    if (type === 'favorite') {
      this.currentPost.favorites = this.currentPost.favorites?.filter((fav: { title: string; }) => fav.title !== ticketTitle);
    } else if (type === 'instantFare') {
      this.currentPost.instantFares = this.currentPost.instantFares?.filter((fare: { title: string; }) => fare.title !== ticketTitle);
    }
  }

  removeInstantFare(ticketTitle: string): void {
    // Remove the instant fare from all posts, not just the current post
    this.posts.forEach(post => {
      if (post.instantFares) {
        post.instantFares = post.instantFares.filter((fare: { title: string }) => fare.title !== ticketTitle);
      }
    });
  
    // After modifying the posts, update the filtered posts to reflect the change
    this.filteredPosts = [...this.posts]; // Ensure filteredPosts is updated with the latest state
  }

  toggleExpand(post: Post, event: MouseEvent): void {
    if (this.editMode) {
      event.stopPropagation();
      return;
    }
    if (this.expandedPostIds.has(post.id)) {
      this.expandedPostIds.delete(post.id);
    } else {
      this.expandedPostIds.add(post.id);
    }
  }

  savePost(): void {
    if (this.currentPost && this.currentPost.id) {
      const index = this.posts.findIndex((p) => p.id === this.currentPost.id);
      if (index !== -1) {
        this.posts[index] = { ...this.currentPost };
        this.filteredPosts = [...this.posts];
        this.resetModal();
        this.cancelEdit();
      }
    }
  }

  openCreateInstantFareModal(): void {
    this.createInstantFareModalOpen = true;
  }
  
  closeCreateInstantFareModal(): void {
    this.createInstantFareModalOpen = false;

    this.newInstantFareDescription = '';
  }

// Function to add a new instant fare
createInstantFare(): void {
  if (this.newInstantFareTitle.trim()) {
    const newFare: Post = {
      id: Date.now(),
      title: this.newInstantFareTitle,
      body: '',
      favorites: [],
      instantFares: []
    };

    // Add the new fare to `instantFareTickets` instead of `selectedInstantFares`
    this.instantFareTickets.push(newFare);

    // Clear the input and close the modal
    this.closeCreateInstantFareModal();
  }
}
  
  saveNewInstantFare(): void {
    if (this.newInstantFareTitle.trim() && this.newInstantFareDescription.trim()) {
      const newInstantFare = {
        id: Math.max(...this.instantFareTickets.map(ticket => ticket.id)) + 1,
        title: this.newInstantFareTitle,
        body: this.newInstantFareDescription,
      };
      
      // Add new instant fare to the tickets array for reuse
      this.instantFareTickets.push(newInstantFare);
  
      this.closeCreateInstantFareModal();
    } else {
      alert('Please fill in all fields.');
    }
  }
  

  deletePost(post: Post): void {
    const index = this.posts.indexOf(post);
    if (index !== -1) {
      this.posts.splice(index, 1);
      this.filteredPosts = [...this.posts];
    }
  }

  editPost(post: Post): void {
    this.editMode = true;
    this.currentPost = { ...post };
    this.currentInstantFares = this.currentPost.instantFares || [];
    this.resetModal();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentPost = { id: 0, title: '', body: '', favorites: [], instantFares: [] };
    this.resetModal();
  }

  resetModal(): void {
    this.favoriteSearchTerm = '';
    this.instantFareSearchTerm = '';
    this.favoriteTickets = [];
    this.instantFareTickets = [];
    this.alreadyAddedMessage.favorite = null;
    this.alreadyAddedMessage.instantFare = null;
    this.selectedInstantFares = []; // Clear temporary selection
  }

  openInstantFareModal(): void {
    this.instantFareModalOpen = true;
  }

  closeInstantFareModal(): void {
    this.instantFareModalOpen = false;
    this.instantFareSearchTerm = ''; // Clear search term
    this.instantFareTickets = [];    // Reset search results
  }

  addInstantFareToModal(ticket: Post): void {
    if (!this.selectedInstantFares.some((fare) => fare.title === ticket.title)) {
      this.selectedInstantFares.push(ticket);
      this.alreadyAddedMessage.instantFare = null;
    } else {
      this.alreadyAddedMessage.instantFare = 'This instant fare is already added.';
    }
  }

  removeInstantFareFromAllPosts(ticketTitle: string): void {
    // Remove the instant fare from all posts
    this.posts.forEach(post => {
      if (post.instantFares) {
        post.instantFares = post.instantFares.filter((fare: { title: string }) => fare.title !== ticketTitle);
      }
    });
  
    // Also remove the instant fare from the selectedInstantFares (modal list)
    this.selectedInstantFares = this.selectedInstantFares.filter(
      (fare: { title: string }) => fare.title !== ticketTitle
    );
  
    // After modifying the posts, update the filtered posts to reflect the change
    this.filteredPosts = [...this.posts]; // Ensure filteredPosts is updated with the latest state
  }

  selectInstantFare(fare: Post): void {
    // Add fare to `selectedInstantFares` only if it’s not already there
    if (!this.selectedInstantFares.some(selected => selected.id === fare.id)) {
      this.selectedInstantFares.push(fare);
    }
  }

  addSelectedFaresToAllPosts(): void {
    for (const post of this.posts) {
      if (!post.instantFares) {
        post.instantFares = [];
      }
      for (const ticket of this.selectedInstantFares) {
        if (!post.instantFares.some((fare: { title: string; }) => fare.title === ticket.title)) {
          post.instantFares.push(ticket);
        }
      }
    }
    this.filteredPosts = [...this.posts];
    this.closeInstantFareModal();
  }

  getFavoritesTitles(post: Post): string {
    return post.favorites?.map((fav: { title: any; }) => fav.title).join(', ') || '';
  }

  getInstantFareTitles(post: Post): string {
    return post.instantFares?.map((fare: { title: any; }) => fare.title).join(', ') || '';
  }

  stopRowExpand(event: MouseEvent): void {
    event.stopPropagation();
  }
}
