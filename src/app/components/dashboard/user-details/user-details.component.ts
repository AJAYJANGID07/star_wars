import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditedUser } from 'src/app/interfaces/common.type';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  id: string = '';
  user!: EditedUser;
  constructor(
    private _commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activateRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    // Get id from the activated params
    this._activateRoute.params.subscribe(data => {
      this.id = data['id'];
    })

    // Called Get user by id api
    this.onGetUserById(this.id);
  }

  // Get user by id
  onGetUserById(id: string) {
    this._commonService.getUserById(id).subscribe(res => {
      this.user = res;
      const match = res.homeworld.match(/\/(\d+)\/$/);
      const planetId = match ? match[1] : '';
      this.onGetPlanetDataById(planetId);
      this.onGetSpeciesByUrl(res?.species);
      this.onGetFilmsByUrl(res?.films);
      this.onGetVehiclesByUrl(res?.vehicles);
      this.onGetStarshipByUrl(res?.starships);
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }

  // Get planet data by id
  onGetPlanetDataById(planetId: string) {
    this._commonService.getPlanetDetails(planetId).subscribe(homeworldData => {
      this.user.homeworldDetails = homeworldData;
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    });
  }

  // Get species by url
  onGetSpeciesByUrl(species: any) {
    this._commonService.getSpeciesByUrl(species).subscribe(speciesData => {
      this.user.speciesDetails = speciesData;
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    });
  }

  // Get Films by url
  onGetFilmsByUrl(films: any) {
    this._commonService.getFilmsByUrl(films).subscribe(
      (filmData) => {
        this.user.filmsData = filmData
        this._changeDetectorRef.markForCheck();
      },
      (error) => {
        console.error(error);
        this._changeDetectorRef.markForCheck();
      }
    );
  }

  // Get vehicles by url
  onGetVehiclesByUrl(vehicles: any) {
    this._commonService.getVehiclesByUrl(this.user.vehicles).subscribe(
      (vehicleData) => {
        this.user.vehicleDetails = vehicleData;
        this._changeDetectorRef.markForCheck();
      },
      (error) => {
        console.error(error);
        this._changeDetectorRef.markForCheck();
      }
    );
  }

  // Get starships by url
  onGetStarshipByUrl(starships: any) {
    this._commonService.getStarshipsByUrl(this.user.starships).subscribe(
      (starshipData) => {
        this.user.starshipDetails = starshipData;
        this._changeDetectorRef.markForCheck();
      },
      (error) => {
        console.error(error);
        this._changeDetectorRef.markForCheck();
      }
    );
  }
}
