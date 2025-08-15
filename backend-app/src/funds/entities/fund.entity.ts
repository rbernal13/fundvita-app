export class FundEntity {
    fundId: string;
    name: string;
    minInvestment: number;
    category: string;

    constructor(partial?: Partial<FundEntity>) {
        Object.assign(this, partial);
    }
}
