import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

type DropdownType = 'movie' | 'species' | 'starship' | 'vehicle';

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

  // Pagination states
  currentPage: number = 1;
  totalPages: number = 0;

  dropdownStates: Record<DropdownType, boolean> = {
    movie: false,
    species: false,
    starship: false,
    vehicle: false
  };

  selectedOptions: Record<DropdownType, any> = {
    movie: null,
    species: null,
    starship: null,
    vehicle: null
  };

  constructor(
    private _commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    // Fetch Peoples List
    this.onGetPeopleList(this.currentPage);
    this.onGetMovies();
    this.onGetSpeciesList();
    this.onGetVehicleList();
    this.onGetStarshipList();
  }

  // Fetch Peoples List
  onGetPeopleList(page: any) {
    this._commonService.getPeoples(page).subscribe(res => {
      // Check Duplicate user present or not if duplicate user come then auto remove from the list
      const newPeople = res.results.filter((newPerson: any) => 
        !this.peopleList.some((existingPerson: any) => existingPerson.url === newPerson.url)
      );
      // Push the all fetched data into the peopleList
      this.peopleList.push(...newPeople);
      this.filteredPeopleList = res.results;
      const pageCount = Math.ceil(res.count / res.results.length);
      this.totalPages = Math.ceil(res.count / 10);
      this._changeDetectorRef.markForCheck();
      this.fetchSpeciesData();
    },(error: any) => {
      console.log(error);
      this._changeDetectorRef.markForCheck();
    })
  }

  fetchSpeciesData(): void {
    const speciesObservables: Observable<any>[] = [];
    this.filteredPeopleList.forEach(person => {
      person.species.forEach((speciesUrl: string) => {
        speciesObservables.push(this._commonService.fetchSpecies(speciesUrl));
      });
    });
    forkJoin(speciesObservables).subscribe(
      (speciesData: any[]) => {
        let index = 0;
        this.filteredPeopleList.forEach(person => {
          person.speciesData = person.species.map(() => speciesData[index++]);
        });
      },
      (error) => {
        console.error('Error fetching species data', error);
        this._changeDetectorRef.markForCheck();
      }
    );
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
      this._changeDetectorRef.markForCheck();
    },(errorRes) => {
      console.log(errorRes);
      this._changeDetectorRef.markForCheck();
    })
  }

  // On Search Button
  onSearch() {
    if(
      this.selectedOptions.movie != null || 
      this.selectedOptions.species != null || 
      this.selectedOptions.starship != null || 
      this.selectedOptions.vehicle != null) 
      {
        this.filteredPeopleList = this.peopleList;
      } else {
        return;
      };

    // Filter for the movie
    if(this.selectedOptions.movie != null) {
      this.filteredPeopleList = this.filteredPeopleList.filter(person =>
        person.films.includes(this.selectedOptions.movie.url)
      );
    }

    // Filter for the species
    if(this.selectedOptions.species != null) {
      this.filteredPeopleList = this.filteredPeopleList.filter(person =>
        person.species.includes(this.selectedOptions.species.url)
      );
    }

    // Filter for the vehicle
    if(this.selectedOptions.vehicle != null) {
      this.filteredPeopleList = this.filteredPeopleList.filter(person =>
        person.vehicles.includes(this.selectedOptions.vehicle.url)
      );
    }

    // Filter for Starships
    if(this.selectedOptions.starship != null) {
      this.filteredPeopleList = this.filteredPeopleList.filter(person =>
        person.starships.includes(this.selectedOptions.starship.url)
      );
    }
  }

  toggleDropdown(type: DropdownType) {
    const isCurrentlyOpen = this.dropdownStates[type];
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key as DropdownType] = false;
    });
    this.dropdownStates[type] = !isCurrentlyOpen;
  }

  selectOption(type: DropdownType, option: any) {
    this.selectedOptions[type] = option;
    this._changeDetectorRef.detectChanges();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.onGetPeopleList(this.currentPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onGetPeopleList(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onGetPeopleList(this.currentPage);
    }
  }

  getPagesArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

}
