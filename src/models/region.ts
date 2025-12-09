export type Region = {
    id: string;
    name: string;
    description: string
    highlight?: string
    isCollection?: boolean
    canFilter: boolean
}

export type RegionUIModel = Omit<Region, 'highlight'> & {
    highlight: File
}