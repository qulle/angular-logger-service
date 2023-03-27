export interface BackendLogItem {
    fields: {
        site: string;
        team: string;
    };
    log: {
        level: string;
    };
    user: {
        name: string;
    };
    host: {
        name: string;
    };
    origin: string;
    method: string;
    message: string;
    timestamp: string;
}
