import React from 'react';
import Flowchart from 'react-simple-flowchart';

import './styles.css';
import { Flow } from './flow/Flow';

const fc = `
st=>start: Start
#aoskdpaognopa gpkapegoag
agonopgo 
okafoakg
dlaorlkvioavmov
agoknakgna a 
e akw
 oja 
 w j
 a gj opjgpogaj 
  gepa
  jgo
  j gaepgngpanpgniaeprg
  a
  gn
e=>end: End:>https://www.google.com[blank]

st(bottom)->e(left)
`;

const test = `
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
getInfo=>input: Input Info
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
printInfo=>output: Print info
para=>parallel: parallel tasks

st->getInfo->op1->cond
cond(yes)->io->printInfo->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
`;

const out = `
st=>start: Start
e=>end: end
getInfo=>input: Get some input
op1=>operation: Do something with it
cond=>condition: confirm?
sub1=>subroutine: Do some other process
io=>inputoutput: Process input and spit it out
print=>output: Print it
para=>parallel: Do something async

st->getInfo->op1->cond
cond([yes])->io->print->e
cond([no])->para
para(path1,bottom)->sub1(right)->op1
para(path2,top)->op1
`;

const flow = new Flow()
  .start('st', 'start')
  .end('e', 'end')
  .input('input', 'learn something')
  .op('op1', 'i made this')
  .op('retry', 'try again')
  .cond('cond', '...did it work?')
  .sub('sub1', 'ask for help')
  .end('yell', 'scream into the void')
  .end('fin', 'send an email about it')
  .parallel('para', 'evaluate');

flow
  .connect('st', 'input', 'op1', 'cond')
  .connect('cond[yes]', 'fin')
  .connect('cond[no]', 'para')
  .connect('para::top', 'sub1::bottom', 'retry::left')
  .connect('para::bottom', 'yell::left')
  .connect('para::right', 'retry::bottom')
  .connect('retry::right', 'op1::right')

const flowchart = flow.build();

const options = {
  'text-margin': 16,
  'symbols': {
    'start': {
      'text-margin': 32,
    }
  },
  'line-length': 70,
};

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Flowchart chartCode={flowchart} options={options} />
    </div>
  );
}

export default App;
