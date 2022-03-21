interface Tag {
  name: string;
  id: string;
  color: string;
}

interface TagProps {
  tag: Tag;
  function?: Function;
}

function _getBackground(tagColor: string) {
  const colors = ['bg-blue-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-yellow-500', 'bg-red-500', 'bg-emerald-500'];
  const match = colors.filter((item) => item === tagColor);
  return match.length > 0 ? match[0] : 'bg-sky-500';
}

export default function Tag(props: TagProps) {
  const classes = ` inline-flex cursor-pointer items-center rounded-full border-2 border-slate-400/40
        bg-opacity-80 px-2.5 py-0.5 text-sm font-medium text-gray-200 hover:bg-opacity-100 md:mt-2 lg:mt-0`;
  return (
    <div
      onClick={() => props.function && props.function(props.tag)}
      className={`${classes} ${_getBackground(props.tag.color)}`}
    >
      {props.tag.name}
    </div>
  );
}
