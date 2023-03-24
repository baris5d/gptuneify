export interface User {
    id: string;
    display_name: string;
    email: string;
    images: {
        url: string;
    }[];
}
