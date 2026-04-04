import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MangaItem {
    id: bigint;
    title: string;
    createdAt: bigint;
    author: string;
    coverImage: ExternalBlob;
    stock: bigint;
    synopsis: string;
    isFeatured: boolean;
    genre: string;
    isNew: boolean;
    price: number;
    volumeCount: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addManga(newManga: MangaItem): Promise<MangaItem>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllManga(): Promise<Array<MangaItem>>;
    getByGenre(genre: string): Promise<Array<MangaItem>>;
    getByPriceRange(minPrice: number, maxPrice: number): Promise<Array<MangaItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedManga(): Promise<Array<MangaItem>>;
    getMangaById(id: bigint): Promise<MangaItem>;
    getNewArrivals(): Promise<Array<MangaItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeManga(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchByTitle(title: string): Promise<Array<MangaItem>>;
    seedSampleData(): Promise<void>;
    updateManga(manga: MangaItem): Promise<void>;
}
