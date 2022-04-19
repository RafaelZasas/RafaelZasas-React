export default function GlassCard({children, ...props}): JSX.Element {
  return (
    <div
      {...props}
      className={`${
        props?.className || ''
      } flex flex-1 flex-col justify-between bg-white/25 bg-clip-padding p-6 backdrop-blur-xl backdrop-filter dark:bg-black/25`}
    >
      {children}
    </div>
  );
}
