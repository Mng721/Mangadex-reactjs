"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '~/components/ui/input'
import { useDebounce } from 'use-debounce'
import axios from "axios"
import { Manga } from '~/types/manga'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
const Home = () => {
    const router = useRouter()

    const [mangaList, setMangaList] = useState<Manga[]>([])
    const [searchMangaParam, setSearchMangaParam] = useState<string>("")
    const [debouncedValue] = useDebounce(searchMangaParam, 500);

    const fetchMangaList = (searchQuery: string) => {
        setMangaList([])
        axios.get(`https://api.mangadex.org/manga?limit=10&title=${searchQuery}&includedTagsMode=AND&excludedTagsMode=OR&availableTranslatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art`)
            .then((res) => {
                setMangaList(res.data.data)
            })
    }

    useEffect(() => {
        fetchMangaList(debouncedValue)
    }, [debouncedValue])

    return (
        <div className='bg-black flex flex-col w-full min-h-screen'>
            <Input
                value={searchMangaParam}
                placeholder='Search...'
                className='text-white'
                onChange={(e) => { setSearchMangaParam(e.target.value) }} />
            {mangaList.map((manga, index) =>
                <div
                    onClick={() => router.push(`/manga/${manga.id}`)}
                    className='flex flex-row justify-between items-center h-[150px] my-2 border rounded border-gray-400 hover:opacity-70'
                    key={index}>
                    <div className='text-white text-2xl font-bold'>{manga.attributes.title.en ?? manga.attributes.title.ja}</div>
                    <img
                        src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find((item) => item.type === "cover_art")?.attributes?.fileName}`}
                        alt='manga-img'
                        className='h-full w-auto' />
                </div>
            )}
        </div>
    )
}

export default Home
