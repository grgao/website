import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Grace Gao</title>
        <meta name="description" content="Main web page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section id={styles.home}>
          <h1>This is the home page</h1>
        </section>
        <section id={styles.about}>
          <h1>About Me</h1>
          <h5>I am a squirrel.</h5>
        </section>
        <section id={styles.project}>
          <h1>Projects</h1>
        </section>
        <section id={styles.contact}>
          <h1>ring ring</h1>
        </section>
      </main>
    </>
  )
}