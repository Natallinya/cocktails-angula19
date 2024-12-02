import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService, ICocktailItem } from '../../api';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { IModelItem } from '../../interfaces';
import { State } from '../../enums';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CocktailInfoComponent } from '../../components/cocktail-info/cocktail-info.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-random-cocktail',
  imports: [AsyncPipe, ProgressSpinnerModule, CocktailInfoComponent, Button],
  templateUrl: './random-cocktail.component.html',
  styleUrl: './random-cocktail.component.scss',
})
export class RandomCocktailComponent implements OnInit {
  public model$!: Observable<IModelItem<ICocktailItem>>;
  public refresh$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly state: typeof State = State;

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.model$ = this.initModel();
    this.apiService.getRandomCocktail().subscribe();
  }

  private initModel(): Observable<IModelItem<ICocktailItem>> {
    return this.refresh$.pipe(switchMap(() => this.getModel()));
  }

  private getModel(): Observable<IModelItem<ICocktailItem>> {
    return this.apiService.getRandomCocktail().pipe(
      tap(
        (response: ICocktailItem | null) =>
          (this.config.header = response?.strDrink),
      ),
      map((response: ICocktailItem | null) => ({
        ...(response && { item: response }),
        state: !!response ? State.READY : State.EMPTY,
      })),
      catchError(() => of({ state: State.ERROR })),
      startWith({ state: State.PENDING }),
    );
  }
}
