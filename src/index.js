import path from 'node:path';
import fs from 'node:fs/promises';

const message = 'Hello World!';
console.log(message);

const pathToWorkDir = path.join(process.cwd());
console.log(pathToWorkDir);
console.log(path.parse(pathToWorkDir));

const text = await fs.readFile(`${pathToWorkDir}/text.txt`, 'utf-8');
console.log(text);

fs.writeFile('text2.txt', 'test Write File');

fs.appendFile('text3.txt', '\ntest append');
