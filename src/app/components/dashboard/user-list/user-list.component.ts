import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { FilteredUserList, Movie, Species, Starship, User, Vehicle } from 'src/app/interfaces/common.type';
import { CommonService } from 'src/app/services/common.service';

type DropdownType = 'movie' | 'species' | 'starship' | 'vehicle' | 'birthYear';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  peopleList: User[] = [];
  moviesList: Movie[] = [];
  speciesList: Species[] = [];
  vehicleList: Vehicle[] = [];
  starshipList: Starship[] = [];
  filteredPeopleList: FilteredUserList[] = [];
  isShowPaginationIcons: boolean = true;
  isLoading: boolean = false;

  // Array of birth year
  birthYearList = [
    '19BBY',
    '112BBY',
    '33BBY',
    '41.9BBY',
    '52BBY',
    '47BBY',
    '24BBY',
    '57BBY'
  ]

  // Pagination states
  currentPage: number = 1;
  totalPages: number = 0;

  dropdownStates: Record<DropdownType, boolean> = {
    movie: false,
    species: false,
    starship: false,
    vehicle: false,
    birthYear: false
  };

  selectedOptions: Record<DropdownType, any> = {
    movie: null,
    species: null,
    starship: null,
    vehicle: null,
    birthYear: null
  };

  constructor(
    private _commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router
    ) {}

  ngOnInit(): void {
    // Fetch Peoples List
    this.onGetPeopleList(this.currentPage);
    // Get Movies list
    this.onGetMovies();
    // Get Species list
    this.onGetSpeciesList();
    // Get Vehicle list
    this.onGetVehicleList();
    // Get Starship list
    this.onGetStarshipList();
  }

  // Fetch Peoples List
  onGetPeopleList(page: number) {
    this.isLoading = true;
    this._commonService.getUser(page).subscribe(res => {
      // Check Duplicate user present or not if duplicate user come then auto remove from the list
      const newPeople = res.results.filter((newPerson: User) => 
        !this.peopleList.some((existingPerson: User) => existingPerson.url === newPerson.url)
      );
      // Push the all fetched data into the peopleList
      this.peopleList.push(...newPeople);
      this.isShowPaginationIcons = true;
      this.filteredPeopleList = res.results;
      this.totalPages = Math.ceil(res.count / 10);
      this.fetchSpeciesData();
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
    },(error: any) => {
      this.isLoading = false;
      console.log(error);
      this._changeDetectorRef.markForCheck();
    })
  }

  // Put species data into the people list to convert from url to actual data
  fetchSpeciesData(): void {
    const speciesObservables: Observable<any>[] = [];
    this.filteredPeopleList.forEach(person => {
      person.species.forEach((speciesUrl: string) => {
        speciesObservables.push(this._commonService.fetchSpecies(speciesUrl));
      });
    });
    forkJoin(speciesObservables).subscribe(
      (speciesData: Species[]) => {
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
      this.selectedOptions.vehicle != null ||
      this.selectedOptions.birthYear != null)
      {
        this.isShowPaginationIcons = false;
        this.filteredPeopleList = this.peopleList;
      } else {
        return this.onGetPeopleList(this.currentPage);
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

    // Filter fot birth year
    if(this.selectedOptions.birthYear != null) {
      this.filteredPeopleList = this.filteredPeopleList.filter(person =>
        person.birth_year === this.selectedOptions.birthYear
      );
    }
  }

  // Toggle dropdown handler
  toggleDropdown(type: DropdownType) {
    const isCurrentlyOpen = this.dropdownStates[type];
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key as DropdownType] = false;
    });
    this.dropdownStates[type] = !isCurrentlyOpen;
  }

  // Selected option value
  selectOption(type: DropdownType, option: any) {
    this.selectedOptions[type] = option;
    this._changeDetectorRef.detectChanges();
  }

  // Go to another page
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.onGetPeopleList(this.currentPage);
  }

  // Next Page Result
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onGetPeopleList(this.currentPage);
    }
  }

  // Prev Page Result
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onGetPeopleList(this.currentPage);
    }
  }

  getPagesArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Navigate into the details page
  navigateIntoUserDetails(url: string) {
    const match = url.match(/\/(\d+)\/$/);
    const id = match ? match[1] : null;
    this._router.navigate(['/user-details', id]);
  }

}
