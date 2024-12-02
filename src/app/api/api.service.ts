import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICocktailItem, IGetCocktailsResponse } from './interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private _request<O, I extends { [param: string]: string } = {}>(
    path: string,
    params?: I,
  ): Observable<O> {
    return this.http.get<O>(`${path}`, { params });
  }

  public getRandomCocktail(): Observable<ICocktailItem | null> {
    return this._request<IGetCocktailsResponse>('random.php').pipe(
      map((response: IGetCocktailsResponse) =>
        !!response.drinks?.length ? response.drinks[0] : null,
      ),
      map((value: ICocktailItem | null) =>
        value ? this.getCocktailItem(value) : null,
      ),
    );
  }

  public searchCocktailsByName(
    name: string,
  ): Observable<IGetCocktailsResponse> {
    return this._request<IGetCocktailsResponse, { s: string }>('search.php', {
      s: name,
    }).pipe(
      map(
        (response: IGetCocktailsResponse) =>
          ({
            drinks:
              response.drinks?.map((value: ICocktailItem) =>
                this.getCocktailItem(value),
              ) || [],
          }) as IGetCocktailsResponse,
      ),
    );
  }

  private getIngredients(rest: any): string[] {
    const ingredientsList: string[] = Object.keys(rest).filter(
      (value: string) =>
        value.toLowerCase().includes('ingredient') && !!rest[value],
    );
    return ingredientsList.map((value: string) => rest[value]);
  }

  private getCocktailItem({
    idDrink,
    strDrink,
    strGlass,
    strDrinkThumb,
    strInstructions,
    ...rest
  }: ICocktailItem): ICocktailItem {
    return {
      idDrink,
      strDrink,
      strGlass,
      strDrinkThumb,
      strInstructions,
      strIngredients: this.getIngredients(rest),
    };
  }
}
