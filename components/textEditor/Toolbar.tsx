import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {toolBarActions} from './toolbarActions';
import {User} from '../../lib/types';
import {EditorState, Modifier, RichUtils} from 'draft-js';
import React from 'react';

// todo: Fix Tab indentation to add spaces before word instead of removing the word
// todo: hilght button if it is currently in use
interface ToolBarProps {
  userData: User;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  selectedTab: 'edit' | 'preview' | 'both';
  setSelectedtab: React.Dispatch<React.SetStateAction<'edit' | 'preview' | 'both'>>;
}
export default function Toolbar(props: ToolBarProps) {
  const editorState = props.editorState;
  const setEditorState = props.setEditorState;
  return (
    <div className="flex flex-col md:flex-row">
      <div className="order-last flex flex-1 flex-row space-x-[0.5px] pr-2 pl-0 md:order-first">
        {props.selectedTab === 'edit' ? (
          <p
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2
            border-x-slate-500 border-t-slate-500 bg-gray-400/70 bg-clip-padding px-2 
            text-white backdrop-blur-xl backdrop-filter"
          >
            Edit
          </p>
        ) : (
          <p
            onClick={() => props.setSelectedtab('edit')}
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 px-2 
            hover:border-x-slate-500 hover:border-t-slate-500 hover:bg-gray-400 hover:text-white"
          >
            Edit
          </p>
        )}

        {props.selectedTab === 'preview' ? (
          <p
            className="rounded-t-lg border-x-2 border-t-2
            border-x-slate-500 border-t-slate-500 bg-gray-400/70 bg-clip-padding px-2 
            text-white backdrop-blur-xl backdrop-filter"
          >
            Preview
          </p>
        ) : (
          <p
            onClick={() => props.setSelectedtab('preview')}
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 px-2
             hover:border-x-slate-500 hover:border-t-slate-500 hover:bg-gray-400 hover:text-white"
          >
            Preview
          </p>
        )}

        {props.selectedTab === 'both' ? (
          <div
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2
            border-x-slate-500 border-t-slate-500 bg-gray-400/70 bg-clip-padding px-2 pt-0.5
            text-white backdrop-blur-xl backdrop-filter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
              <path
                d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3
                0 416V96C0 60.65 28.65 32 64 32H448zM64 432H232V160H48V416C48 424.8 55.16 432 64 432zM280
                432H448C456.8 432 464 424.8 464 416V160H280V432z"
              />
            </svg>
          </div>
        ) : (
          <div
            onClick={() => props.setSelectedtab('both')}
            className="hover:text-whitehover:border-x-slate-500 text -slate-700 cursor-pointer rounded-t-lg border-x-2
            border-t-2 px-2 pt-0.5 text-slate-700 hover:border-x-slate-500 hover:border-t-slate-500 hover:bg-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
              <path
                d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3
                0 416V96C0 60.65 28.65 32 64 32H448zM64 432H232V160H48V416C48 424.8 55.16 432 64 432zM280
                432H448C456.8 432 464 424.8 464 416V160H280V432z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="order-first float-right flex flex-wrap px-2 pb-2 md:order-last md:flex-row-reverse">
        {toolBarActions.map((action, index) => {
          if (!action.adminOnly || (action.adminOnly && props.userData?.permissions.admin)) {
            return (
              <FontAwesomeIcon
                key={index}
                onClick={() => {
                  /**Section for Style elements: bold, italics etc */
                  if (action.style) {
                    setEditorState(RichUtils.toggleInlineStyle(editorState, action.style));
                  }

                  /**section for element blocks: paragraph, h1 etc */
                  if (action.block) {
                    if (action.block === 'code-block') {
                      setEditorState(RichUtils.toggleCode(editorState));
                    }
                    if (action.block === 'tab') {
                      const newContentState = Modifier.replaceText(
                        editorState.getCurrentContent(),
                        editorState.getSelection(),
                        '    '
                      );
                      setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
                    } else {
                      setEditorState(RichUtils.toggleBlockType(editorState, action.block));
                    }
                  }

                  if (action.link) {
                    const enteredLink = window.prompt('Add link');
                    if (enteredLink) {
                      const linkUrl = RichUtils.getDataObjectForLinkURL(enteredLink);
                      const selectionState = editorState.getSelection();
                      const contentStateWithEntity = editorState
                        .getCurrentContent()
                        .createEntity('LINK', 'MUTABLE', linkUrl);
                      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                      setEditorState(RichUtils.toggleLink(editorState, selectionState, entityKey));
                    }
                  }
                }}
                className={`mx-2 mb-3 h-4 w-4 cursor-pointer md:mb-0`}
                aria-hidden="true"
                icon={action.icon}
              />
            );
          } else {
            return <></>;
          }
        })}
      </div>
    </div>
  );
}
