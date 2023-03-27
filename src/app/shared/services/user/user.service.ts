import { Injectable } from '@angular/core';

/**
 * About: Mock service to return current user
 */
@Injectable({
    providedIn: 'root',
})
export class UserService {
    getUser(): string {
        return 'johndoe1234';
    }
}
