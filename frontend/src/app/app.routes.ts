import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MoviesList } from './movies-list/movies-list';
import { AddMovie } from './add-movie/add-movie';
import { EditMovie } from './edit-movie/edit-movie';
import { PanelAdmin } from './panel-admin/panel-admin';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'movies', component: MoviesList },
    { path: 'add-movie', component: AddMovie },
    { path: 'edit-movie/:id', component: EditMovie },
    { path: 'admin', component: PanelAdmin }
];
