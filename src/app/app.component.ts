import { Component, signal, WritableSignal } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CocktailsComponent } from './containers/cocktails/cocktails.component';
import { DialogService } from 'primeng/dynamicdialog';
import { RandomCocktailComponent } from './containers/random-cocktail/random-cocktail.component';
import { FloatLabelModule } from 'primeng/floatlabel';

export const NAME_FIELD_PATTERN: RegExp = new RegExp(/[a-zA-Z\s]/);

@Component({
  selector: 'app-root',
  imports: [
    CalendarModule,
    FormsModule,
    InputTextModule,
    CocktailsComponent,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  public name: WritableSignal<string> = signal('');
  public nameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(NAME_FIELD_PATTERN),
  ]);

  constructor(private dialogService: DialogService) {}

  public setName(): void {
    if (this.nameControl.invalid || this.name() === this.nameControl.value) {
      return;
    }
    this.name.set(this.nameControl.value);
  }

  public openRandom(): void {
    this.dialogService.open(RandomCocktailComponent, {
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }
}
