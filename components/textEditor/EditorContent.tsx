import {convertToHTML} from 'draft-convert';
import {convertToRaw, EditorState} from 'draft-js';

interface EditorContentProps {
  editorState: EditorState;
}
export default function EditorContent(props: EditorContentProps) {
  const html = convertToHTML({
    styleToHTML: (style) => {
      if (style === 'BOLD') {
        return <span className="font-bold" />;
      }
      if (style === 'UNDERLINE') {
        return <span className="underline" />;
      }

      if (style === 'CODE') {
        return <p className="w-fit rounded-sm bg-gray-700 px-2 py-0.5 text-orange-500" />;
      }

      // @ts-ignore
      if (style === 'H1') {
        return <p className="text-4xl" />;
      }
    },
    blockToHTML: (block) => {
      if (block.type === 'unstyled' && block.text === '') {
        return <br />;
      }
      if (block.type === 'new-line' || block.type === 'new-block') {
        return <br />;
      }

      if (block.type === 'new-line') {
        return <br />;
      }
      //   todo: Fix Tab Logic
      if (block.type === 'tab') {
        return <span className="ml-4" />;
      }
      if (block.type === 'paragraph') {
        return <p />;
      }

      if (block.type === 'text-right') {
        return <div className="text-right" />;
      }
      if (block.type === 'text-center') {
        return <div className="text-center" />;
      }

      if (block.type === 'text-left') {
        return <div className="text-left" />;
      }

      if (block.type === 'unordered-list-item') {
        return _getUnorderedList(block.depth);
      }
      if (block.type === 'ordered-list-item') {
        return _getOrderedList(block.depth);
      }
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === 'LINK') {
        var httpsCheck = /^(http|https)/;
        let url = entity.data.url;
        if (!httpsCheck.test(String(entity.data.url).toLowerCase()) == true) {
          url = 'https://' + url;
        }
        return (
          <a
            className="cursor-pointer text-blue-500 underline visited:text-purple-500"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            {originalText}
          </a>
        );
      }
      return originalText;
    },
  })(props.editorState.getCurrentContent());

  return (
    <div className="container h-full w-full">
      <div dangerouslySetInnerHTML={{__html: html}}></div>
      {/* <div>{JSON.stringify(convertToRaw(props.editorState.getCurrentContent()), null, '\t')}</div> */}
    </div>
  );
}

function _getOrderedList(blockDepth: number) {
  let style: string;

  switch (blockDepth) {
    case 1:
      style = `list-style-position: inside;
              list-style-type: lower-alpha;
              text-indent: 1.5rem;`;
      break;
    case 2:
      style = `list-style-position: inside;
              list-style-type: lower-roman;
              text-indent: 3rem;`;
      break;
    case 3:
      style = `list-style-position: inside;
              list-style-type: upper-alpha;
              text-indent: 4.5rem;`;
      break;
    case 4:
      style = `list-style-position: inside;
              list-style-type: upper-roman;
              text-indent: 6rem;`;
      break;
    default:
      style = `list-style-position: inside;
              list-style-type: lower-decimal;`;
  }

  return {
    start: `<li style="${style}">`,
    end: '</li>',
    nest: '<ol style="margin-top: 8px; margin-bottom: 8px;">',
    nestStart: '<ol>',
    nestEnd: '</ol>',
  };
}

function _getUnorderedList(blockDepth: number) {
  let style: string;

  switch (blockDepth) {
    case 1:
      style = `list-style-position: inside;
              list-style-type: circle;
              text-indent: 1.5rem;`;
      break;
    case 2:
      style = `list-style-position: inside;
              list-style-type: square;
              text-indent: 3rem;`;
      break;
    case 3:
      style = `list-style-position: inside;
              list-style-type: disc;
              text-indent: 4.5rem;`;
      break;
    case 4:
      style = `list-style-position: inside;
              list-style-type: circle;
              text-indent: 6rem;`;
      break;
    default:
      style = `list-style-position: inside;
              list-style-type: disc;`;
  }

  return {
    start: `<li style="${style}">`,
    end: '</li>',
    nest: '<ul>',
    nestStart: '<ul style="margin-top: 8px; margin-bottom: 8px;">',
    nestEnd: '</ul>',
  };
}
