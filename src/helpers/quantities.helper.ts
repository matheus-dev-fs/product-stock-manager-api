export const toNumber = (v?: string | number): number => {
    if (v === undefined || v === null || v === '') {
        return NaN;
    };

    const n: number = Number(v);
    return Number.isFinite(n) ? n : NaN;
};

export const isMaxGteMin = (minimum?: string | number, maximum?: string | number): boolean => {
    if (minimum == null || maximum == null) {
        return true;
    }

    const mn: number = toNumber(minimum);
    const mx: number = toNumber(maximum);

    if (Number.isNaN(mn) || Number.isNaN(mx)) {
        return false;
    }

    return mx >= mn;
};
