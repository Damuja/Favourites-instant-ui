import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Post } from './post.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  editMode: boolean = false;    // To toggle edit mode
  currentPost: Post | null = null; // Store the current post being edited
  expandedPostIds: Set<number> = new Set();

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

  // Toggle the expanded state of a post
  toggleExpand(post: Post): void {
    if (this.expandedPostIds.has(post.id)) {
      this.expandedPostIds.delete(post.id); // Collapse the post
    } else {
      this.expandedPostIds.add(post.id); // Expand the post
    }
  }

  // Check if a post is expanded
  isExpanded(post: Post): boolean {
    return this.expandedPostIds.has(post.id);
  }

  // Method to enable edit mode and set the current post
  editPost(post: Post): void {
    this.editMode = true;
    this.currentPost = { ...post }; // Create a copy of the post to edit
  }

  // Method to save the edited post
  savePost(): void {
    if (this.currentPost) {
      const index = this.posts.findIndex((p) => p.id === this.currentPost!.id);
      if (index !== -1) {
        this.posts[index] = this.currentPost; // Update the post in the array
        this.filteredPosts = this.posts; // Refresh filtered posts
        this.cancelEdit(); // Exit edit mode
      }
    }
  }

  // Method to delete a post
  deletePost(post: Post): void {
    const index = this.posts.indexOf(post);
    if (index !== -1) {
      this.posts.splice(index, 1); // Remove the post from the array
      this.filteredPosts = this.posts; // Refresh filtered posts
    }
  }

  // Method to cancel edit mode
  cancelEdit(): void {
    this.editMode = false;
    this.currentPost = null; // Reset current post
  }
}
