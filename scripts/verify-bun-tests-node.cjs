/** Offline fallback runner for existing bun:test unit suites using node:test.
 * This is a compatibility runner, NOT an assertion that Bun itself executed.
 * Install dependencies and use `bun test` for authoritative Bun results.
 */
const Module=require('node:module');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const nodeTest=require('node:test');
let ts;
try{ts=require('typescript');}catch{ts=require(path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'));}
const root=path.resolve(__dirname,'..');
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(request,parent,...args){
  if(request.startsWith('@/'))request=path.join(root,'src',request.slice(2));
  if(request.startsWith(root)&&!path.extname(request)){
    if(fs.existsSync(request+'.ts'))request+='.ts';
    else if(fs.existsSync(path.join(request,'index.ts')))request=path.join(request,'index.ts');
  }
  return originalResolve.call(this,request,parent,...args);
};
require.extensions['.ts']=(module,filename)=>{
  const source=fs.readFileSync(filename,'utf8');
  const out=ts.transpileModule(source,{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},reportDiagnostics:true});
  const errors=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
  if(errors.length)throw new Error(filename+': '+errors.map(e=>ts.flattenDiagnosticMessageText(e.messageText,' ')).join('; '));
  module._compile(out.outputText,filename);
};
function expect(value){
  const match=(neg=false)=>{
    const verify=(condition,description)=>assert(neg?!condition:condition,`Expectation failed (${neg?'not ':''}${description}); actual: ${String(value)}`);
    return{
      toBe:(expected)=>verify(Object.is(value,expected),`toBe ${String(expected)}`),
      toEqual:(expected)=>verify(require('node:util').isDeepStrictEqual(value,expected),'toEqual'),
      toBeDefined:()=>verify(value!==undefined,'toBeDefined'),
      toBeUndefined:()=>verify(value===undefined,'toBeUndefined'),
      toBeNull:()=>verify(value===null,'toBeNull'),
      toContain:(item)=>verify(value!=null&&typeof value.includes==='function'&&value.includes(item),'toContain'),
      toHaveLength:(length)=>verify(value!=null&&value.length===length,`toHaveLength ${length}`),
      toHaveProperty:(key)=>verify(value!=null&&key.split('.').reduce((o,k)=>o?.[k],value)!==undefined,'toHaveProperty '+key),
      toMatch:(pattern)=>verify(typeof value==='string'&&new RegExp(pattern).test(value),'toMatch '+pattern),
      toBeGreaterThan:(n)=>verify(value>n,'toBeGreaterThan '+n),
      toBeGreaterThanOrEqual:(n)=>verify(value>=n,'toBeGreaterThanOrEqual '+n),
      toBeLessThan:(n)=>verify(value<n,'toBeLessThan '+n),
      toBeInstanceOf:(ctor)=>verify(value instanceof ctor,'toBeInstanceOf '+ctor.name),
      toThrow:(ctor)=>{
        let error;
        try{value();}catch(e){error=e;}
        verify(Boolean(error&&(!ctor||error instanceof ctor)),'toThrow '+ctor?.name);
      },
      get not(){return match(!neg)},
      get rejects(){
        return {toBeInstanceOf:async ctor=>{
          let thrown;try{await value;}catch(e){thrown=e;}
          verify(Boolean(thrown instanceof ctor),'rejects.toBeInstanceOf '+ctor.name);
        }};
      }
    };
  };
  return match();
}
const originalLoad=Module._load;
Module._load=function(request,parent,...rest){
  if(request==='bun:test')return {...nodeTest,expect};
  return originalLoad.call(this,request,parent,...rest);
};
for(const file of ['src/contracts/__tests__/api-envelope.test.ts','src/contracts/__tests__/canonical-dto.test.ts',
 'src/contracts/__tests__/mappers.test.ts','src/contracts/__tests__/referential-integrity.test.ts',
 'src/data/providers/__tests__/mock.provider.test.ts',
 'src/data/providers/__tests__/scheduling.rules.test.ts'])require(path.join(root,file));
