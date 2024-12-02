import { Component, input, InputSignal, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { ApiService, ICocktailItem, IGetCocktailsResponse } from '../../api';
import { IModelItem } from '../../interfaces';
import { State } from '../../enums';
import { AsyncPipe } from '@angular/common';
import { CocktailComponent } from '../../components/cocktail/cocktail.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { toObservable } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { CocktailInfoComponent } from '../../components/cocktail-info/cocktail-info.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-cocktails',
  imports: [AsyncPipe, CocktailComponent, ProgressSpinnerModule, Button],
  templateUrl: './cocktails.component.html',
  styleUrl: './cocktails.component.scss',
})
export class CocktailsComponent implements OnInit {
  public name: InputSignal<string> = input('');
  public model$!: Observable<IModelItem<ICocktailItem[]>>;
  public refresh$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public state: typeof State = State;

  private name$: Observable<string> = toObservable(this.name);

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.model$ = this.initModel();
  }

  public openInfo(cocktail: ICocktailItem): void {
    this.dialogService.open(CocktailInfoComponent, {
      data: {
        cocktail,
      },
      header: cocktail.strDrink,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  private initModel(): Observable<IModelItem<ICocktailItem[]>> {
    return combineLatest([this.refresh$, this.name$]).pipe(
      switchMap(([, name]: [boolean, string]) => this.getModel(name)),
    );
  }

  private getModel(name: string): Observable<IModelItem<ICocktailItem[]>> {
    return this.apiService.searchCocktailsByName(name).pipe(
      map((response: IGetCocktailsResponse) => ({
        item: response.drinks,
        state: response.drinks?.length ? State.READY : State.EMPTY,
      })),
      catchError(() => of({ state: State.ERROR })),
      startWith({ state: State.PENDING }),
    );
  }
}
