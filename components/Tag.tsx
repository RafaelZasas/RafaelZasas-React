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
  // todo: use tag colors from db in way that doesnt break.
  return (
    <div
      onClick={() => props.function(props.tag)}
      className={`inline-flex cursor-pointer items-center rounded-full border-2 border-${props.tag.color}-600/30
        bg-${props.tag.color}-500/70 px-2.5 py-0.5 text-sm font-medium text-gray-200 hover:bg-${props.tag.color}-500 md:mt-2 lg:mt-0`}
    >
      {props.tag.name}
    </div>
  );
}
