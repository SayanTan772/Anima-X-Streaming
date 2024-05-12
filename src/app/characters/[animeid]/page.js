'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import _debounce from 'lodash/debounce';
import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer";
import Link from "next/link";
// import Footer from "..../components/footer";

export default function Characters({ params }) {
  const router = useRouter();

//   const [ref, inView] = useInView();
  const [data, setData] = useState([]);

  const [foundResult, setFoundResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getDataDebounced();
    return () => getDataDebounced.cancel();
  }, [router.asPath]);

  const getData = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${params.animeid}/characters`);
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

  const getDataDebounced = _debounce(() => getData(), 300);

  const [english, setEnglish] = useState('');
  const [japanese, setJapanese] = useState('');

  useEffect(() => {
    getDataDebounced1();
    return () => getDataDebounced1.cancel();
  }, [router.asPath]); 

  const getAnime = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${params.animeid}`);
      const result = await response.json();
  
      console.log(result.data.title_english, result.data.title_japanese);
      setEnglish(result.data.title_english);
      setJapanese(result.data.title_japanese);
    }
    catch(error) {
      console.log("An error occured while fetching data from api.");
      console.log(error);
    }
  }

  const getDataDebounced1 = _debounce(() => getAnime(), 300);

  const handleSearch = () => {
    const charFound = data.filter((character) =>
      character.character.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFoundResult(charFound);
  };

  const renderData = foundResult.length > 0 ? foundResult : data;

  return (
    <div className={styles.main}>
      <div className={styles.wallpaper}>
        <div className={styles.overlay}>
          <p className={styles.h}>Explore the <br />Diverse Realm<br /> of <span className={styles.orange}>Anime Characters</span></p>
          {/* <div className={styles.goku}></div> */}
          <div className={styles.input_div}>
            <input type="text" alt="" className={styles.searchbar} placeholder="Search any Character . . . ." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} spellCheck="false" />
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
        <h1 className={styles.h1}>{`${english}`} <span className={styles.orange}>[ { japanese } ]</span></h1>
      <div className={styles.container}>
        {
          renderData && renderData.map((item) => (
            <div className={styles.card} key={`${item.character.mal_id}`}>
            <div className={styles.image_container}>
            <Link href={item.character.url}>
            <Image className={styles.img}
            src={
                item.character.images &&
                item.character.images.jpg &&
                item.character.images.jpg.image_url
            }
            alt="character"
            width={218}
            height={265}
            />
            </Link>
            </div>
            <div className={styles.title}>{item.character.name}</div>
            <div className={styles.info}>
              <ul className={styles.info_ul}>
                <li className={styles.item} style={{ marginLeft: '0px', color: '#f0833a' }}>{item.role ? item.role : "null"}</li>
                <li className={styles.item} style={{ display: 'flex', height: '20px', justifyContent: 'center', alignItems: 'center' }}>
                    <Image className={styles.star}
                    src="/star.png"
                    alt="star"
                    width={20}
                    height={20}
                    />
                    <span className={styles.fav}>{ item.favorites }</span>
                </li>
              </ul>
            </div>
          </div>
          ))
        }
        {/* <div className={styles.pre_loader} ref={ref}>
          <Image className={styles.loader}
          src="/my-loader.svg"
          alt="loader"
          width={96}
          height={96}
          />
        </div> */}
      </div>

      </div>
    </div>
  );
}
