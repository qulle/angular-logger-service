# Angular Logger Service

## About

Service for easy logging to the console, internal buffer and remote location.

## Usage

Inject the service in any constructor in the application and call one of its public API methods.
```typescript
export class AppModule {
    private readonly LogPrefix = 'AppModule';

    constructor(
        private readonly logger: LoggerService
    ) {
        this.logger.debug(this.LogPrefix, 'constructor', 'Application starting');
    }
}
```

The above example will output the following content in the browser console.
```
🐳 2023-03-27 22:38:16:970 [AppModule] ➜ [constructor] ➜ Application starting
```

The messages that are logged can be of type `string` or `object`. The objects will be serialized as JSON.
```typescript
class MyComponent {
    private readonly LogPrefix = 'MyComponent';

    constructor(
        private readonly logger: LoggerService
    ) {}

    exampleButton(): void {
        const example = {
            name: 'John Doe',
            email: 'john.doe@localhost.com',
            age: 42
        };

        this.logger.information(this.LogPrefix, 'exampleButton', example);
    }
}
```

The above example will output the following content in the browser console.
```
🐸 2023-03-27 22:56:33:374 [MyComponent] ➜ [exampleButton] ➜ {"name":"John Doe","email":"john.doe@localhost.com","age":42}
```

The service exposed the following API.
```typescript
// Clear the console and the internal buffer
clearBuffer(): void;

// Clear the console and print the buffer to the console
dump(): void;

// Get the internal buffer (the last N logged messages)
getBuffer(): Array<FrontendLogItem>;

// 🐳 Debug level, messages will not log to remote
debug(origin: string, method: string, message: string | object): void;
    
// 🐸 Information level
information(origin: string, method: string, message: string | object): void;
    
// 🐠 Warning level
warning(origin: string, method: string, message: string | object): void;
    
// 🐝 Error level
error(origin: string, method: string, message: string | object): void;
    
// 🐞 Fatal level
fatal(origin: string, method: string, message: string | object): void;
```

## Author
[Qulle](https://github.com/qulle/)