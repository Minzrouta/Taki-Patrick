import { Component, signal } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Home } from "./home/home"
import { Footer } from "./footer/footer"
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
