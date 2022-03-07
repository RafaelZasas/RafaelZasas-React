import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
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
    style: 'tab',
  },
  {
    icon: faOutdent,
    adminOnly: false,
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
    block: 'TEXT-RIGHT',
  },
  {
    icon: faAlignCenter,
    adminOnly: false,
    block: 'TEXT-CENTER',
  },
  {
    icon: faAlignLeft,
    adminOnly: false,
    block: 'TEXT-LEFT',
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
