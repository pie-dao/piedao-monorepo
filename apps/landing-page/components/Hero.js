import Image from "next/image";
import pieDaoLogo from "../public/piedao_logo.png";
import separator from "../public/separator.svg";
import arrowUp from "../public/arrow_green.svg";
import content from "../content/en_EN.json";
import Button from "./Button";

const Hero = ({}) => {
  return (
    <section
      className={`
      bg-primary w-full justify-evenly content-center grid
      text-center min-h-screen bg-no-repeat bg-cover 
      -bg-[center_top_1rem] bg-[url('/bg_lines.svg')] mb-8`}
    >
      <div className="px-6 md:px-24 container mx-auto">
        <div className="hidden md:block mb-8">
          <Image src={pieDaoLogo} alt="PieDao Logo" />
        </div>
        <div className="hidden md:block mb-10">
          <Image src={separator} alt="separator" />
        </div>
        <div className="mb-12">
          <h2 className="font-bold uppercase text-sm md:text-xl">
            {content.hero.sub_title}
          </h2>
          <div className="relative mb-6">
            <h1 className="uppercase text-4xl md:text-6xl title-gradient">
              {content.hero.title}
            </h1>
            <p className="absolute uppercase text-4xl md:text-6xl title-gradient w-full top-2 left-6 opacity-25">
              {content.hero.title}
            </p>
            <p className="absolute uppercase text-4xl md:text-6xl title-gradient w-full top-2 right-6 opacity-25">
              {content.hero.title}
            </p>
          </div>
          <p className="font-bold text-sm md:text-md">
            {content.hero.content_highlight}
          </p>
          <p className="text-sm md:text-md mt-6 md:mt-0">
            {content.hero.content_text}
          </p>
        </div>
        <div>
          <Button className="uppercase mb-4" gradient large>
            {content.hero.call_to_action}
          </Button>
          <div className="flex justify-center relative flex-col items-center">
            <Image src={arrowUp} alt="arrow up" className="up" />
            <h5 className="glitch mt-2">
              <span aria-hidden="true">{content.hero.call_to_text}</span>
              {content.hero.call_to_text}
              <span aria-hidden="true">{content.hero.call_to_text}</span>
            </h5>
            <h6 className="glitch">
              <span aria-hidden="true">{content.hero.call_to_text_2}</span>
              {content.hero.call_to_text_2}
              <span aria-hidden="true">{content.hero.call_to_text_2}</span>
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
