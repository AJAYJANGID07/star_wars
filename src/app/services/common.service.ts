import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
    private apiUrl = 'https://swapi.dev/api/';

    constructor(
        private http: HttpClient,
    ) {}

    getPeoples(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/people`)
    }

    fetchSpecies(speciesUrl: string): Observable<any> {
        return this.http.get<any>(speciesUrl);
    }

    getAllMovies(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/films`)
    }

    getSpecies(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/species`)
    }

    getVehicleList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/vehicles`)
    }

    getStarshipsList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/starships`)
    }

    fetchFilms(filmUrl: string): Observable<any> {
        return this.http.get<any>(filmUrl);
    }

}
