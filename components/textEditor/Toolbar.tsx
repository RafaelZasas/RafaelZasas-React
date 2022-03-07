import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {toolBarActions} from './toolbarActions';
import {User} from '../../lib/types';
import {EditorState, RichUtils} from 'draft-js';

interface ToolBarProps {
  userData: User;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}
export default function Toolbar(props: ToolBarProps) {
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
                  props.setEditorState(RichUtils.toggleInlineStyle(props.editorState, action.style));
                }

                if (action.block) {
                  props.setEditorState(RichUtils.toggleBlockType(props.editorState, action.block));
                }
                if (action.link) {
                  const linkUrl = RichUtils.getDataObjectForLinkURL(window.prompt('Add link'));
                  const selectionState = props.editorState.getSelection();
                  const contentStateWithEntity = props.editorState
                    .getCurrentContent()
                    .createEntity('LINK', 'MUTABLE', linkUrl);
                  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                  props.setEditorState(RichUtils.toggleLink(props.editorState, selectionState, entityKey));
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
                  props.setEditorState(RichUtils.toggleInlineStyle(props.editorState, action.style));
                }
                if (action.block) {
                  props.setEditorState(RichUtils.toggleBlockType(props.editorState, action.block));
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
