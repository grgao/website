import { useState } from "react"
import styles from '@/styles/Button.module.css'

const NAMES = [
    "Grace",
    "Jack",
    "Emily",
    "Andrew",
    "Joey",
]

export function Button() {
    const [nameIndex, setNameIndex] = useState(0);

    const name = NAMES[nameIndex % 5];

    return <div>
        <p>Hello, {name}!</p>
        <button className={styles.button} onClick={function() {
            setNameIndex(nameIndex + 1);
        }}>Click me!</button>
    </div>
}