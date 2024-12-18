"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Manga } from '~/types/manga'

const MangaPage = () => {
    const params = useParams<{ id: string; }>()

    const [mangaData, setMangaData] = useState<Manga>()
    const [volumeChaptersData, setVolumeChaptersData] = useState([])
    const [currentValue, setCurrentValue] = useState<string>('en');

    const fetchVolumesChaptersData = (languageSelected: string) => {

        axios.get(`https://api.mangadex.org/manga/${params.id}/aggregate?translatedLanguage%5B%5D=${languageSelected}`)
            .then((res) => {
                setVolumeChaptersData(Object.values(res.data.volumes))
            })
    }

    const fetchMangaData = () => {
        axios.get(`https://api.mangadex.org/manga/${params.id}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=author`)
            .then((res) => setMangaData(res.data.data))
    }

    useEffect(() => {
        fetchMangaData()
        fetchVolumesChaptersData(currentValue)
    }, [])

    return (
        <div className='text-black flex flex-col items-center'>
            <img
                src={`https://uploads.mangadex.org/covers/${params.id}/${(mangaData?.relationships.find(rel => rel.type === "cover_art")?.attributes?.fileName)}`}
                alt="manga-cover"
                className='w-full h-auto'
            />
            <div className='text-4xl text-black'>{mangaData?.attributes.title.en ?? mangaData?.attributes.title.ja}</div>
        </div>
    )
}

export default MangaPage
