import { useEffect, useState } from "react";

/*
  Crossfades through a project's screenshots.
  Every image is stacked in the same box with absolute positioning, and only the
  active one is faded in, so the slot keeps whatever size .image-wrapper gives it.
  Expects a positioned parent (relative) with a definite height.
*/
const RotatingImage = ({ images, alt, interval = 4000, delay = 0 }) => {

    const [index, setIndex] = useState(0);

    useEffect(() => {

        // nothing to rotate through
        if (images.length < 2) return;

        let cycle;

        // the delay staggers the projects so the cards don't all flip at once
        const firstSwap = setTimeout(() => {

            setIndex(i => (i + 1) % images.length);

            cycle = setInterval(
                () => setIndex(i => (i + 1) % images.length),
                interval
            );

        }, interval + delay);

        return () => {
            clearTimeout(firstSwap);
            clearInterval(cycle);
        };

    }, [images, interval, delay]);

    return (
        <>
            {images.map((src, i) => (
                <img
                key={src}
                src={src}
                /* only the first image names the project, the rest are the same
                   subject again and would just repeat themselves to a screen reader */
                alt={i === 0 ? alt : ""}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-contain rounded-xl transition-opacity duration-700 ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                }`}
                />
            ))}
        </>
    );
};

export default RotatingImage;
