"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 2) {
      setError('Invalid password format.');
      return;
    }

    const lastTwo = password.slice(-2);
    const suitChar = lastTwo[0];
    const rankChar = lastTwo[1];

    // Parse Rank first to check for Joker
    const rank = parseInt(rankChar, 16);

    // Valid ranks: 1-9, a-d (10-13), e (14 - Joker)
    if (isNaN(rank) || rank < 1 || rank > 14) {
      setError('Incorrect username or password.');
      return;
    }

    // Validate Suit ONLY if not Joker (rank 14)
    if (rank !== 14) {
      const suit = parseInt(suitChar, 10);
      if (isNaN(suit) || suit < 1 || suit > 4) {
        setError('Incorrect username or password.');
        return;
      }
    }

    // Store in sessionStorage and redirect
    sessionStorage.setItem('card_suit', suitChar);
    sessionStorage.setItem('card_rank', rankChar);
    router.push('/landing');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Username or email address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
