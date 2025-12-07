export type Category = {
    id: string
    name: string
    description: string
    highlight?: string
    isCollection?: boolean
    isHomepage?: boolean
    canFilter: boolean
}

export type CategoryUIModel = Omit<Category, 'highlight'> & {
    highlight: File
}