import { Component, signal } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Home } from "./home/home"
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
