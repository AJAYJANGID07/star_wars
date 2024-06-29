import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { MovieList, SpeciesList, StarshipList, User, UserList, VehicleList } from "../interfaces/common.type";

@Injectable({
  providedIn: "root",
})
export class CommonService {
    private apiUrl = 'https://swapi.dev/api/';

    constructor(
        private _httpClient: HttpClient,
    ) {}

    // Fetch user data api
    getUser(page: number): Observable<UserList> {
        return this._httpClient.get<UserList>(`${this.apiUrl}/people?page=${page}`);
    }

    // Fetch movie data api
    fetchSpecies(speciesUrl: string): Observable<any> {
        return this._httpClient.get<any>(speciesUrl);
    }

    // Fetch movie data api
    getAllMovies(): Observable<MovieList> {
        return this._httpClient.get<MovieList>(`${this.apiUrl}/films`)
    }

    // Fetch species data api
    getSpecies(): Observable<SpeciesList> {
        return this._httpClient.get<SpeciesList>(`${this.apiUrl}species`)
    }

    // Fetch vehicle data api
    getVehicleList(): Observable<VehicleList> {
        return this._httpClient.get<VehicleList>(`${this.apiUrl}/vehicles`)
    }

    // Fetch starship data api
    getStarshipsList(): Observable<StarshipList> {
        return this._httpClient.get<StarshipList>(`${this.apiUrl}starships`)
    }

    // Fetch film data api
    fetchFilms(filmUrl: string): Observable<any> {
        return this._httpClient.get<any>(filmUrl);
    }

    // Fetch people by id api
    getUserById(id: string): Observable<User> {
        return this._httpClient.get<User>(`${this.apiUrl}/people/${id}/`)
    }

}
