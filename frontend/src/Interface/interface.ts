export interface Category {
    _id: string,
    name: string,
    color: string
}

export interface Task {
    _id: string | null,
    title: string,
    description?: string,
    timeSpent: number,
    date: Date,
    categoryId: string
}