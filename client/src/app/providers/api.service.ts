import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class ApiService {

  public URL = 'http://localhost:8080/api/'; // Local
  constructor(private http: Http) { }

  post(subURL: string, body: any, options?: RequestOptions) {
    return this.http.post(this.URL + subURL, body, options)
  }

  get(subURL: string, params?: any, options?: RequestOptions) {
    return this.http.get(this.URL + subURL, options)
  }

  put(subURL: string, body: any, options?: RequestOptions) {
    return this.http.put(this.URL + subURL, body, options)
  }

  delete(subURL: string, options?: RequestOptions) {
    return this.http.delete(this.URL + subURL, options)
  }

  patch(subURL: string, body: any, options?: RequestOptions) {
    return this.http.patch(this.URL + subURL, body, options)
  }

}
