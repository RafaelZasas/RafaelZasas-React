import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {toolBarActions} from './toolbarActions';
import {UserData} from '../../lib/types';
import {EditorState, RichUtils} from 'draft-js';
import React, {Dispatch, SetStateAction} from 'react';

// todo: Fix Tab indentation to add spaces before word instead of removing the word
interface ToolBarProps {
  userData: UserData;
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  selectedTab: 'edit' | 'preview' | 'both';
  setSelectedtab: Dispatch<SetStateAction<'edit' | 'preview' | 'both'>>;
}
export default function Toolbar(props: ToolBarProps) {
  const editorState = props.editorState;
  const setEditorState = props.setEditorState;
  return (
    <div className="flex flex-col md:flex-row">
      <div className="order-last flex flex-1 flex-row items-end space-x-[0.5px] pr-2 pl-0 md:order-first">
        {props.selectedTab === 'edit' ? (
          <p
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 border-x-slate-500
            border-t-slate-500 bg-gray-400/70 bg-clip-padding py-0.5 px-2 
            text-white backdrop-blur-xl backdrop-filter dark:border-slate-500 dark:bg-gray-400/70 dark:text-white"
          >
            Edit
          </p>
        ) : (
          <p
            onClick={() => props.setSelectedtab('edit')}
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 py-0.5 px-2 hover:border-x-slate-500
            hover:border-t-slate-500 hover:bg-gray-400 hover:text-white dark:border-slate-500 dark:bg-black/60 dark:text-slate-300"
          >
            Edit
          </p>
        )}

        {props.selectedTab === 'preview' ? (
          <p
            className="rounded-t-lg border-x-2 border-t-2
            border-x-slate-500 border-t-slate-500 bg-gray-400/70 bg-clip-padding py-0.5 px-2 
            text-white backdrop-blur-xl backdrop-filter dark:border-slate-500 dark:bg-gray-400/70 dark:text-white"
          >
            Preview
          </p>
        ) : (
          <p
            onClick={() => props.setSelectedtab('preview')}
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 px-2 py-0.5 hover:border-x-slate-500
             hover:border-t-slate-500 hover:bg-gray-400 hover:text-white dark:border-slate-500 dark:bg-black/60 dark:text-slate-300"
          >
            Preview
          </p>
        )}

        {props.selectedTab === 'both' ? (
          <div
            className="cursor-pointer rounded-t-lg border-x-2 border-t-2 border-x-slate-500
            border-t-slate-500 bg-gray-400/70 bg-clip-padding py-1 px-2 
            text-white backdrop-blur-xl backdrop-filter dark:border-slate-500 dark:bg-gray-400/70 dark:text-white"
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
            border-t-2 px-2 py-1 text-slate-700 hover:border-x-slate-500 hover:border-t-slate-500 hover:bg-gray-400 hover:text-white
             dark:border-slate-500 dark:bg-black/60 dark:text-slate-300"
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
      <div className="order-first float-right flex flex-wrap-reverse px-2 pb-2 md:order-last md:flex-row-reverse">
        {toolBarActions.map((action, index) => {
          if (!action.adminOnly || (action.adminOnly && props.userData?.permissions.admin)) {
            return (
              <div
                key={index}
                className={`m-0.5 ${getSelectedActions(action) ? 'bg-blue-500/10 dark:bg-sky-500/10' : 'bg-none'}`}
              >
                <FontAwesomeIcon
                  onClick={() => {
                    // props.focusEditor();
                    /**Section for Style elements: bold, italics etc */
                    if (action.style) {
                      switch (action.style) {
                        case 'CODE':
                          setEditorState(RichUtils.toggleCode(editorState));

                        case 'text-center':
                          setEditorState(RichUtils.toggleInlineStyle(editorState, 'text-center'));
                        case 'text-right':
                          setEditorState(RichUtils.toggleInlineStyle(editorState, 'text-right'));

                        default:
                          setEditorState(RichUtils.toggleInlineStyle(editorState, action.style));
                      }
                    }

                    /**section for element blocks: paragraph, ul, ol etc. */
                    if (action.block) {
                      setEditorState(RichUtils.toggleBlockType(editorState, action.block));
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
                  className={`${
                    getSelectedActions(action) ? 'text-[#3b82f6] dark:text-[#3b82f6]' : 'text-black dark:text-white'
                  } mx-2 h-4 w-4 cursor-pointer hover:text-[#3b82f6] md:mb-0`}
                  aria-hidden="true"
                  icon={action.icon}
                />
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    </div>
  );

  function getSelectedActions(action) {
    const styles = editorState.getCurrentInlineStyle().has(action?.id?.toUpperCase());
    const blocks = RichUtils.getCurrentBlockType(editorState) === action.id;
    if (styles || blocks) {
      return true;
    } else {
      return false;
    }
  }
}
