import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoggerService } from './shared/services/logger/logger.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    private readonly LogPrefix = 'AppModule';

    constructor(private readonly logger: LoggerService) {
        this.logger.debug(this.LogPrefix, 'constructor', 'Application starting');
    }
}
