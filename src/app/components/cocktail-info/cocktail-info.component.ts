import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ICocktailItem } from '../../api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-cocktail-info',
  imports: [BadgeModule],
  templateUrl: './cocktail-info.component.html',
  styleUrl: './cocktail-info.component.scss',
})
export class CocktailInfoComponent implements OnInit {
  @Input() cocktail?: ICocktailItem;
  public model!: ICocktailItem;

  constructor(public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.model = this.config?.data?.cocktail || this.cocktail;
  }
}
