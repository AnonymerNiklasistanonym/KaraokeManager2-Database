export interface IJimp {
    read(path: string): Promise<IJimpImage>;
}

export interface IJimpImage {
    contain(width: number, height: number): this;
    cover(width: number, height: number): this;
    writeAsync(fileName: string): Promise<void>;
}
