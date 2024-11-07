import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './data-grid/post.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Search for posts (or tickets) by title or other criteria
  searchTickets(searchTerm: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts =>
        posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }

  // Search for Instant Fares based on the search term
  searchInstantFares(searchTerm: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => 
        posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())) // Assuming 'category' field identifies instant fares
      )
    );
  }

  searchFavorites(searchTerm: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => 
        posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())) // Assuming 'category' field identifies instant fares
      )
    );
  }
}
