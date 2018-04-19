import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { OldBook } from "app/models/oldbook";
import { BookTrackerError } from 'app/models/bookTrackerError';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
       return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError>{
    console.log('Getting all books from the server');
    return this.http.get<Book[]>('/api/books')
      .pipe(
      catchError(err => this.handleHttpError(err))
    );
    //return this.http.get<Book[]>('/api/books');
    //return this.http.get<Book[]>('/api/errors/500')
    //return allBooks;
  }

  private handleHttpError(error: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred retrieving data.';
    return ErrorObservable.create(dataError);
  }

  getBookById(id: number): Observable<Book> {
    let getHeaders : HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'my-token'
    });
    return this.http.get<Book>(`/api/books/${id}`,{
        headers : new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'my-token'
        })
    });
    // return this.http.get<Book>(`/api/books/${id}`,{
    //   headers : getHeaders
    // });
    //return allBooks.find(book => book.bookID === id);
  } 
  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`/api/books/${id}`)
       .pipe(
         map(b => <OldBook>{
           bookTitle: b.title,
           year: b.publicationYear
         }),
         tap(classicBook => console.log(classicBook))
       );
  }

  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    return this.http.put<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${bookID}`);
  }

}
