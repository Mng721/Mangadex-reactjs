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

export type Chapter = {
    id: string
    type: "chapter"
    attributes: ChapterAttributes
    relationships: Relationship[]
}

export type ChapterAttributes = {
    title: string
    volume: string
    chapter: string
    pages: number
    translatedLanguage: string
}
export type Volume = {
    volume: string
    count: number
    chapters: VolumeChapter

}
export type VolumeChapter = {
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

export type Relationship = {
    id: string
    type: string
    relate: string
    attributes: any
}