export type Member = {
    id: string
    name: string
    role: string
    description: string
    photo?: string
    instagram: string
    order: number
}

export type MemberUIModel = Omit<Member, 'photo'> & {
    photo: File
}
