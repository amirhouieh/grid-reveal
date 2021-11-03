
export const getOptions = <T>(defaultOpts: T, opts: T|undefined): T => {
    return {...defaultOpts, ...(opts || {})}
}

export const range = (size: number): number[] => {
    return new Array(size).fill(null).map((_, i) => i);
}
