import CodeMirror from 'codemirror';
import { defaultConfig, EmmetConfig } from './lib/config';
import abbreviationTracker from './abbreviation';
import expandAbbreviation from './commands/expand-abbreviation';
import emmetResetAbbreviation from './commands/reset-abbreviation'
import emmetEnterAbbreviationMode from './commands/enter-abbreviation';

type DisposeFn = () => void;

/**
 * Registers Emmet extension on given CodeMirror constructor.
 * This file is designed to be imported somehow into the app (CommonJS, ES6,
 * Rollup/Webpack/whatever). If you simply want to add a <script> into your page
 * that registers Emmet extension on global CodeMirror constructor, use
 * `browser.js` instead
 */
export default function registerEmmetExtension(CM: typeof CodeMirror) {
    let trackerDispose: DisposeFn | null = null;

    // Register Emmet commands
    Object.assign(CM.commands, {
        emmetExpandAbbreviation: (editor: CodeMirror.Editor) => expandAbbreviation(editor, true),
        emmetExpandAbbreviationAll: (editor: CodeMirror.Editor) => expandAbbreviation(editor, false),
        emmetResetAbbreviation,
        emmetEnterAbbreviationMode
    });

    // Track options change
    CM.defineOption('emmet', defaultConfig, (editor: CodeMirror.Editor, value: EmmetConfig) => {
        if (value.mark && !trackerDispose) {
            console.log('Will track abbreviation');
            trackerDispose = abbreviationTracker(editor);
        } else if (!value.mark && trackerDispose) {
            console.log('Will dispose abbreviation tracker');
            trackerDispose();
            trackerDispose = null;
        }
    });
}
