import React, {useContext, useState} from 'react';
import {DraftHandleValue, Editor, EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import Toolbar from './Toolbar';
import {UserContext} from '../../lib/context';
import EditorContent from './EditorContent';
import 'draft-js/dist/Draft.css';

interface TextEditorProps {
  placeholder?: string;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

export default function TextEditor(props: TextEditorProps) {
  const editor = React.useRef(null);
  const {userData} = useContext(UserContext);
  const {hasCommandModifier} = KeyBindingUtil;
  const editorState = props.editorState;
  const setEditorState = props.setEditorState;
  const [selectedTab, setSelectedtab] = useState<'edit' | 'preview' | 'both'>('edit');

  function focusEditor() {
    editor.current.focus();
  }

  function _keyBindingFn(e: React.KeyboardEvent<{}>): string | null {
    if (e.key === 'b' /* `B` key */ && hasCommandModifier(e)) {
      return 'bold';
    }

    if (e.key === 'u' /* `U` key */ && hasCommandModifier(e)) {
      return 'underline';
    }

    if (e.key === 'i' /* `U` key */ && hasCommandModifier(e)) {
      return 'italic';
    }
    if (e.key == 'Enter' && e.shiftKey) {
      return 'shift-enter';
    }

    if (e.key == 'Tab') {
      const maxDepth = 4;
      setEditorState(RichUtils.onTab(e, editorState, maxDepth));
      return 'tab';
    }

    return getDefaultKeyBinding(e);
  }

  function _handleKeyCommand(command: string): DraftHandleValue {
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

      case 'shift-enter':
        if (RichUtils.getCurrentBlockType(editorState) === 'code-block') {
          setEditorState(RichUtils.toggleBlockType(editorState, 'unstyled'));
          // setEditorState(RichUtils.toggleCode(editorState));
        }
        // setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';

      default:
        return 'not-handled';
    }
  }

  const TextEditor = () => {
    return (
      <Editor
        ref={editor}
        editorKey={'editor'}
        editorState={editorState}
        onChange={setEditorState}
        spellCheck={true}
        autoCorrect={'on'}
        autoComplete={'on'}
        textAlignment={'left'}
        keyBindingFn={_keyBindingFn}
        handleKeyCommand={_handleKeyCommand}
        placeholder={props.placeholder ?? 'Blog Entry...'}
      />
    );
  };

  return !userData ? (
    // This needs to be empty in the case of usage in other areas eg: comments, announcements etc.
    <></>
  ) : (
    <div className="h-full w-full flex-1 flex-col">
      <Toolbar
        userData={userData}
        setEditorState={setEditorState}
        editorState={editorState}
        selectedTab={selectedTab}
        setSelectedtab={setSelectedtab}
      />
      {selectedTab === 'edit' && (
        <div
          className="h-full w-full max-w-full resize-y overflow-y-scroll rounded-md rounded-tl-none 
          border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter 
            dark:border-slate-500 dark:bg-black/30 dark:text-slate-100 md:resize"
          onClick={focusEditor}
        >
          <TextEditor />
        </div>
      )}
      {selectedTab === 'preview' && (
        <div
          className="block h-full w-full max-w-full resize-y overflow-y-scroll rounded-md rounded-tl-none 
          border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter 
           dark:border-slate-500 dark:bg-black/30 dark:text-slate-100 md:resize"
        >
          <EditorContent editorState={editorState} />
        </div>
      )}

      {selectedTab === 'both' && (
        <div className="grid h-full resize-y grid-cols-2">
          <div
            className="block h-full w-full max-w-full resize-y overflow-y-scroll rounded-md rounded-tl-none 
            border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter
             dark:border-slate-500 dark:bg-black/30 dark:text-slate-100"
            onClick={focusEditor}
          >
            <TextEditor />
          </div>
          <div
            className="block h-full w-full max-w-full resize-y overflow-y-scroll rounded-md
              border-2 border-gray-300 bg-gray-100/30 bg-clip-padding 
              p-3 shadow-sm backdrop-blur-xl backdrop-filter dark:border-slate-500 dark:bg-black/30 dark:text-slate-100"
          >
            <EditorContent editorState={editorState} />
          </div>
        </div>
      )}
    </div>
  );
}
