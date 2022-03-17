function _classNames(...classes) {
  return classes.join(' ');
}
interface Tag {
  name: string;
  id: string;
  color: string;
}

interface TagProps {
  tag: Tag;
  function?: Function;
}

export default function Tag(props: TagProps) {
  const bgColor = `bg-${props.tag.color}-400`;
  const borderColor = `border-${props.tag.color}-500/50`;
  console.log(bgColor, borderColor);

  const styles = _classNames(bgColor, borderColor, '');

  return (
    <div
      onClick={() => props.function(props.tag)}
      className={`inline-flex border-2 ${bgColor} cursor-pointer
       items-center hover:bg-${props.tag.color}-500 rounded-full ${borderColor}
        px-2.5 py-0.5 text-sm font-medium text-gray-200 md:mt-2 lg:mt-0`}
    >
      {props.tag.name}
    </div>
  );
}
