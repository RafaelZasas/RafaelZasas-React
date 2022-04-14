import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ChangeEventHandler, FormEventHandler, Fragment, ReactElement} from 'react';
import Button from './Button';

interface buttonProps {
  text: string;
  id: string;
  name: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  buttonStyle?: 'danger' | 'warning' | 'info' | 'submit';
  hidden?: boolean;
  handleOnChange: ChangeEventHandler<HTMLInputElement>;
}

/**
 * Reusable button component with optional icon(s) to the left or right of button text
 * Button will fill container space on small devices and decide
 */
export default function FileInputButton(props: buttonProps) {
  const onPickFile = (e) => {
    e.preventDefault();
    document.getElementById(props.id).click();
  };

  return (
    <Fragment>
      <Button text={props.text} type="button" buttonStyle="info" function={(e) => onPickFile(e)} />
      {/* <button onClick={(e) => onPickFile(e)}> Add </button> */}

      <input
        data-show-upload="true"
        data-show-caption="true"
        onChange={props.handleOnChange}
        type={'file'}
        className={'hidden'}
        accept="*"
        name={props.name || 'myFile'}
        id={props.id || 'myFile'}
      />
    </Fragment>
  );
}
