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
  paginator: any;

  constructor(private http: HttpClient) {
    this.searchText = '';
    this.searchResults = {
      items: []
    };
    this.paginator = {};
  }

  ngOnInit() { 
    this.search();
  }

  search(pageNumber = 1) {
    // remove # from the search string if any, to avoid the global search
    let reg = new RegExp('#')
    let search = this.searchText.replace(reg, '');

    this.http.get('https://api.github.com/search/repositories?q=' + search + '+in:name,description+org:' 
    + config.orgName +'&per_page=5&page=' + pageNumber, {
      headers: {
        'Authorization': 'token ' + config.token,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {  
        // set response data
        this.searchResults = response;       
        _.forEach(this.searchResults.items, (res: any, index) => {          
          if (_.includes(res.description, '||')) {
            let splitDesc: any[] = res.description.split('||');   
              this.searchResults.items[index].author = _.trimStart(splitDesc[0]);
              this.searchResults.items[index].description = _.trimStart(splitDesc[1]);
              this.searchResults.items[index].language = _.trimStart(splitDesc[2]);
          }
        });
        
        // add paginator info
        this.paginator.totalPage = Math.ceil(this.searchResults.total_count/5); // 5 is item per page
        this.paginator.currentPage = pageNumber; 
        this.paginator.pageLocation1 = pageNumber <= 1 ? 1 : pageNumber - 1;
        this.paginator.pageLocation2 = pageNumber <= 1 ? 2 : pageNumber;
        this.paginator.pageLocation3 = pageNumber <= 1 ? 3 : pageNumber + 1;
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
