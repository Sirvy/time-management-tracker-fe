export const mockStorage = {
    get<T = any>(key: string): T | null {
        const item = localStorage.getItem(`mock_${key}`);
        return item ? JSON.parse(item) : null;
    },
    set<T = any>(key: string, value: T): void {
        localStorage.setItem(`mock_${key}`, JSON.stringify(value));
    },
    update<T = any>(key: string, updater: (current: T | null) => T): void {
        const current = mockStorage.get<T>(`mock_${key}`);
        mockStorage.set(key, updater(current));
    },
    remove(key: string): void {
        localStorage.removeItem(`mock_${key}`);
    }
};