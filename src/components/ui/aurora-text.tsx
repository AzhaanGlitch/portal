"use client";
import React from "react";
import styles from "./aurora-text.module.css";

export default function AuroraText({ text = "Aurora Text Animation" }: { text?: string }) {
    return (
        <div className=" grid place-items-center bg-black text-white font-inter">
            <div className="text-center relative ">
                <h1 className="relative font-extrabold text-[clamp(1rem,4vw,5rem)] tracking-tight m-0  overflow-hidden">
                    {text}
                    <div className={styles.aurora}>
                        <div className={styles["aurora__item"]}></div>
                        <div className={styles["aurora__item"]}></div>
                        <div className={styles["aurora__item"]}></div>
                        <div className={styles["aurora__item"]}></div>
                    </div>
                </h1>
            </div>
        </div>
    );
}
