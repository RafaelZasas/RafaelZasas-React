import React, {useContext} from 'react';
import {
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import Toolbar from './Toolbar';
import {UserContext} from '../../lib/context';
import EditorContent from './EditorContent';

const initialState = {
  entityMap: {},
  blocks: [
    {
      text: '',
      key: 'foo',
      type: 'unstyled',
      entityRanges: [],
      depth: 1,
      inlineStyleRanges: [],
    },
  ],
};
export default function MyEditor() {
  const editor = React.useRef(null);
  const {user, userData} = useContext(UserContext);
  const {hasCommandModifier} = KeyBindingUtil;
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createWithContent(convertFromRaw(initialState))
  );

  function focusEditor() {
    editor.current.focus();
  }

  function myKeyBindingFn(e: React.KeyboardEvent<{}>): string | null {
    if (e.key === 'b' /* `B` key */ && hasCommandModifier(e)) {
      return 'bold';
    }

    if (e.key === 'u' /* `U` key */ && hasCommandModifier(e)) {
      return 'underline';
    }

    if (e.key === 'i' /* `U` key */ && hasCommandModifier(e)) {
      return 'italic';
    }
    if (e.key == 'Enter' && hasCommandModifier(e)) {
      return 'new-line';
    }
    return getDefaultKeyBinding(e);
  }

  function handleTab(e: React.KeyboardEvent<{}>) {
    e.preventDefault();

    if (e.shiftKey) {
      // TODO: FIX WHEN PR MERGED TO DRAFT JS
      const newContentState = Modifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), '    ');
      setEditorState(EditorState.push(editorState, newContentState, 'delete-character'));
    } else {
      const newContentState = Modifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), '    ');
      setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
    }
  }

  function handleKeyCommand(command: string): DraftHandleValue {
    switch (command) {
      case 'bold':
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
        return 'handled';
      case 'underline':
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
        return 'handled';
      case 'italic':
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
        return 'handled';
      case 'new-line':
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      default:
        return 'not-handled';
    }
  }

  return !userData ? (
    <></>
  ) : (
    <div className="flex flex-col">
      <Toolbar userData={userData} setEditorState={setEditorState} editorState={editorState} />
      <div className="flex-row">
        <div
          className="block h-64 w-full overflow-y-scroll rounded-md border-2 border-gray-300 bg-white/30 p-3 shadow-sm backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500"
          onClick={focusEditor}
        >
          <Editor
            ref={editor}
            editorKey={'editor'}
            editorState={editorState}
            onChange={setEditorState}
            spellCheck={false}
            keyBindingFn={myKeyBindingFn}
            handleKeyCommand={handleKeyCommand}
            onTab={handleTab}
            placeholder="Blog Entry..."
          />
        </div>
      </div>
      <div className="overflow-scroll-y container my-4 ">
        <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>
        <EditorContent editorState={editorState} />
      </div>
    </div>
  );
}
