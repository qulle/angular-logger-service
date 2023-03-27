import { Injectable } from '@angular/core';

/**
 * About: Mock service to return current host
 */
@Injectable({
    providedIn: 'root',
})
export class HostService {
    getHost(): string {
        return '127.0.0.1';
    }
}
