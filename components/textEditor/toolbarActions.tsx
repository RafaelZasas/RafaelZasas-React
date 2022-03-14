import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCode,
  faHeading,
  faIndent,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faOutdent,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

interface ToolBarAction {
  icon: IconDefinition;
  style?: string;
  link?: boolean;
  block?: string;
  adminOnly: boolean;
  id?: string;
}

export const toolBarActions: ToolBarAction[] = [
  {
    icon: faIndent,
    adminOnly: false,
    block: 'tab',
  },
  {
    icon: faOutdent,
    adminOnly: false,
    block: 'shift-tab',
  },
  {
    icon: faListUl,
    adminOnly: false,
    block: 'unordered-list-item',
    id: 'ul',
  },
  {
    icon: faListOl,
    adminOnly: false,
    block: 'ordered-list-item',
    id: 'ol',
  },
  {
    icon: faAlignRight,
    adminOnly: false,
    block: 'text-right',
    id: 'text-right',
  },
  {
    icon: faAlignCenter,
    adminOnly: false,
    block: 'text-center',
    id: 'text-center',
  },
  {
    icon: faAlignLeft,
    adminOnly: false,
    block: 'text-left',
    id: 'text-left',
  },
  {
    icon: faCode,
    adminOnly: true,
    style: 'CODE',
    id: 'code',
  },
  {
    icon: faLink,
    adminOnly: true,
    link: true,
  },
  {
    icon: faUnderline,
    adminOnly: false,
    style: 'UNDERLINE',
    id: 'underline',
  },
  {
    icon: faItalic,
    adminOnly: false,
    style: 'ITALIC',
    id: 'italic',
  },
  {
    icon: faBold,
    adminOnly: false,
    style: 'BOLD',
    id: 'bold',
  },
  {
    icon: faHeading,
    adminOnly: true,
    block: 'header-one',
    id: 'header-one',
  },
];
