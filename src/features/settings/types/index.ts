export interface Template {
    id: string;
    name: string;
    version: string;
    lastModified: string;
    file: File | string;
    status: 'current' | 'past';
}
