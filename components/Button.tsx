import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ButtonProps} from '../lib/types';

/**
 * Reusable button component with optional icon(s) to the left or right of button text
 * Button will fill container space on small devices and decide
 */
export default function Button(props: ButtonProps) {
  function getStyle() {
    let buttonClass = `
            w-full md:w-auto items-center px-4 py-2 text-white
            border drop-shadow-xl text-base font-medium rounded-md 
            focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent disabled:opacity-50 disabled:tetx-slate-600`;
    switch (props.buttonStyle) {
      case 'danger':
        buttonClass += 'focus:ring-rose-700 bg-rose-500/80 hover:bg-rose-500';
        break;
      case 'warning':
        buttonClass += 'focus:ring-yellow-600 bg-yellow-500/80 hover:bg-yellow-500';
        break;
      case 'submit':
        buttonClass += 'focus:ring-green-700 bg-green-600/80 hover:bg-green-600';
        break;
      case 'basic':
        buttonClass +=
          '!leading-4 !rounded-md border !border-gray-300 bg-white !text-sm !drop-shadow-sm !text-gray-700 hover:bg-gray-50 !showow-sm focus:ring-blue-500';
        break;
      default:
        buttonClass += 'focus:ring-blue-600 bg-blue-500/75 hover:bg-blue-500 dark:bg-blue-900 dark:hover:bg-blue-700';
        break;
    }

    return buttonClass;
  }

  return (
    <button
      onSubmit={props.handleSubmit ?? null}
      onClick={(e) => props.function && props.function(e)}
      type={props.type ?? 'button'}
      className={getStyle()}
      hidden={props.hidden ?? false}
      disabled={props.disabled || false}
    >
      <div className="align-middle">
        {props.leftIcon && <FontAwesomeIcon className="ml-0 mr-3 h-4 w-4" aria-hidden="true" icon={props.leftIcon} />}
        {props.text}
        {props.rightIcon && <FontAwesomeIcon className="ml-3 mr-0 h-4 w-4" aria-hidden="true" icon={props.rightIcon} />}
      </div>
    </button>
  );
}
