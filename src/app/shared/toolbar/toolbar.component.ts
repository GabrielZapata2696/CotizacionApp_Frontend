import { Component, OnInit, Input } from '@angular/core';
import { IonToolbar, IonTitle, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [IonToolbar, IonTitle, IonMenuButton, IonButtons, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() showMenuButton = true;

  constructor() { }

  ngOnInit() {}

}
