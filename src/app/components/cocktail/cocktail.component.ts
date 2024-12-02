import { Component, Input } from '@angular/core';
import { ICocktailItem } from '../../api';

@Component({
  selector: 'app-cocktail',
  imports: [],
  templateUrl: './cocktail.component.html',
  styleUrl: './cocktail.component.scss',
})
export class CocktailComponent {
  @Input() cocktail!: ICocktailItem;
}
