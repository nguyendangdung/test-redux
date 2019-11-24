export class Post {
    id: number;
    userId: number;
    title: string;
    content: string;
    created: Date;
    constructor(init?: Partial<Post>) {
        Object.assign(this, init);
    }
}


export class Product {
    id: number;
    name: string;
    constructor(parameters?: Partial<Product>) {
        Object.assign(this, parameters);
    }
}