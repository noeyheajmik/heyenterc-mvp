import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

// Version the entry point, styles and module imports together so returning
// visitors cannot combine a fresh page with JavaScript from an older deploy.
const files = (await readdir('public')).filter(name => /\.(html|css|js)$/.test(name)).sort();
const sources = await Promise.all(files.map(name => readFile(`public/${name}`, 'utf8')));
const hash = createHash('sha256');
files.forEach((name, i) => hash.update(name).update('\0').update(sources[i]));
const version = hash.digest('hex').slice(0, 12);
for (let i = 0; i < files.length; i++) {
  const name = files[i];
  let content = sources[i];
  if (name.endsWith('.html')) content = content.replace(/((?:src|href)="\.\/[^"?]+\.(?:css|js))"/g, `$1?v=${version}"`);
  if (name.endsWith('.js')) content = content.replace(/(from\s+['"]\.\/[^'"?]+\.js)(['"])/g, `$1?v=${version}$2`);
  await writeFile(`dist/${name}`, content);
}
console.log(`Built static site in dist/ (assets ${version})`);
