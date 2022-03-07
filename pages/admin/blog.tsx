import TextEditor from '../../components/textEditor/TextEditor';

export default function BlogPage({}) {
  return (
    <div className="flex min-h-screen flex-col justify-items-center p-4 align-middle">
      <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
      <div className="flex-row">
        <div className="container mx-auto py-2 sm:px-6 lg:px-8">
          <TextEditor />
        </div>
      </div>
    </div>
  );
}
