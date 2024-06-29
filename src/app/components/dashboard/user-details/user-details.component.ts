import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/common.type';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  id: string = '';
  user!: User;
  constructor(
    private _commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activateRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this._activateRoute.params.subscribe(data => {
      console.log(data)
      this.id = data['id'];
      console.log(this.id)
    })

    // Called Get user by id api
    this.onGetUserById(this.id);
  }

  // Get user by id
  onGetUserById(id: string) {
    this._commonService.getUserById(id).subscribe(res => {
      console.log(res);
      this.user = res;
      console.log(this.user)
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }
}
