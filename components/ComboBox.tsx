import {Fragment, useState} from 'react';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';

interface Item {
  ['string']?: string;
  name: string;
}

interface ComboBoxProps {
  items: any[] | Item[];
  label?: string;
}

export default function ComboBox(props: ComboBoxProps) {
  const items = props.items;
  const [selected, setSelected] = useState(items[0]);
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="z-20 w-full">
      <Combobox value={selected} onChange={setSelected}>
        {props.label && (
          <Combobox.Label className={'block text-sm font-medium text-gray-700'}>{props.label}</Combobox.Label>
        )}
        <div className="relative mt-1">
          <div
            className="relative z-30 w-full cursor-default overflow-hidden rounded-lg border-2 border-gray-300
             bg-gray-100/30 bg-white text-left shadow-md hover:border-blue-400/70 focus:border-blue-500 sm:text-sm"
          >
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900"
              displayValue={(item: Item) => item.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg
             ring-1 ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {filteredItems.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
              ) : (
                filteredItems.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({active}) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-sky-500 text-white' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({selected, active}) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {item.name ?? item}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-sky-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
