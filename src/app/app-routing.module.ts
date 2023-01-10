import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PersonManagementComponent } from './person-management/person-management.component';

const routes: Routes = [{ path: 'home', component: HomeComponent },
{ path: 'person-management', component: PersonManagementComponent },
{ path: 'about', component: AboutComponent },
{path:'',redirectTo: '/home',pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
