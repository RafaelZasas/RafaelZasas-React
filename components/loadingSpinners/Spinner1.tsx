import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

export default function Spinner1() {
    return (
        <div className={'my-3 flex flex-col items-center'}>
            <FontAwesomeIcon icon={faSpinner}
                             pulse
                             fixedWidth
                             size='4x'/>
        </div>
    );
}

