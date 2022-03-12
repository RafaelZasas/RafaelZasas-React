import React, {useContext, useState} from 'react';
import {
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

interface TextEditorProps {
  comment?: boolean;
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
    if (e.key == 'Enter') {
      return e.shiftKey || e.ctrlKey ? 'new-line' : 'new-block';
    }

    return getDefaultKeyBinding(e);
  }

  function handleTab(e: React.KeyboardEvent<{}>) {
    e.preventDefault();

    if (e.shiftKey) {
      // TODO: FIX WHEN PR MERGED TO DRAFT JS
      // const newContentState = Modifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), '    ');
      // setEditorState(EditorState.push(editorState, newContentState, 'delete-character'));
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
      case 'new-block':
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const textWithEntity = Modifier.splitBlock(currentContent, selection);
        setEditorState(EditorState.push(editorState, textWithEntity, 'split-block'));
      default:
        return 'not-handled';
    }
  }

  return !userData ? (
    <></>
  ) : (
    <div className="flex flex-col">
      <Toolbar
        userData={userData}
        setEditorState={setEditorState}
        editorState={editorState}
        selectedTab={selectedTab}
        setSelectedtab={setSelectedtab}
      />
      <div className="flex-row">
        {selectedTab === 'edit' && (
          <div
            className="block h-64 w-full resize overflow-y-scroll rounded-md rounded-tl-none 
            border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter"
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
              placeholder={props.comment ? 'Enter comment...' : 'Blog Entry...'}
            />
          </div>
        )}
        {selectedTab === 'preview' && (
          <div
            className="block h-64 w-full resize overflow-y-scroll rounded-md rounded-tl-none
           border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter"
          >
            <EditorContent editorState={editorState} />
          </div>
        )}

        {selectedTab === 'both' && (
          <div className="grid grid-cols-2">
            <div
              className="block h-64 w-full resize-y overflow-y-scroll rounded-md rounded-tl-none 
            border-2 border-gray-300 bg-gray-100/30 bg-clip-padding p-3 shadow-sm backdrop-blur-xl backdrop-filter"
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
                placeholder={props.comment ? 'Enter comment...' : 'Blog Entry...'}
              />
            </div>
            <div
              className="block h-64 w-full resize-y overflow-y-scroll rounded-md rounded-tl-none
              border-2 border-gray-300 bg-gray-100/30 bg-clip-padding 
              p-3 shadow-sm backdrop-blur-xl backdrop-filter"
            >
              <EditorContent editorState={editorState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
