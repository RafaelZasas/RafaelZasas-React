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
  },
  {
    icon: faListOl,
    adminOnly: false,
    block: 'ordered-list-item',
  },
  {
    icon: faAlignRight,
    adminOnly: false,
    block: 'text-right',
  },
  {
    icon: faAlignCenter,
    adminOnly: false,
    block: 'text-center',
  },
  {
    icon: faAlignLeft,
    adminOnly: false,
    block: 'text-left',
  },
  {
    icon: faCode,
    adminOnly: true,
    block: 'code-block',
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
  },
  {
    icon: faItalic,
    adminOnly: false,
    style: 'ITALIC',
  },
  {
    icon: faBold,
    adminOnly: false,
    style: 'BOLD',
  },
  {
    icon: faHeading,
    adminOnly: true,
    block: 'header-one',
  },
];
