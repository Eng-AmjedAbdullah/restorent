/** Dependency-free runtime smoke checks when Bun/npm packages cannot be installed.
 * Uses the globally installed TypeScript compiler ONLY to transpile TS modules for Node.
 * This is NOT a substitute for the Vue SFC typecheck or full Bun suite.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
let ts;
try { ts = require('typescript'); } catch {
  const { execFileSync } = require('child_process');
  const npmRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  ts = require(path.join(npmRoot, 'typescript'));
}
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2));
  if (request.startsWith(root) && !path.extname(request)) {
    if (fs.existsSync(request + '.ts')) request += '.ts';
    else if (fs.existsSync(path.join(request, 'index.ts'))) request = path.join(request, 'index.ts');
  }
  return originalResolve.call(this, request, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(source, {fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},reportDiagnostics:true});
  const errors=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
  if(errors.length) throw new Error(`${filename}: ${errors.map(e=>ts.flattenDiagnosticMessageText(e.messageText,' ')).join('; ')}`);
  module._compile(out.outputText, filename);
};
const { MockDataProvider, DEMO_PASSWORD } = require('../src/data/providers/mock.provider.ts');
const { setDataProvider } = require('../src/data/providers/index.ts');
const { employeeService } = require('../src/services/employeeService.ts');
const { restaurantService } = require('../src/services/restaurantService.ts');
const { authService } = require('../src/services/authService.ts');
const { attendanceService } = require('../src/services/attendanceService.ts');
const { orderService } = require('../src/services/orderService.ts');
const { inventoryService } = require('../src/services/inventoryService.ts');
const { aiInsightService } = require('../src/services/aiInsightService.ts');
let count=0;
async function pass(label, work){await work(); count++; console.log('PASS', label);}
async function failType(work, type){let failed=false;try{await work();}catch(e){failed = e.name===type; if(!failed) throw e;}assert(failed, `Expected ${type}`);}
(async()=>{
 const p = new MockDataProvider({latencyMs:0,restoreSession:false}); setDataProvider(p);
 await pass('protected reads fail without a session',async()=>{await failType(()=>p.listRestaurants(),'AuthenticationError'); await failType(()=>p.listEmployees(1),'AuthenticationError');});
 await pass('unknown email never gets a privileged session',async()=>{await failType(()=>p.login({email:'x@example.com',password:DEMO_PASSWORD}),'AuthenticationError');await failType(()=>p.checkAuthMe(),'AuthenticationError');});
 await pass('suspended account cannot log in',async()=>{await failType(()=>p.login({email:'faisal@example.com',password:DEMO_PASSWORD}),'AuthenticationError');});
 await p.login({email:'khalid.ghamdi@restoraintel.com',password:DEMO_PASSWORD});
 await pass('staff cannot read another restaurant',async()=>{assert.deepEqual((await p.listRestaurants()).data.map(x=>x.id),[1]);await failType(()=>p.listEmployees(2),'AuthorizationError');});
 await pass('membership alone never grants employee management',async()=>{await failType(()=>p.createEmployee(1,{first_name:'Test',last_name:'Worker',status:'active'}),'AuthorizationError');});
 await pass('membership alone never grants restaurant profile management',async()=>{await failType(()=>p.updateRestaurant(1,{name:'Unauthorized'}),'AuthorizationError');});
 await p.logout();
 await pass('logout invalidates protected operations',async()=>{await failType(()=>p.checkAuthMe(),'AuthenticationError');await failType(()=>p.listRestaurants(),'AuthenticationError');});
 await p.login({email:'ahmed.mansoor@restoraintel.com',password:DEMO_PASSWORD});
 await pass('manager can create employee via application service',async()=>{const before=await employeeService.getEmployees('rest-1');let data=before[0];const added=await employeeService.createEmployee({...data,restaurant_id:'rest-1',employee_code:'TEST-9000',first_name:{ar:'Test',en:'Test'},last_name:{ar:'Worker',en:'Worker'},position_id:'pos-1',email:'new@example.com'});assert.equal(added.restaurant_id,'rest-1');assert.equal((await employeeService.getEmployees('rest-1')).length,before.length+1);});
 await pass('invalid position and duplicate slug rejected atomically',async()=>{const n=(await p.listEmployees(1)).data.length;await failType(()=>p.createEmployee(1,{first_name:'A',last_name:'B',status:'active',position_id:4}),'ValidationError');assert.equal((await p.listEmployees(1)).data.length,n);await failType(()=>p.updateRestaurant(1,{slug:'jed-01'}),'ValidationError');});
 await pass('operational leave decisions update shared state',async()=>{const pending=(await attendanceService.getLeaveRequests('rest-1')).find(r=>r.status==='pending');if(!pending)throw new Error('Missing pending mock fixture');await attendanceService.approveLeaveRequest('rest-1',pending.id);assert.equal((await attendanceService.getLeaveRequests('rest-1')).find(r=>r.id===pending.id).status,'approved');});
 await pass('inventory reads and updates share one state',async()=>{const items=await inventoryService.getInventoryItems('rest-1');if(!items.length)throw new Error('No mock inventory');const x=items[0];await inventoryService.updateStock('rest-1',x.id,33);assert.equal((await inventoryService.getInventoryItems('rest-1')).find(i=>i.id===x.id).current_stock,33);});
 await pass('orders reject invalid transitions',async()=>{const orders=await orderService.getOrders('rest-1');const o=orders.find(o=>o.status==='new');if(o){await failType(()=>orderService.updateOrderStatus('rest-1',o.id,'delivered'),'ValidationError');await orderService.updateOrderStatus('rest-1',o.id,'preparing');assert.equal((await orderService.getOrders('rest-1')).find(x=>x.id===o.id).status,'preparing');}});
 await pass('restaurant service reads provider-owned mutations',async()=>{const updated=await restaurantService.updateRestaurant('rest-1',{name:{ar:'New Verified Name',en:'New Verified Name'}});assert.equal(updated.name.en,'New Verified Name');assert.equal((await restaurantService.getRestaurantById('rest-1')).name.en,'New Verified Name');});
 await pass('mock alert reads synchronize through shared provider',async()=>{let alerts=await aiInsightService.getAlerts('rest-1');if(alerts.length){await aiInsightService.markAlertRead('rest-1',alerts[0].id);assert((await aiInsightService.getAlerts('rest-1')).find(a=>a.id===alerts[0].id).read)}});
 await pass('role is not elevated on unknown login',async()=>{await failType(()=>authService.login('x@y.z',DEMO_PASSWORD),'AuthenticationError');});
 console.log(`SMOKE CHECKS: ${count}/${count} passed`);
})().catch(e=>{console.error('FAILED',e);process.exitCode=1;});
