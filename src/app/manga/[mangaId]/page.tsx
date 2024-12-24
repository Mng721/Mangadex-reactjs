"use client"
import axios from 'axios'

import { Check, ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Manga, Volume } from '~/types/manga'

import { Button } from "~/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible"
import { cn } from '~/lib/utils'
import { BASE_URL } from '~/util/constant'

const languages = [
    {
        value: "en",
        label: "English"
    },
    {
        value: "vi",
        label: "Vietnamese"
    },
    {
        value: "ja",
        label: "Japanese"
    }
]

const MangaPage = () => {
    const params = useParams()
    const router = useRouter()

    const [mangaData, setMangaData] = useState<Manga>()
    const [volumeChaptersData, setVolumeChaptersData] = useState<Volume[]>([])
    const [languageOpen, setLanguageOpen] = useState(false)
    const [value, setValue] = useState<string>('en');
    const [volumeOpen, setVolumeOpen] = useState<{ [id: string]: boolean }>({})

    const fetchVolumeChaptersData = (languageSelected: string) => {
        axios.get(`${BASE_URL}/manga/${params.mangaId}/aggregate?translatedLanguage%5B%5D=${languageSelected}`)
            .then((res) => {
                setVolumeChaptersData(Object.values(res.data.volumes))
            })
    }

    const fetchMangaData = async () => {
        await axios.get(`${BASE_URL}/manga/${params.mangaId}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=author`)
            .then((res) => setMangaData(res.data.data))
    }

    const getLastestChapter = async () => {
        await axios({
            method: 'GET',
            url: `${BASE_URL}/manga/${params.mangaId}/feed?translatedLanguage[]=${value}&order[chapter]=desc&limit=1`
        }).then(res => router.push(`./${mangaData?.id}/${res.data.data[0].id}`));

    }

    const getFirstChapter = async () => {
        await axios({
            method: 'GET',
            url: `${BASE_URL}/manga/${params.mangaId}/feed?translatedLanguage[]=${value}&order[chapter]=asc&limit=1`
        }).then(res => router.push(`./${mangaData?.id}/${res.data.data[0].id}`));

    }

    useEffect(() => {
        fetchMangaData()
        fetchVolumeChaptersData(value)
    }, [])

    useEffect(() => {
        fetchVolumeChaptersData(value)
    }, [value])

    return (
        <div className='text-black flex flex-col items-center bg-black min-h-screen'>
            <div className=' w-full h-[70vh] relative'>
                <img
                    src={`https://uploads.mangadex.org/covers/${params.mangaId}/${(mangaData?.relationships.find(rel => rel.type === "cover_art")?.attributes?.fileName)}`}
                    alt="manga-cover"
                    className='object-cover h-full w-full absolute'
                />

                <div className='absolute bg-gradient-to-b from-transparent to-black inset-0'></div>
                <div className='w-full h-full bg-transparent relative z-10'>
                    <div className='absolute bottom-0 left-0'>
                        <div className='text-4xl text-white'>{mangaData?.attributes.title?.en ?? mangaData?.attributes.title?.ja}</div>
                        {mangaData?.relationships.find(rel => rel.type === "author")?.attributes?.name &&
                            <div className='text-gray-300 text-2xl cursor-pointer italic'>{mangaData?.relationships.find(rel => rel.type === "author")?.attributes?.name}</div>}
                        <div className='text-gray-300 line-clamp-1'>{mangaData?.attributes.tags.map((tag, index) => {
                            if (index === mangaData.attributes.tags.length - 1) {
                                return tag.attributes.name.en
                            }
                            return `${tag.attributes.name.en}, `
                        })}</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center gap-2'>
                <div className={
                    cn(
                        "rounded-lg bg-gray-700 text-white p-3 text-2xl",
                        "hover:bg-gray-500 hover:cursor-pointer",
                        volumeChaptersData.length === 0 ? "bg-gray-900 text-gray-500 pointer-events-none" : ""
                    )
                }
                    onClick={getFirstChapter}
                >
                    Read first
                </div>
                <div className={
                    cn(
                        "rounded-lg bg-gray-700 text-white p-3 text-2xl",
                        "hover:bg-gray-500 hover:cursor-pointer",
                        volumeChaptersData.length === 0 ? "bg-gray-900 text-gray-500 pointer-events-none" : ""
                    )
                }
                    onClick={getLastestChapter}>
                    Read last
                </div>
            </div>
            <div className='w-full flex flex-row items-center p-4'>
                <div className='text-white mr-4'>Choose language: </div>
                <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-[200px] justify-between bg-black text-white"
                        >
                            {value
                                ? languages.find((language) => language.value === value)?.label
                                : "Select language..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command className='bg-black text-white'>
                            <CommandList>
                                <CommandGroup>
                                    {languages.map((language) => (
                                        <CommandItem
                                            key={language.value}
                                            value={language.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setLanguageOpen(false)
                                            }}
                                            className='bg-black text-white'
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    'bg-black text-white',
                                                    value === language.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {language.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            {volumeChaptersData && <div className='w-full'>
                {volumeChaptersData.map(vol =>
                    <div
                        key={vol.volume}
                        className='text-white'>
                        <Collapsible open={volumeOpen[vol.volume]} onOpenChange={() => (setVolumeOpen({ ...volumeOpen, [vol.volume]: !volumeOpen[vol.volume] }))}>
                            <CollapsibleTrigger
                                className={
                                    cn(
                                        'flex flex-row justify-between items-center w-full',
                                        'md:px-10')}>
                                <div className='text-3xl font-semibold'>
                                    {
                                        vol.volume === "none"
                                            ? "None"
                                            : `Volume ${vol.volume}`
                                    }
                                </div>
                                {volumeOpen[vol.volume] ? <ChevronDown /> : <ChevronRight />
                                }
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {
                                    Object.values(vol.chapters).map((chapter, index) => <div
                                        key={`chapter-${index + 1}`}
                                        className={
                                            cn(
                                                'p-3 text-xl w-full cursor-pointer',
                                                'hover:bg-gray-900',
                                                'md:px-12'
                                            )}
                                        onClick={() => router.push(`./${mangaData?.id}/${chapter.id}`)}>
                                        {`Chapter ${chapter.chapter}`}
                                    </div>
                                    )
                                }
                            </CollapsibleContent>
                        </Collapsible>

                    </div>
                )}
            </div>}
        </div>
    )
}

export default MangaPage
