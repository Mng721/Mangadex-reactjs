"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import "./chapter.css"
import useScrollListener from '~/hooks/useScrollListener'
import { Chapter as ChapterType, Relationship } from '~/types/manga'
import { BASE_URL } from '~/util/constant'
import { cn } from '~/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'
import { Command, CommandGroup, CommandItem, CommandList } from '~/components/ui/command'
import { set } from 'zod'
const Chapter = () => {
    const params = useParams<{ mangaId: string; chapterId: string }>()
    const router = useRouter()
    const [chapterImgUrl, setChapterImgUrl] = useState<string[]>([])
    const [chapterData, setChapterData] = useState<ChapterType>()
    const [error, setError] = useState(false)
    const [allChapter, setAllChapter] = useState<any[]>([])
    const [navClassList, setNavClassList] = useState([""]);
    const [chapterIndex, setChapterIndex] = useState(0)
    const scroll = useScrollListener();
    const [currentOffset, setCurrentOffset] = useState(0);
    const [language, setLanguage] = useState<string>("")

    const LIMIT = 100
    // update classList of nav on scroll
    useEffect(() => {
        const _classList = [];

        if (scroll.y > 150 && scroll.y - scroll.lastY > 0)
            _classList.push("nav-bar--hidden");

        setNavClassList(_classList);
    }, [scroll.y, scroll.lastY]);

    const getChapterData = async () => {
        await axios({
            method: 'GET',
            url: `${BASE_URL}/chapter/${params.chapterId}`
        }).then(res => {
            setChapterData(res.data.data)
            setLanguage(res.data.data.attributes.translatedLanguage)
            getMangaChapter(res.data.data.attributes.translatedLanguage, res.data.data)
        });
    }

    const getMangaChapter = async (language: string, chapterData: ChapterType) => {
        await axios({
            method: 'GET',
            url: `${BASE_URL}/manga/${params.mangaId}/feed?limit=${LIMIT}&translatedLanguage%5B%5D=${language}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5Bchapter%5D=asc&offset=${currentOffset}`,
        }).then(res => {
            setChapterIndex(
                res.data.data
                    .findIndex(
                        (item: any) => item.id === chapterData.id
                    ))
            if (res.data.data.length === 100 && res.data.offset < res.data.total) {
                setCurrentOffset(res.data.offset + LIMIT)
            }

            const newAllChapterData = res.data.data.map((item: any) => {
                return {
                    chapter: item.attributes.chapter,
                    title: item.attributes.title ?? null,
                    id: item.id
                }
            })
            setAllChapter([...newAllChapterData, ...allChapter])
        }
        ).catch((error) => {
            console.log(error)
            setError(true)
        });
    }

    const goToNextChapter = () => {
        if (allChapter[chapterIndex + 1] && allChapter) {
            router.replace(`/manga/${params.mangaId}/${allChapter[chapterIndex + 1].id}`)
            return
        }
        router.back()
    }

    const goToPreviousChapter = () => {
        if (allChapter[chapterIndex - 1] && allChapter) {
            router.replace(`/manga/${params.mangaId}/${allChapter[chapterIndex - 1].id}`)
            return
        }
        router.back()
    }
    const fetchChapterImgUrl = async () => {
        const url = await axios.get(`https://api.mangadex.org/at-home/server/${params.chapterId}?forcePort443=false`)
            .then((res) =>
                res.data.chapter.data.map((item: string) => `${res.data.baseUrl}/data/${res.data.chapter.hash}/${item}`)
            )
            .catch(() => {
                setError(true)
            })

        setChapterImgUrl(url)
    }

    useEffect(() => {
        fetchChapterImgUrl()
        getChapterData()
    }, [])

    useEffect(() => {
        if (chapterData)
            getMangaChapter(language, chapterData)
    }, [currentOffset])
    return (
        <div className='min-h-sceen w-full bg-teal-300'>
            <nav className={`bg-[#333] fixed h-auto top-0 w-full flex flex-row gap-4 ${navClassList.join(" ")}`}>
                <a
                    onClick={goToPreviousChapter}
                    className='float-left no-underline text-white p-4 cursor-pointer hover:bg-[#ddd] hover:text-black text-center basis-1/3'>Previous chapter</a>
                <div className='basis-1/3 flex flex-col flex-1 mx-4 justify-center items-center'>
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="basis-1/3 justify-between bg-black text-white"
                            >
                                {chapterData && <div className={cn(
                                    'text-white  text-xl truncate max-w-[72px]',
                                    "md:px-2 md:py-1 md:max-w-36"
                                )}>
                                    {`Chapter ${chapterData?.attributes.chapter}${chapterData.attributes.title ? `: ${chapterData.attributes.title}` : ""}`}
                                </div>}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command className='bg-black text-white'>
                                <CommandList>
                                    <CommandGroup>
                                        {allChapter.map((chapter: any) => (
                                            <CommandItem
                                                key={chapter.chapter}
                                                value={chapter.chapter}
                                                onSelect={(currentValue) => {
                                                    router.replace(`/manga/${params.mangaId}/${chapter.id}`)
                                                }}
                                                className='bg-black text-white'
                                            >
                                                {`Chap ${chapter.chapter}`}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <a
                    onClick={goToNextChapter}
                    className='float-left no-underline text-white p-4 cursor-pointer hover:bg-[#ddd] hover:text-black text-center basis-1/3'>Next chapter</a>
            </nav>

            {!error
                ? <div className='w-full h-auto flex flex-col mt-10 md:px-6'>
                    {
                        chapterImgUrl.map((img, index) => <img src={img} alt={`page-${index + 1}`} key={index}></img>)
                    }
                </div>
                : <div className='h-screen flex flex-col justify-center items-center'>
                    No data
                    <div className='border rounded-lg bg-yellow-500 cursor-pointer p-4' onClick={() => router.back()}>
                        Go back
                    </div>
                </div>}
        </div>
    )
}

export default Chapter
