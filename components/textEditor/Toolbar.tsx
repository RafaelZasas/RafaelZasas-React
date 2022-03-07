import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {toolBarActions} from './toolbarActions';
import {User} from '../../lib/types';
import {EditorState, Modifier, RichUtils} from 'draft-js';

// todo: Fix Tab indentation to add spaces before word instead of removing the word
// todo: hilght button if it is currently in use
interface ToolBarProps {
  userData: User;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}
export default function Toolbar(props: ToolBarProps) {
  const editorState = props.editorState;
  const setEditorState = props.setEditorState;
  return (
    <div className="flex flex-row-reverse px-2 pb-2">
      {toolBarActions.map((action, index) => {
        if (action.adminOnly) {
          return !props.userData?.permissions.admin ? (
            <></>
          ) : (
            <FontAwesomeIcon
              key={index}
              onClick={() => {
                if (action.style) {
                  if (action.style === 'code-block') {
                    setEditorState(RichUtils.toggleCode(editorState));
                  }
                  setEditorState(RichUtils.toggleInlineStyle(editorState, action.style));
                }

                if (action.block) {
                  if (action.block === 'tab') {
                    console.log('tab');
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
              className={`mx-2 h-4 w-4 cursor-pointer`}
              aria-hidden="true"
              icon={action.icon}
            />
          );
        } else {
          return (
            <FontAwesomeIcon
              key={index}
              onClick={() => {
                if (action.style) {
                  setEditorState(RichUtils.toggleInlineStyle(editorState, action.style));
                }
                if (action.block === 'tab') {
                  console.log('tab');
                  const newContentState = Modifier.replaceText(
                    editorState.getCurrentContent(),
                    editorState.getSelection(),
                    '    '
                  );
                  setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
                } else {
                  setEditorState(RichUtils.toggleBlockType(editorState, action.block));
                }
              }}
              className="mx-2 h-4 w-4 cursor-pointer"
              aria-hidden="true"
              icon={action.icon}
            />
          );
        }
      })}
    </div>
  );
}
