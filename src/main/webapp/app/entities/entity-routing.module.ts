import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blog',
        data: { pageTitle: 'teamprojectApp.blog.home.title' },
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'teamprojectApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'teamprojectApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'travel-guide',
        data: { pageTitle: 'teamprojectApp.travelGuide.home.title' },
        loadChildren: () => import('./travel-guide/travel-guide.module').then(m => m.TravelGuideModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
