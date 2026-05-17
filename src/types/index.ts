export interface GameAccount {
    id: string;
    user_id: string;
    name: string;
    server: string;
    ar: number;
    wl: string;
    gender: string;
    created_at?: string;
}

export interface Profile {
    id: string;
    active_account_id: string;
    excluded_tags: string[];
    created_at?: string;
}

export interface CompletedTask {
    completedAt: string;
}

export type TaskMap = Record<string, CompletedTask>;
export type GameTaskMap = Record<string, TaskMap>;
export type AccountTaskMap = Record<string, GameTaskMap>;

export interface TaskRow {
    user_id: string;
    account_id: string;
    game_id: string;
    task_id: string;
    completed_at?: string;
}

export interface ExportData {
    version: number;
    exportedAt: string;
    gameId: string;
    account: {
        id: string;
        name: string;
        server: string;
        ar: number;
        wl: string;
        gender: string;
    };
    tasks: GameTaskMap;
}

export interface FormattedUser {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    identities: unknown[] | null;
}

export interface GameConfig {
    id: string;
    name: string;
    path: string;
    bgUrl: string;
    status: 'active' | 'inactive';
    tags: unknown[];
    navIcons: {
        home: string;
        planner: string;
        settings: string;
    };
}

export interface TagConfig {
    id: string;
    text: string;
    bgColor: string;
    textColor: string;
    parentId?: string;
}

export interface LabelConfig {
    text: string;
    bgColor: string;
    textColor: string;
}

export interface GameData {
    gameId: string;
    tasks: unknown[];
    events: unknown[];
    codes: unknown[];
    changelogs: unknown[];
}

export type ResetRule = 'daily' | 'weekly' | 'monthly' | 'monthly-16th';
export type ServerRegion = 'America' | 'Europe' | 'Asia';
export type GameId = 'genshin' | 'hsr' | 'zzz' | 'wuwa';
export type GameStatus = 'active' | 'inactive';