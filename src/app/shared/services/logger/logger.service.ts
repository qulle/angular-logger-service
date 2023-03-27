import { Injectable } from '@angular/core';
import { LogLevel } from './types/log-level.type';
import { FrontendLogItem } from './models/frontend-log-item.model';
import { BackendLogItem } from './models/backend-log-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogCallback } from './models/log-callback.model';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { HostService } from '../host/host.service';
import * as moment from 'moment';

/**
 * About: Service responsible for logging information to the Browser Console and to a Database via remote Api
 */
@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    private static readonly LogHeaders = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        responseType: 'text' as const,
    };

    private readonly url: string;
    private readonly isProduction: boolean;
    private readonly buffer: Array<FrontendLogItem>;
    private readonly bufferSize: number;
    private readonly timeFormat: string;
    private readonly siteName: string;
    private readonly teamName: string;

    // Lookup object to translate LogLevel to appropriate console method
    private readonly consoleMethods: LogCallback[] = [
        { icon: '🐳', level: LogLevel.Debug, print: console.log },
        { icon: '🐸', level: LogLevel.Information, print: console.info },
        { icon: '🐠', level: LogLevel.Warning, print: console.warn },
        { icon: '🐝', level: LogLevel.Error, print: console.error },
        { icon: '🐞', level: LogLevel.Fatal, print: console.error },
    ];

    constructor(
        private readonly http: HttpClient,
        private readonly user: UserService,
        private readonly host: HostService
    ) {
        this.buffer = [];
        this.bufferSize = environment.logger.bufferSize;
        this.url = environment.logger.url;
        this.isProduction = environment.production;
        this.timeFormat = environment.logger.timeFormat;
        this.siteName = environment.site.name;
        this.teamName = environment.site.team;
    }

    private log(
        origin: string,
        method: string,
        message: string | object,
        level: LogLevel,
        logToRemote: boolean
    ): void {
        const timestamp = moment();
        const logToConsole = !this.isProduction;

        this.logToBuffer(timestamp, origin, method, message, level);

        if (logToConsole) {
            this.logToConsole(timestamp, origin, method, message, level);
        }

        if (logToRemote) {
            this.logToRemote(timestamp, origin, method, message, level);
        }
    }

    private logToBuffer(
        timestamp: moment.Moment,
        origin: string,
        method: string,
        message: string | object,
        level: LogLevel
    ): void {
        if (this.buffer.length > this.bufferSize) {
            this.clearBuffer();
        }

        const { icon = '🐸' } = this.getLogMethod(level);
        const frontendLogItem: FrontendLogItem = {
            level: level,
            icon: icon,
            origin: origin,
            method: method,
            message: message,
            timestamp: timestamp.format(this.timeFormat),
        };

        this.buffer.push(frontendLogItem);
    }

    private logToConsole(
        timestamp: moment.Moment,
        origin: string,
        method: string,
        message: string | object,
        level: LogLevel
    ): void {
        const { print = console.log, icon = '🐸' } = this.getLogMethod(level);

        const commonMessage = `${icon} ${timestamp.format(
            this.timeFormat
        )} [${origin}] ➜ [${method}]`;

        if (typeof message === 'string') {
            print(`${commonMessage} ${message.length > 0 ? '➜' : ''} ${message}`);
        } else {
            print(`${commonMessage} ➜ ${JSON.stringify(message)}`);
        }
    }

    private logToRemote(
        timestamp: moment.Moment,
        origin: string,
        method: string,
        message: string | object,
        level: LogLevel
    ): void {
        const serializedMessage =
            typeof message === 'string'
                ? message
                : JSON.stringify(message) || 'Error stringify the logged item';

        const backendLogItem: BackendLogItem = {
            fields: {
                site: this.siteName,
                team: this.teamName,
            },
            log: {
                level: LogLevel[level],
            },
            user: {
                name: this.user.getUser(),
            },
            host: {
                name: this.host.getHost(),
            },
            origin: origin,
            method: method,
            message: serializedMessage,
            timestamp: timestamp.format(this.timeFormat),
        };

        this.http.put(this.url, backendLogItem, LoggerService.LogHeaders);
    }

    private getLogMethod(level: LogLevel): LogCallback {
        return (
            this.consoleMethods.find(item => {
                return item.level === level;
            }) || <LogCallback>{}
        );
    }

    clearBuffer(): void {
        console.clear();

        this.buffer.splice(0, this.buffer.length);
    }

    dump(): void {
        console.clear();

        this.buffer.forEach(item => {
            const { print = console.log } = this.getLogMethod(item.level);

            print(item.message);
        });
    }

    getBuffer(): Array<FrontendLogItem> {
        return this.buffer;
    }

    debug(origin: string, method: string, message: string | object): void {
        this.log(origin, method, message, LogLevel.Debug, false);
    }

    information(origin: string, method: string, message: string | object): void {
        this.log(origin, method, message, LogLevel.Information, true);
    }

    warning(origin: string, method: string, message: string | object): void {
        this.log(origin, method, message, LogLevel.Warning, true);
    }

    error(origin: string, method: string, message: string | object): void {
        this.log(origin, method, message, LogLevel.Error, true);
    }

    fatal(origin: string, method: string, message: string | object): void {
        this.log(origin, method, message, LogLevel.Fatal, true);
    }
}
