import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Manga {
    id: string;
    title: string;
    createdAt: bigint;
    description: string;
    author: string;
    coverImage: string;
    stock: bigint;
    genre: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addManga(manga: Manga): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllManga(): Promise<void>;
    deleteManga(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMangaById(id: string): Promise<Manga>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllManga(): Promise<Array<Manga>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedManga(): Promise<void>;
    updateManga(manga: Manga): Promise<void>;
}
