import { Component, OnInit } from '@angular/core';
import { User, Post } from "app/user";
import { Observable } from "rxjs/Observable";
import { IAppState } from "app/app.state";
import { NgRedux, select } from "@angular-redux/store";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/take";
import { Subject } from "rxjs/Subject";
import { MyServiceService } from "app/my-service.service";
import { normalizeUser, normalizeUsers } from "app/schema";
import { UserQueryService } from "app/users-query.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private unSub: Subject<void> = new Subject<void>();
  user: string;
  users: string;

  usersWithPosts$: Observable<User[]>;
  posts$: Observable<Post[]>;

  constructor(private myService: MyServiceService,
    private userQueryService: UserQueryService,
    private ngRedux: NgRedux<IAppState>) {
  }

  ngOnInit(): void {
    this.posts$ = this.userQueryService.getPosts();
    this.usersWithPosts$ = this.userQueryService.getUsersWithPosts();

    this.myService.getUsers().take(1).subscribe(s => {
      let normalizedData = normalizeUsers(s);
      let users = normalizedData.entities.users;
      let posts = normalizedData.entities.posts;
      this.ngRedux.dispatch({ type: 'ADD_POSTS', payload: { posts: posts, ids: Object.keys(posts).map(s => +s) } });
      this.ngRedux.dispatch({ type: 'ADD_USERS', payload: { users: users, ids: normalizedData.result } });
      
      this.users = JSON.stringify(normalizedData);
    });
  }
  changeTitle(post) {
    this.ngRedux.dispatch({type: 'UPDATE_TITLE', payload: {
      id: post.id,
      title: (new Date()).toString()
    }});
  }
}