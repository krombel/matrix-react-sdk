/*
Copyright 2015, 2016 OpenMarket Ltd

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

var Skinner = require('./Skinner');
import counterpart from 'counterpart';
var dis = require("./dispatcher");
import UserSettingsStore from './UserSettingsStore';

module.exports.loadSkin = function(skinObject) {
    Skinner.load(skinObject);
};

module.exports.resetSkin = function() {
    Skinner.reset();
};

module.exports.getComponent = function(componentName) {
    return Skinner.getComponent(componentName);
};

module.exports.setLanguage = function(language) {
    if (language) {
      dis.dispatch({
          action: 'set_language',
          value: language,
      });
    }else{
      var language = navigator.language || navigator.userLanguage;
      if (language.indexOf("-") > -1) {
        counterpart.setLocale(language.split('-')[0]);
        UserSettingsStore.setLocalSetting('language', language.split('-')[0]);
      } else if (language == 'pt-br') {
        counterpart.setLocale('pt-br');
        UserSettingsStore.setLocalSetting('language', 'pt_br');
      } else {
        counterpart.setLocale(language);
        UserSettingsStore.setLocalSetting('language', language);
      }
    }
};
