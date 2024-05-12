'use client';

import styles from "./page.module.css";
import _debounce from 'lodash/debounce';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Footer from "../component/footer";

export default function Video({ params }) {
  const router = useRouter();

  const [anime, setAnime] = useState({});
  const [imageURL, setImageURL] = useState('');
  const [videoURL, setVideoURl] = useState(null);
  const [year, setYear] = useState('');
  const [score, setscore] = useState('N/A');
  const [episodes, setEpisodes] = useState([]);
 
  const getDataDebounced = _debounce(() => getData(), 300);

  useEffect(() => {
    getDataDebounced();
    return () => getDataDebounced.cancel();
  }, [router.asPath]);

  const getData = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${params.AnimeID}/full`); 
      const result = await response.json();
  
      console.log(result.data);
      setImageURL(result.data.images.jpg.large_image_url);
      setAnime(result.data);

      if(result.data.trailer.embed_url !== null) {
        setVideoURl(result.data.trailer.embed_url);
      }

      if(result.data.year === null) {
        setYear(result.data.aired.from.slice(0,4));
      } else {
        setYear(result.data.year);
      }

      if(result.data.score !== null) {
        setscore(result.data.score);
      }

    }
    catch(error) {
      console.log("An error occured while fetching data from api.");
      console.log(error);
    }
  }

  const getDataDebounced1 = _debounce(() => getEp(), 300);

  useEffect(() => {
    getDataDebounced1();
    return () => getDataDebounced1.cancel();
  }, [router.asPath]);

  const getEp = async () => {
    try {
      const resp = await fetch(`https://api.jikan.moe/v4/anime/${params.AnimeID}/videos/episodes`);
      const res = await resp.json();
  
      const page_limit = res.pagination.last_visible_page;
  
      const newData = [];
      // Loop through each page and fetch data sequentially with a delay
      for (let currentPage = page_limit; currentPage >= 1; currentPage--) {
        // Make API call to fetch data for the current page
        const response = await fetch(`https://api.jikan.moe/v4/anime/${params.AnimeID}/videos/episodes?page=${currentPage}`);
        const data = await response.json();

        // console.log(data.data);
        newData.push(... data.data);
  
        // Wait for approximately 333 milliseconds (3 API calls per second)
        await new Promise(resolve => setTimeout(resolve, 666));
      }
      newData.sort((a, b) => a.mal_id - b.mal_id);
      console.log(newData);
      setEpisodes(newData);
    } catch (error) {
      console.log("Error occurred while fetching data: ", error);
    }
  };

  const getDataDebounced2 = _debounce(() => getOtherAnime(), 300);

  const [recomm, setRecomm] = useState([]);

  useEffect(() => {
    getDataDebounced2();
    return () => getDataDebounced2.cancel();
  }, [router.asPath]);

  const getOtherAnime = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${params.AnimeID}/recommendations`);
      const result = await response.json();

      setRecomm(result.data);
    } catch (error) {
      console.log("Error occurred while fetching data: ", error);
    }
  };

  const getDataDebounced3 = _debounce(() => getReview(), 300);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getDataDebounced3();
    return () => getDataDebounced3.cancel();
  }, [router.asPath]);

  const getReview = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${params.AnimeID}/reviews`);
      const result = await response.json();

      console.log(result.data);
      setReviews(result.data);
    } catch (error) {
      console.log("Error occurred while fetching data: ", error);
    }
  };

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Function to check if the viewport width is less than a certain threshold (e.g., 768px)
    const checkIfMobileView = () => {
      setIsMobileView(window.innerWidth < 768); // Adjust the threshold as needed
    };

    // Call the function when the component mounts
    checkIfMobileView();

    // Add event listener to update the state when the window is resized
    window.addEventListener('resize', checkIfMobileView);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkIfMobileView);
    };
  }, []);
  
    return (
        <div className={styles.main}>

            <div className={styles.container}>
                <div>
                {videoURL ? (
                <iframe className={styles.video}
                width={940} // Set the width of the iframe
                height={485} // Set the height of the iframe
                src={videoURL && videoURL} // Set the src attribute to the YouTube embed URL
                allowfullScreen // Add the allowfullscreen attribute to enable fullscreen mode
                title="YouTube Video" // Add a title for accessibility
                ></iframe>
                ) : (
                <div className={styles.default}>
                  Sorry! Video not found
                </div>
                )}
                </div>
                <div className={styles.episodes}>
                    <p className={styles.heading_s}>Episodes</p>
                    <div className={styles.display}>
                    {episodes && episodes.map((ep, index) => (
                        <Link className={styles.link} href={`${ep.url}`}><div key={index} className={styles.tab}>{`${ep.episode}: ${ep.title}`}</div></Link>
                    ))}
                    </div>
                </div>
            </div>

            <div className={styles.container_bottom}>
              <div className={styles.left}>
              <div className={styles.details}>
                <div className={styles.image_box}>
                <Image className={styles.banner}
                src={imageURL && imageURL}
                alt="not found!"
                width={267}
                height={405}
                />
                <div className={styles.overlay}>
                  <ul>
                    <li style={{ float: 'left' }}>
                      <Image className={styles.star}
                      src="/star.png"
                      alt=""
                      width={28}
                      height={28}
                      />
                    </li>
                    <li style={{ float: 'left', marginLeft: '10px', color: '#FFDF00', fontSize: '18px', transform: 'translateY(6px)' }}>{score}</li>
                  </ul>
                </div>
                </div>
                <div className={styles.div}>
                  { anime && (
                  <ul className={styles.ul} key={anime.mal_id}>
                  <Link href={`/characters/${params.AnimeID}`}><li className={`${styles.li} ${styles.name}`}>{`${anime.title_english} [${anime.title_japanese}]`}</li></Link>
                  <li className={styles.li}>
                    {anime.synopsis && (
                      <span className={styles.text}>
                        {anime.synopsis.length < 401
                          ? anime.synopsis
                          : (
                            <>
                              {`${anime.synopsis.slice(0, 401)} ... `}
                              <Link href={anime.url} className={styles.Link}>See more</Link>
                            </>
                          )
                        }
                      </span>
                    )}
                  </li>
                  <li className={styles.li}>kind: <span className={styles.text}>{`${anime.type}`}</span></li>
                  <li className={styles.li}>episodes: <span className={styles.text}>{`${anime.episodes}`}</span></li>
                  <li className={styles.li}>aired on: <span className={styles.text}>{year ? year : 'N/A'}</span></li>
                  <li className={styles.li}>genres: <span className={styles.text}>
                  {anime.genres && anime.genres.map(genre => (
                  <span key={genre.id}>{genre.name} </span>
                  ))}
                  </span></li>
                  </ul>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className={styles.reviews}>
                <p className={styles.h}>
                <div className={styles.bar}></div>
                <div className={styles.header}>
                <p style={{ fontSize: '24px' }} className={styles.heading}>REVIEWS</p>
                <p className={styles.para}>See what people has to say about this Anime</p>
                </div>
                </p>
                {isMobileView ? (
                  <div className={styles.section}>
                  <div className={styles.show}>
                    {reviews && reviews.map((entry, index) => (
                    <div className={styles.review_section} key={index}>
                    <div className={styles.review_details}>
                      <div className={styles.user_pf} style={{ display: 'flex' }}>
                        <Image className={styles.pf}
                        src={entry.user.images.jpg.image_url && entry.user.images.jpg.image_url}
                        alt=""
                        width={42}
                        height={42}
                        />
                        <p className={styles.username}>
                          {entry.user.username} <br />
                          <p className={styles.date}>{entry.date.slice(0,10)}</p>
                        </p>
                      </div>

                      <p className={styles.revw}>
                        {entry.review.length < 921 ? entry.review : `${entry.review.slice(0,921)} ... `}
                        {entry.review.length >= 921 && (
                          <Link  className={styles.Link} href={entry.url}>
                            See More
                          </Link>
                        )}
                      </p>
                      <div className={styles.reactions}>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            style={{ transform: 'translateY(-4px)' }}
                            src="/like.svg"
                            alt=""
                            width={26}
                            height={26}
                            />
                          </li>
                          <li className={styles.ul_li} style={{ transform: 'translateY(4px)' }}>{entry.reactions.nice}</li>
                        </ul>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            src="/heart.svg"
                            alt=""
                            width={20}
                            height={20}
                            />
                          </li>
                          <li className={styles.ul_li}>{entry.reactions.love_it}</li>
                        </ul>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            src="/haha-logo.svg"
                            alt=""
                            width={20}
                            height={20}
                            />
                          </li>
                          <li className={styles.ul_li}>{entry.reactions.funny}</li>
                        </ul>
                      </div>
                    </div>
                    </div>
                    ))}
                  </div>
                  </div>    
                ) : (
                  <div className={styles.section}>
                  <div className={styles.show}>
                    {reviews && reviews.map((entry, index) => (
                    <div className={styles.review_section} key={index}>
                    <Image className={styles.pf}
                    src={entry.user.images.jpg.image_url && entry.user.images.jpg.image_url}
                    alt=""
                    width={42}
                    height={42}
                    />
                    <div className={styles.review_details}>
                      <p className={styles.username}>{entry.user.username}</p>
                      <p className={styles.date}>{entry.date.slice(0,10)}</p>
                      <p className={styles.revw}>
                        {entry.review.length < 921 ? entry.review : `${entry.review.slice(0,921)} ... `}
                        {entry.review.length >= 921 && (
                          <Link  className={styles.Link} href={entry.url}>
                            See More
                          </Link>
                        )}
                      </p>
                      <div className={styles.reactions}>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            style={{ transform: 'translateY(-4px)' }}
                            src="/like.svg"
                            alt=""
                            width={26}
                            height={26}
                            />
                          </li>
                          <li className={styles.ul_li} style={{ transform: 'translateY(4px)' }}>{entry.reactions.nice}</li>
                        </ul>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            src="/heart.svg"
                            alt=""
                            width={20}
                            height={20}
                            />
                          </li>
                          <li className={styles.ul_li}>{entry.reactions.love_it}</li>
                        </ul>
                        <ul className={styles.react}>
                          <li className={styles.ul_li}>
                            <Image class={styles.img_icon}
                            src="/haha-logo.svg"
                            alt=""
                            width={20}
                            height={20}
                            />
                          </li>
                          <li className={styles.ul_li}>{entry.reactions.funny}</li>
                        </ul>
                      </div>
                    </div>
                    </div>
                    ))}
                  </div>
                  </div>                 
                )}
              </div>

              </div>
              <div className={styles.similar}>
              <p className={styles.heading_s}>RECOMMENDED</p>
                <div className={`${styles.display} ${styles.h_large}`}>
                {recomm && recomm.map((anime) => (
                  <Link href={`/${anime.entry.mal_id}`} key={anime.entry.mal_id}>
                  <div className={styles.tab_large}>
                  <Image className={styles.img_s}
                  src={anime.entry.images.jpg.large_image_url && anime.entry.images.jpg.large_image_url}
                  alt=""
                  width={44}
                  height={44}
                  />
                  <div className={styles.content}>
                    <p className={styles.anime_h} style={{ fontWeight: '500', fontSize: '18px' }}>{anime.entry.title}</p>
                    <ul style={{ marginTop: '4px' }}>
                    <li style={{ float: 'left' }}>
                      <Image className={styles.star}
                      style={{ transform: 'translateY(0px)' }}
                      src="/star.png"
                      alt=""
                      width={18}
                      height={18}
                      />
                    </li>
                    <li style={{ float: 'left', marginLeft: '10px', color: '#FFDF00', fontSize: '14px', transform: 'translateY(0px)' }}>voted by {anime.votes}</li>
                  </ul>
                  </div>
                  </div>
                  </Link>
                  ))}
                </div>
              </div>
            </div>

            <Footer />
        </div>
    )
}