
// Copyright (C) 2019 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import m from 'mithril';

import {globals} from './globals';
import {showModal} from './modal';
import {Actions} from '../common/actions';

export function toggleMoreh() {
  globals.logging.logEvent('User Actions', 'Show help');
  showMoreh();
}

type DumpfilesApi = {
  filepath: string
  files: string[]
  foldername: string
}
const getAPI = async (path: string) => {
	return new Promise((resolve, reject) => {
    m.request(path, { method: 'GET' })
      .then((res: any) => resolve(res.results))
      .catch(err => reject(err));
  })
}
const apiPath = 'https://sysm2.moreh.dev/api/v2/dumpfiles'
const getFiles = async () => {
  const files: any = await getAPI(apiPath)
  console.log('getFiles end')
  return files as DumpfilesApi[]
}
function openTraceUrl(url: string): (e: Event) => void {
  return (e) => {
    globals.logging.logEvent('Trace Actions', 'Open example trace');
    e.preventDefault();
    globals.dispatch(Actions.openTraceFromUrl({url}));
  };
}
async function showMoreh() {
  const files = await getFiles()
  console.log('showMoreh end')
  showModal({
    title: 'Moreh',
    content: m(
        '.moreh',
          files.map((el: DumpfilesApi) => m('ul', m('li.path', el.filepath), el.files.map((fileName: string) => m('li.file', {
            onclick: openTraceUrl(el.filepath + el.foldername + fileName)
          }, fileName)))
        ),
      ),
    buttons: []
  });
}
