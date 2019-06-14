import { Component, OnInit } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import { config } from './token.config';
import * as _ from 'lodash';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  searchResults: any;
  displayedColumns: string[] = ['name', 'full_name', 'description', 'author', 'language', 'html_url'];

  constructor(private http: HttpClient) {
    this.searchText = '';
    this.searchResults = {
      items: []
    };
  }

  ngOnInit() { 
    this.search();
  }

  search() {
    this.http.get('https://api.github.com/search/repositories?q=' + this.searchText + '+in:name,description+org:' + config.orgName, {
      headers: {
        'Authorization': 'token ' + config.token,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {            
        this.searchResults = response;       
        _.forEach(this.searchResults.items, (res: any, index) => {          
          if (_.includes(res.description, '||')) {
            let splitDesc: any[] = res.description.split('||');   
              this.searchResults.items[index].author = _.trimStart(splitDesc[0]);
              this.searchResults.items[index].description = _.trimStart(splitDesc[1]);
              this.searchResults.items[index].language = _.trimStart(splitDesc[2]);
          }
        });    
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
