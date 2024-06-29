import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
    private apiUrl = 'https://swapi.dev/api/';

    constructor(
        private _httpClient: HttpClient,
    ) {}

    // Fetch user data api
    getUser(page: number): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}/people?page=${page}`);
    }

    // Fetch movie data api
    fetchSpecies(speciesUrl: string): Observable<any> {
        return this._httpClient.get<any>(speciesUrl);
    }

    // Fetch movie data api
    getAllMovies(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}/films`)
    }

    // Fetch species data api
    getSpecies(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}species`)
    }

    // Fetch vehicle data api
    getVehicleList(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}/vehicles`)
    }

    // Fetch starship data api
    getStarshipsList(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}starships`)
    }

    // Fetch film data api
    fetchFilms(filmUrl: string): Observable<any> {
        return this._httpClient.get<any>(filmUrl);
    }

    // Fetch people by id api
    getUserById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}/people/${id}/`)
    }

}
