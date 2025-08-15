export class UserEntity {
    userId: string;
    email: string;
    name: string;
    balance: number;

    constructor(partial?: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
