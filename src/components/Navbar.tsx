import React from 'react';
import styles from '@/styles/Home.module.css';

const Navbar = () =>{
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <ul>
          <li className="home"><a href={"#" + styles.home}>Home</a></li>
          <li className="about"><a href={"#" + styles.about}>About Me</a></li>
          <li className="project"><a href={"#" + styles.project}>Projects</a></li>
          <li className="contact"><a href={"#" + styles.contact}>Contact</a></li>
        </ul>
       </div>
    </nav>
  )
}

export default Navbar
