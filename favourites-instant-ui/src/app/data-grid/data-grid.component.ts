import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Post } from './post.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';  // Add this import
import { MatInputModule } from '@angular/material/input';  // Add this import

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    FormsModule, 
    MatIconModule, 
    MatFormFieldModule,  // Include MatFormFieldModule
    MatInputModule,  // Include MatInputModule
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  editMode: boolean = false;
  currentPost: Post = { id: 0, title: '', body: '' };
  expandedPostIds: Set<number> = new Set();
  columnsToDisplayWithExpand: string[] = ['id', 'title', 'expand']; // Ensure this is defined

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

  toggleExpand(post: Post): void {
    if (this.expandedPostIds.has(post.id)) {
      this.expandedPostIds.delete(post.id); // Collapse the post
    } else {
      this.expandedPostIds.add(post.id); // Expand the post
    }
  }

  isExpanded(post: Post): boolean {
    return this.expandedPostIds.has(post.id);
  }

  editPost(post: Post): void {
    console.log('Editing post:', post);
    this.editMode = true;
    this.currentPost = { ...post }; // Create a copy of the post to edit
  }

  savePost(): void {
    if (this.currentPost && this.currentPost.id) {
      const index = this.posts.findIndex((p) => p.id === this.currentPost.id);
      if (index !== -1) {
        this.posts[index] = { ...this.currentPost }; // Update with new data
        this.filteredPosts = [...this.posts]; // Refresh the table
        this.cancelEdit(); // Close the edit form
      }
    }
  }

  deletePost(post: Post): void {
    const index = this.posts.indexOf(post);
    if (index !== -1) {
      this.posts.splice(index, 1); // Remove post
      this.filteredPosts = [...this.posts]; // Refresh the table
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentPost = { id: 0, title: '', body: '' }; // Reset
  }
}
