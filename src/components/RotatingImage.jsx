import { useEffect, useState } from "react";

/*
  Crossfades through a project's screenshots in the showcase section.

  Every image is stacked in the same box with absolute positioning and only the
  active one is faded in, so the slot keeps whatever size .image-wrapper gives
  it and nothing reflows as the images swap. This means the parent must be
  position: relative with a definite height, which is why the surrounding <a>
  carries "block relative w-full h-full" in ShowcaseSection. Putting those on
  the link rather than on a wrapper div preserves the xl:px-5 / 2xl:px-12
  padding on the right hand cards.

  props:
    images   - array of paths, displayed in order. One image renders statically.
    alt      - project name, used for the accessible name of the first image.
    interval - ms each image stays on screen.
    delay    - ms added before the first swap only, used to stagger the cards
               so they do not all flip on the same beat.
*/
const RotatingImage = ({ images, alt, interval = 4000, delay = 0 }) => {

    /* index into images of the one currently faded in */
    const [index, setIndex] = useState(0);

    useEffect(() => {

        // nothing to rotate through, leave the single image on screen
        if (images.length < 2) return;

        let cycle;

        /* the first swap waits interval + delay, every later one just interval.
           the delay is what staggers this card against the others */
        const firstSwap = setTimeout(() => {

            // wrap back to 0 after the last image
            setIndex(i => (i + 1) % images.length);

            cycle = setInterval(
                () => setIndex(i => (i + 1) % images.length),
                interval
            );

        }, interval + delay);

        /* clear both timers on unmount, otherwise the interval keeps calling
           setIndex on an unmounted component */
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
                /* only the visible one is worth fetching up front; the others are
                   large screenshots and load when the card nears the viewport */
                loading={i === 0 ? "eager" : "lazy"}
                /* all stacked in the same place, opacity is the only difference.
                   these utilities override the img rules in index.css because
                   Tailwind's utilities layer outranks its components layer */
                className={`absolute inset-0 w-full h-full object-contain rounded-xl transition-opacity duration-700 ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                }`}
                />
            ))}
        </>
    );
};

export default RotatingImage;
