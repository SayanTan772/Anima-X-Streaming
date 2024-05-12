'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import _debounce from 'lodash/debounce';
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <ul className={styles.ul}>
                <li className={styles.links}><Link href="/">Home</Link></li>
                <li className={styles.links}><Link href="/featured">Top Featured</Link></li>
                <li className={styles.links}><Link href="/news">News</Link></li>
                <li className={styles.links}><Link href="/">Read Manga</Link></li>
            </ul>
            <div className={styles.content}>
                <p className={styles.describe}>Discover <span style={{ color: '#f0833a' }}>Animax</span>, your gateway to free Anime streaming! Watch movies online for free with our vast collection. Unleash the magic of Anime Magic from the comfort of your home.<br /><br />
                <span className={styles.orange} style={{ marginTop: '16px' }}>Lights, camera, stream!</span>
                </p>
            </div>
        </div>
    )
} 