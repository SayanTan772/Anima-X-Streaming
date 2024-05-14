'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import _debounce from 'lodash/debounce';
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // Anime streaming website

  const [ref, inView] = useInView();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const [foundResult, setFoundResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getDataDebounced();
    return () => getDataDebounced.cancel();
  }, [router.asPath]);

  useEffect(() => {
    if(inView) {
      if(page <= 1000) {
        setPage((prevPage) => prevPage + 1);
      }
      getData(page+1);
    }
  }, [inView]);

  const getData = async (page) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
      const result = await response.json();
  
      const newData = result.data;
      console.log(newData);
      setData((prevData) => [... prevData, ... newData]);
    }
    catch(error) {
      console.log("An error occured while fetching data from api.");
      console.log(error);
    }
  }

  const getDataDebounced = _debounce(() => getData(page), 300);

  const handleSearch = async (param) => {
    if(param.length > 1) {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${param}`);
        const result = await response.json();
  
        setFoundResult(result.data);
      }
      catch(error) {
        console.log("An error occured while fetching data from api.");
        console.log(error);
      }  
    } else if(param.length === 1) {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?letter=${param}`);
        const result = await response.json();
  
        setFoundResult(result.data);
      }
      catch(error) {
        console.log("An error occured while fetching data from api.");
        console.log(error);
      }  
    } else {
      setFoundResult([]);
    }
  }

  const renderData = foundResult.length > 0 ? foundResult : data;

  return (
    <div className={styles.main}>
      <div className={styles.wallpaper}>
        <div className={styles.overlay}>
          <p className={styles.h}>Explore the <br />Diverse Realm<br /> of <span className={styles.orange}>Anime Magic</span></p>
          <div className={styles.goku}></div>
          <div className={styles.input_div}>
            <input type="text" alt="" className={styles.searchbar} placeholder="Search any anime . . . ." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} spellCheck="false" />
            <button className={styles.search} onClick={() => handleSearch(searchQuery)}>
              <Image className={styles.search_icon}
              src="/chevron-right.svg"
              alt="icon"
              width={48}
              height={48}
              />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.display}>
      <div className={styles.container}>
        {
          renderData && renderData.map((item) => (
            <Link href={`/${item.mal_id}`}>
            <div className={styles.card}>
            <Image className={styles.img}
            src={item.images.webp.large_image_url}
            alt="opps!"
            width={280}
            height={265}
            />
            <div className={styles.title}>{item.title}</div>
            <div className={styles.info}>
              <ul className={styles.info_ul}>
                <li className={styles.item} style={{ marginLeft: '0px' }}>&#8226; {item.year ? item.year : "null"}</li>
                <li className={styles.item}>&#8226; EP {item.episodes}</li>
                <li className={styles.item}>&#8226; {item.type}</li>
              </ul>
            </div>
          </div>
            </Link>
          ))
        }
        <div className={styles.pre_loader} ref={ref}>
          <Image className={styles.loader}
          src="/my-loader.svg"
          alt="loader"
          width={96}
          height={96}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
