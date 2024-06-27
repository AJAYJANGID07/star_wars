import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  peopleList: any[] = [];
  moviesList: any[] = [];
  speciesList: any[] = [];
  vehicleList: any[] = [];
  starshipList: any[] = [];
  filteredPeopleList: any[] = [];
  selectedMovie: string = '';
  selectedSpecies: string = '';

  constructor(
    private _commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.onGetPeopleList();
    this.onGetMovies();
    this.onGetSpeciesList();
    this.onGetVehicleList();
    this.onGetStarshipList();
  }

  onGetPeopleList() {
    this._commonService.getPeoples().subscribe(res => {
      this.peopleList = res.results;
      this.filteredPeopleList = [...this.peopleList]; // Make a copy of the original list
      this._changeDetectorRef.markForCheck();
      this.fetchSpeciesData();
      this.fetchFilmsData();
    },(error: any) => {
      console.log(error);
      this._changeDetectorRef.markForCheck();
    })
  }

  fetchSpeciesData(): void {
    for (let person of this.peopleList) {
      const speciesObservables: Observable<any>[] = [];
      for (let speciesUrl of person.species) {
        speciesObservables.push(this._commonService.fetchSpecies(speciesUrl));
      }
      forkJoin(speciesObservables).subscribe(
        (speciesData) => {
          person.speciesData = speciesData;
        },
        (error) => {
          console.error('Error fetching species data', error);
          this._changeDetectorRef.markForCheck();
        }
      );
    }
  }

  fetchFilmsData(): void {
    console.log("Fetching films data for each person");
    this.peopleList.forEach(person => {
        const filmObservables: Observable<any>[] = [];
        person.films.forEach((filmUrl: any) => {
            filmObservables.push(this._commonService.fetchFilms(filmUrl));
        });
        forkJoin(filmObservables).subscribe(
            filmsData => {
                console.log("Fetched films data:", filmsData);
                person.filmsData = filmsData;
                this._changeDetectorRef.markForCheck();
            },
            error => {
                console.error('Error fetching films data', error);
                this._changeDetectorRef.markForCheck();
            }
        );
    });
}

  // Get Movies
  onGetMovies() {
    this._commonService.getAllMovies().subscribe(res => {
      this.moviesList = res.results;
      this._changeDetectorRef.markForCheck();
    }, (errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }

  // Get Species
  onGetSpeciesList() {
    this._commonService.getSpecies().subscribe(res => {
      this.speciesList = res.results;
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }

  // Get Vehicle list
  onGetVehicleList() {
    this._commonService.getVehicleList().subscribe(res => {
      this.vehicleList = res.results;
      console.log(this.vehicleList);
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      this._changeDetectorRef.markForCheck();
      console.log(errorRes)
    })
  }

  // Get Starship list
  onGetStarshipList() {
    this._commonService.getStarshipsList().subscribe(res => {
      this.starshipList = res.results;
      console.log(this.starshipList);
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }

  // filterPeopleByMovie(title: string): void {
  //   this.filteredPeopleList = this.peopleList.filter(person => 
  //       person.filmsData && person.filmsData.some((film: any) => film.title === title)
  //   );
  // }

  filterPeople(): void {
    this.filteredPeopleList = this.peopleList.filter(person => {
      console.log(person)
        const meetsMovieCriteria = !this.selectedMovie || person?.filmsData.some((film: any) => film.title === this.selectedMovie);
        const meetsSpeciesCriteria = !this.selectedSpecies || person?.speciesData.some((species: any) => species.name === this.selectedSpecies);
        return meetsMovieCriteria && meetsSpeciesCriteria;
    });
  }

  onSearch() {
    // if (this.selectedMovie) {
    //   this.filterPeopleByMovie(this.selectedMovie);
    // } else {
    //     this.filteredPeopleList = [...this.peopleList]; // Reset to the original list if no movie is selected
    // }
    this.filterPeople();

    console.log("Filtered People List:", this.filteredPeopleList);
  }

}
