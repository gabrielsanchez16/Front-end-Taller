export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    phone: string;
    logo?: FileList;
}


export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    logo?: string;
    suscription?: boolean;
    token: string;
    exp: number; 
}


