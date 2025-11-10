export type Category = {
    id: string
    name: string
    description: string
    highlight?: string
}

export type CategoryUIModel = Omit<Category, 'highlight'> & {
    highlight: File
}