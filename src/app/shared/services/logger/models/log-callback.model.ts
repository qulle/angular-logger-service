import { LogLevel } from '../types/log-level.type';

export interface LogCallback {
    icon: string;
    level: LogLevel;
    print: () => void;
}
