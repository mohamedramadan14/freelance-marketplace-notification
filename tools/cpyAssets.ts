import * as shell from 'shelljs';

shell.cp('-R', 'src/emails', 'build/src/');
shell.cp('-R', 'src/dist', 'build/src/');
