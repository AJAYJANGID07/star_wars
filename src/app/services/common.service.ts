import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
    private apiUrl = 'https://swapi.dev/api/';

    constructor(
        private http: HttpClient,
    ) {}

    getPeoples(page: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/people?page=${page}`);
    }

    fetchSpecies(speciesUrl: string): Observable<any> {
        return this.http.get<any>(speciesUrl);
    }

    getAllMovies(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/films`)
    }

    getSpecies(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}species`)
    }

    getVehicleList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/vehicles`)
    }

    getStarshipsList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}starships`)
    }

    fetchFilms(filmUrl: string): Observable<any> {
        return this.http.get<any>(filmUrl);
    }

    getPeopleByFilm(title: string): Observable<any> {
        const params = new HttpParams().set('search', title);
        return this.http.get<any>(`${this.apiUrl}/people/`, { params });
    }

}
