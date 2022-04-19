import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FormEventHandler} from 'react';

export interface FileData {
  name: string;
  size: string;
  sizeInKB: number;
  type: string;
  src: string;
}

export interface ButtonProps {
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  text: string;
  function?: Function;
  functionParams?: Array<string>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  buttonStyle?: 'danger' | 'warning' | 'info' | 'submit' | 'basic';
  hidden?: boolean;
  disabled?: boolean;
  handleSubmit?: FormEventHandler;
}
