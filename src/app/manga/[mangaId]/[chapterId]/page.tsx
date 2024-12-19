"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import "./chapter.css"
import useScrollListener from '~/hooks/useScrollListener'
const Chapter = () => {
    const params = useParams<{ mangaId: string; chapterId: string }>()
    const [chapterImgUrl, setChapterImgUrl] = useState<string[]>([])

    const [navClassList, setNavClassList] = useState([""]);
    const scroll = useScrollListener();

    // update classList of nav on scroll
    useEffect(() => {
        const _classList = [];

        if (scroll.y > 150 && scroll.y - scroll.lastY > 0)
            _classList.push("nav-bar--hidden");

        setNavClassList(_classList);
    }, [scroll.y, scroll.lastY]);

    const fetchChapterImgUrl = async () => {
        const url = await axios.get(`https://api.mangadex.org/at-home/server/${params.chapterId}?forcePort443=false`)
            .then((res) =>
                res.data.chapter.data.map((item: string) => `${res.data.baseUrl}/data/${res.data.chapter.hash}/${item}`)
            )
        setChapterImgUrl(url)
    }

    useEffect(() => { fetchChapterImgUrl() }, [])


    return (

        <div className='min-h-sceen w-full '>
            <nav className={`bg-[#333] fixed top-0 w-full flex flex-row justify-center gap-4 ${navClassList.join(" ")}`}>
                <a className='float-left no-underline text-white p-4 cursor-pointer hover:bg-[#ddd] hover:text-black'>Previous chapter</a>
                <a className='float-left no-underline text-white p-4 cursor-pointer hover:bg-[#ddd] hover:text-black'>Next chapter</a>
            </nav>

            {chapterImgUrl && <div className='w-full h-auto flex flex-col mt-8'>
                {
                    chapterImgUrl.map((img, index) => <img src={img} alt={`page-${index + 1}`} key={index}></img>)
                }
            </div>}
        </div>
    )
}

export default Chapter
