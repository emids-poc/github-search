import { Component, OnInit } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {config} from './token.config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  searchResults: any;
  displayedColumns: string[] = ['id', 'name', 'full_name', 'description', 'language', 'html_url'];

  constructor(private http: HttpClient) { 
    this.searchText = null;
    this.searchResults = {
      items: []
    };
  }

  ngOnInit() {
    this.searchText = '';
    this.search();
  }

  search() {
    this.http.get('https://api.github.com/search/repositories?q=' + this.searchText + '+org:' + config.orgName, {
      headers: {
        'Authorization': 'token ' + config.token,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {
        console.log(response)
        this.searchResults = response;
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
