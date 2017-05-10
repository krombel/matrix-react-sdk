/*
Copyright 2017 Marcel Radzio (MTRNord)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';

import sdk from '../../../index';
import UserSettingsStore from '../../../UserSettingsStore';
const _localSettings = UserSettingsStore.getLocalSettings();
import counterpart from 'counterpart';
const languageHandler = require('../../../languageHandler');
var SdkConfig = require("../../../SdkConfig");

const LANGUAGES = [];
/*    {
        id: 'language',
        label: 'German',
        value: 'de-de',
    },
    {
        id: 'language',
        label: 'English',
        value: 'en-en',
    },
    {
      id: 'language',
      label: 'Brazilian Portuguese',
      value: 'pt-br',
    },
    {
      id: 'language',
      label: 'Dansk',
      value: 'da',
    },
    {
      id: 'language',
      label: 'Russian',
      value: 'ru',
    },
];
*/

const LANGUAGES_BY_VALUE = new Object(null);

function languageMatchesSearchQuery(query, language) {
    if (language.label.toUpperCase().indexOf(query.toUpperCase()) == 0) return true;
    if (language.value.toUpperCase() == query.toUpperCase()) return true;
    return false;
}

export default class LanguageDropdown extends React.Component {
    constructor(props) {
        super(props);
        this._onSearchChange = this._onSearchChange.bind(this);

        this.state = {
            searchQuery: '',
        }
    }

    componentWillMount() {
    	console.log("SdkConfig");
    	var languageKeys = SdkConfig.get().languages;
    	languageKeys.forEach(function(languageKey) {
    		var l = {};
    		l.id = "language";
    		l.label = counterpart.translate(languageKey);
    		l.value = languageKey;
    		LANGUAGES.push(l);
    	});
    	console.log("languages LANGUAGES = "+JSON.stringify(LANGUAGES));
    	
    	for (const l of LANGUAGES) {
    		LANGUAGES_BY_VALUE[l.value] = l;
		}
    	
    	
        if (!this.props.value) {
            // If no value is given, we start with the first
            // country selected, but our parent component
            // doesn't know this, therefore we do this.
            if (_localSettings.hasOwnProperty('language')) {
              this.props.onOptionChange(_localSettings.language);
            }else {
              const language = languageHandler.normalizeLanguageKey(languageHandler.getLanguageFromBrowser());
              this.props.onOptionChange(language);
            }
        }
    }

    _onSearchChange(search) {
        this.setState({
            searchQuery: search,
        });
    }

    render() {
        const Dropdown = sdk.getComponent('elements.Dropdown');

        let displayedLanguages;
        if (this.state.searchQuery) {
            displayedLanguages = LANGUAGES.filter(
                languageMatchesSearchQuery.bind(this, this.state.searchQuery),
            );
            if (
                this.state.searchQuery.length == 2 &&
                LANGUAGES_BY_VALUE[this.state.searchQuery.toUpperCase()]
            ) {
                const matched = LANGUAGES_BY_VALUE[this.state.searchQuery.toUpperCase()];
                displayedLanguages = displayedLanguages.filter((l) => {
                    return l.id != matched.id;
                });
                displayedLanguages.unshift(matched);
            }
        } else {
            displayedLanguages = LANGUAGES;
        }

        const options = displayedLanguages.map((language) => {
            return <div key={language.value}>
                {language.label}
            </div>;
        });

        // default value here too, otherwise we need to handle null / undefined
        // values between mounting and the initial value propgating
        let value = null;
        if (_localSettings.hasOwnProperty('language')) {
          value = this.props.value || _localSettings.language;
        } else {
          const language = navigator.language || navigator.userLanguage;
          value = this.props.value || language;
        }

        return <Dropdown className={this.props.className}
            onOptionChange={this.props.onOptionChange} onSearchChange={this._onSearchChange}
            value={value}
        >
            {options}
        </Dropdown>
    }
}

LanguageDropdown.propTypes = {
    className: React.PropTypes.string,
    onOptionChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
};
