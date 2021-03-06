import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxValidatorModule } from '@why520crazy/ngx-validator';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { AppTemplateDrivenUseCaseComponent } from './template-driven/use-case.component';
import { AppReactiveDrivenUseCaseComponent } from './reactive-driven/use-case.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { CodeExampleComponent } from './code-example/code-example.component';

export function hljsLanguages() {
    return [{ name: 'typescript', func: typescript }, { name: 'scss', func: scss }, { name: 'xml', func: xml }];
}

@NgModule({
    declarations: [
        AppComponent,
        CodeExampleComponent,
        AppTemplateDrivenUseCaseComponent,
        AppReactiveDrivenUseCaseComponent,
        CustomSelectComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgxValidatorModule.forRoot({
            validateOn: 'submit'
        }),
        HighlightModule.forRoot({
            languages: hljsLanguages
        }),
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: 'template',
                    pathMatch: 'full'
                },
                {
                    path: 'template',
                    component: AppTemplateDrivenUseCaseComponent
                },
                {
                    path: 'reactive',
                    component: AppReactiveDrivenUseCaseComponent
                }
            ],
            {
                useHash: true
            }
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
