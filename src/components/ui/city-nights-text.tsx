import styles from "./city-nights-text.module.css";
export default function CityNightsText({ text = "City Nights Text Animation" ,textStyle }: { text?: string,textStyle?:string }) {
    return (
        <h1 className={` ${textStyle ?? "font-extrabold text-[clamp(1.5rem,4vw,3rem)] font-inter"} ${styles["city-nights-text"]}`}>
            {text}
        </h1>
    );
}