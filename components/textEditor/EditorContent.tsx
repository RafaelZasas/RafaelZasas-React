import {convertToHTML} from 'draft-convert';
import {EditorState} from 'draft-js';

interface EditorContentProps {
  editorState: EditorState;
}
export default function EditorContent(props: EditorContentProps) {
  const html = convertToHTML({
    styleToHTML: (style) => {
      console.log(style);

      if (style === 'code-block') {
        return <span className="w-fit rounded-sm bg-gray-700 px-2 py-0.5 text-orange-500" />;
      }
      if (style === 'bold') {
        return <span className="font-bold" />;
      }
      //   todo: Fix Tab Logic
      if (style === 'tab') {
        return <p className="ml-4" />;
      }
    },
    blockToHTML: (block) => {
      if (block.type === 'new-line') {
        return <br />;
      }
      if (block.type === 'PARAGRAPH') {
        return <p />;
      }
      if (block.type === 'header-one') {
        return <h1 className="text-4xl" />;
      }
      if (block.type === 'text-center') {
        return <p className="text-center" />;
      }

      if (block.type === 'text-right') {
        return <p className="text-right" />;
      }

      if (block.type === 'text-left') {
        return <p className="text-left" />;
      }

      if (block.type === 'unordered-list-item') {
        return <li className="list-inside list-disc" />;
      }
      if (block.type === 'ordered-list-item') {
        return <li className="list-inside list-decimal" />;
      }
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === 'LINK') {
        return (
          <a className="cursor-pointer text-blue-500 underline visited:text-purple-500" href={entity.data.url}>
            {originalText}
          </a>
        );
      }
      return originalText;
    },
  })(props.editorState.getCurrentContent());

  return (
    <div className="container m-4 h-full w-full">
      <div dangerouslySetInnerHTML={{__html: html}}></div>
    </div>
  );
}
