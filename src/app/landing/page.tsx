'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import styles from './landing.module.css';

function LandingContent() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const suitParam = sessionStorage.getItem('card_suit');
    const rankParam = sessionStorage.getItem('card_rank');

    if (!suitParam || !rankParam) {
      router.replace('/');
      return;
    }

    // Parse Rank first to check for Joker
    const rank = parseInt(rankParam, 16);
    const isJoker = rank === 14; // 'e' is 14

    let suitLetter = '';

    // Only map suit if NOT a Joker
    if (!isJoker) {
      const suitMap: { [key: string]: string } = {
        '1': 'D', // Diamonds
        '2': 'C', // Clubs
        '3': 'H', // Hearts
        '4': 'S', // Spades
      };

      suitLetter = suitMap[suitParam];
      if (!suitLetter) {
        setError('Invalid card data.');
        return;
      }
    }

    // Map Rank
    let rankLetter = '';

    if (!isJoker) {
      // Check if it's a digit 1-9
      if (/^[1-9]$/.test(rankParam)) {
        rankLetter = rankParam === '1' ? 'A' : rankParam;
      } else {
        // Handle a-d
        switch (rankParam.toLowerCase()) {
          case 'a': rankLetter = '0'; break; // 10
          case 'b': rankLetter = 'J'; break; // 11
          case 'c': rankLetter = 'Q'; break; // 12
          case 'd': rankLetter = 'K'; break; // 13
          default:
            setError('Invalid card data.');
            return;
        }
      }
    }

    // Construct URL
    let url = '';
    if (isJoker) {
      url = 'https://deckofcardsapi.com/static/img/X1.png';
    } else {
      url = `https://deckofcardsapi.com/static/img/${rankLetter}${suitLetter}.png`;
    }

    setImageUrl(url);

  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('card_suit');
    sessionStorage.removeItem('card_rank');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        imageUrl && (
          <div className={styles.cardWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Playing Card" className={styles.cardImage} />
          </div>
        )
      )}
      <button className={styles.button} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default function Landing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}
