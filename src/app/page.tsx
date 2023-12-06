"use client";

import { Container } from '@mui/joy';
import styles from './page.module.css';
import { SearchContainer } from '@/components/shared/SearchContainer';

export default function Home() {
  return (
    <main className={styles.main}>
      <Container>
        <SearchContainer
        />
      </Container>
    </main>
  )
}
