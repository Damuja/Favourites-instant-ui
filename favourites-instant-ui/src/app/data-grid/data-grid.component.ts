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
  currentPost: Post = { id: 0, title: '', body: '', favorites: [], instantFares: [] };
  expandedPostIds: Set<number> = new Set();
  columnsToDisplayWithExpand: string[] = ['id', 'title', 'expand'];

  favoriteSearchTerm: string = '';
  instantFareSearchTerm: string = '';
  favoriteTickets: Post[] = [];
  instantFareTickets: Post[] = [];

  alreadyAddedMessage: { favorite: string | null, instantFare: string | null } = { favorite: null, instantFare: null };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((data) => {
      this.posts = data;
      this.filteredPosts = data;
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter((post) =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
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

      this.favoriteSearchTerm = ''; // Clear the search term
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

      this.instantFareSearchTerm = ''; // Clear the search term
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

  editPost(post: Post): void {
    this.editMode = true;
    this.currentPost = { ...post }; // Copy the current post for editing
    this.resetModal();  // Reset modal when editing
  }

  savePost(): void {
    if (this.currentPost && this.currentPost.id) {
      const index = this.posts.findIndex((p) => p.id === this.currentPost.id);
      if (index !== -1) {
        this.posts[index] = { ...this.currentPost }; // Update the post with new data
        this.filteredPosts = [...this.posts]; // Update filtered posts
        this.resetModal();  // Clear search terms and results
        this.cancelEdit(); // Close the edit mode
      }
    }
  }

  deletePost(post: Post): void {
    const index = this.posts.indexOf(post);
    if (index !== -1) {
      this.posts.splice(index, 1);
      this.filteredPosts = [...this.posts];
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentPost = { id: 0, title: '', body: '', favorites: [], instantFares: [] };
    this.resetModal();  // Reset modal state
  }

  resetModal(): void {
    // Reset search terms
    this.favoriteSearchTerm = '';
    this.instantFareSearchTerm = '';

    // Clear search results
    this.favoriteTickets = [];
    this.instantFareTickets = [];

    // Clear added ticket messages
    this.alreadyAddedMessage.favorite = null;
    this.alreadyAddedMessage.instantFare = null;

    // Reset current post's favorite and instant fare arrays
    this.currentPost.favorites = [];
    this.currentPost.instantFares = [];
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
