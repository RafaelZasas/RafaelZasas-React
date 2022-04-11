import Image from 'next/image';

const customLoader = ({src, width, quality}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

interface CustomImageProps {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  className?: string;
}
export default function CustomImage(props: CustomImageProps) {
  return (
    <Image
      loader={customLoader}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      className={props.className ?? 'pointer-events-none object-cover'}
    />
  );
}
