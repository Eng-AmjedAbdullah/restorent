/** Fast syntax validation when package installation is not available.
 * Checks TypeScript and the script blocks of Vue SFCs. Does NOT validate
 * Vue templates, dependency types, runtime rendering, or Vite bundling.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
let ts;
try { ts = require('typescript'); } catch { ts = require(path.join(execFileSync('npm', ['root','-g'], {encoding:'utf8'}).trim(),'typescript')); }
const root = path.resolve(__dirname, '..');
let files = 0, failed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (['node_modules','dist','.git'].includes(entry.name)) continue;
    const filename = path.join(dir,entry.name);
    if (entry.isDirectory()) { walk(filename); continue; }
    if (!/\.(ts|vue)$/.test(entry.name) || entry.name.endsWith('.d.ts')) continue;
    const text = fs.readFileSync(filename,'utf8');
    let code = text;
    if (entry.name.endsWith('.vue')) {
      const first = text.indexOf('<script');
      if (first === -1) { files++; continue; }
      const start = text.indexOf('\n',first);
      const end = text.indexOf('</script>',start);
      if (start===-1 || end===-1) { console.error(`FAIL ${filename}: invalid script block`);failed++;continue; }
      code = text.slice(start+1,end);
    }
    const parsed=ts.createSourceFile(filename,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
    files++;
    if(parsed.parseDiagnostics.length) {
      failed++;
      for(const diag of parsed.parseDiagnostics) {
        const pos=parsed.getLineAndCharacterOfPosition(diag.start??0);
        console.error(`FAIL ${path.relative(root,filename)}:${pos.line+1}:${pos.character+1} ${ts.flattenDiagnosticMessageText(diag.messageText,' ')}`);
      }
    }
  }
}
walk(path.join(root,'src'));
console.log(`SOURCE SYNTAX: ${files-failed}/${files} TS and Vue script blocks parsed`);
process.exitCode=failed?1:0;
