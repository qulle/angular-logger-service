import { LogLevel } from '../types/log-level.type';

export interface FrontendLogItem {
    level: LogLevel;
    icon: string;
    origin: string;
    method: string;
    message: string | object;
    timestamp: string;
}
