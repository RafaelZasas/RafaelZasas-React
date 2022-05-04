/* eslint-disable camelcase */
export interface Permissions {
  admin?: boolean;
  level: number;
}

export interface ClickUpTicketData {
  body: {
    name: string;
    markdown_description: string;
    tags: string[];
    status: string;
    priority?: number;
    notify_all: boolean;
    parent: null | string;
    links_to: null | string;
    check_required_custom_fields: boolean;
  };
}
