export type Manga = {
    id: string
    type: string
    attributes: {
        title: {
            en?: string
            ja?: string
        }
        tags: Tag[]
    }
    relationships: {
        id: string
        type: "author" | "artist" | "cover_art" | "manga"
        related?: string
        attributes?: {
            fileName?: string
            name?: string
        }
    }[]
}

export type Volume = {
    volume: string
    count: number
    chapters: Chapter

}
export type Chapter = {
    chapter: string
    id: string
    others: any
    count: number
}

export type Tag = {
    id: string
    type: string
    attributes: any
    relationships: any
}