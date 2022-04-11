import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FormEventHandler} from 'react';

interface buttonProps {
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  text: string;
  function?: Function;
  functionParams?: Array<string>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  buttonStyle?: 'danger' | 'warning' | 'info' | 'submit';
  hidden?: boolean;
  handleSubmit?: FormEventHandler;
}

/**
 * Reusable button component with optional icon(s) to the left or right of button text
 * Button will fill container space on small devices and decide
 */
export default function Button(props: buttonProps) {
  function getStyle() {
    let buttonClass = `
            w-full md:w-auto items-center px-4 py-2
            border border-transparent drop-shadow-xl text-base font-medium rounded-md 
            focus:outline-none focus:ring-2 focus:ring-offset-2 `;
    switch (props.buttonStyle) {
      case 'danger':
        buttonClass += 'focus:ring-rose-700 text-white bg-rose-500/80 hover:bg-rose-500';
        break;
      case 'warning':
        buttonClass += 'focus:ring-yellow-600 text-white bg-yellow-500/80 hover:bg-yellow-500';
        break;
      case 'submit':
        buttonClass += 'focus:ring-green-700 text-white bg-green-600/80 hover:bg-green-600';
        break;
      default:
        buttonClass += 'focus:ring-blue-600 text-white bg-blue-500/75 hover:bg-blue-500';
        break;
    }

    return buttonClass;
  }

  return (
    <button
      onSubmit={props.handleSubmit ?? null}
      onClick={() => {
        if (props.function) {
          props.function(props.functionParams ?? null);
        }
      }}
      type={props.type ?? 'button'}
      className={getStyle()}
      hidden={props.hidden ?? false}
    >
      <div className="align-middle">
        {props.leftIcon && <FontAwesomeIcon className="ml-0 mr-3 h-4 w-4" aria-hidden="true" icon={props.leftIcon} />}
        {props.text}
        {props.rightIcon && <FontAwesomeIcon className="ml-3 mr-0 h-4 w-4" aria-hidden="true" icon={props.rightIcon} />}
      </div>
    </button>
  );
}
