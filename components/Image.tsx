import Image, {ImageProps} from 'next/image';

const customLoader = ({src, width, quality}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function CustomImage(props: ImageProps) {
  return (
    <Image
      loader={customLoader}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      priority={props.priority || false}
      layout={props.layout || 'intrinsic'}
      objectFit={props.objectFit || 'none'}
      quality={props.quality || 75}
      className={props.className ?? 'pointer-events-none object-cover'}
    />
  );
}
