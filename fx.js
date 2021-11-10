const log = console.log;
const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
  

const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
}

const map = curry(pipe(Lmap,take(4)));

log(map(a=>a+10, Lrange(4)));
const filter = curry(pipe(Lfilter), take(4));

const reduce = curry((f, acc, iter) => {
    if(!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for( const a of iter){
        acc = f(acc, a);
    }
    return acc;
});

const go = (...args) => reduce((a,f)=>f(a) ,args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const take = curry((l ,iter) => {
    let res = [];
    for(const a of iter){
        res.push(a);
        if(res.length == l) return res;
    }
    return res;
});

// 느긋한 L. L함수들은 세로로 진행된다고 보면됨. 
// breakpoint를 찍어보면 take먼저 실행되고 위로 올라가는 것을 볼 수 있음.


Lmap = curry(function *(f,iter) {
    for(const a of iter) yield f(a);
  });

Lfilter = curry(function *(f,iter) {
    for(const a of iter) if(f(a)) yield a; //true일때까지 for문 작동. true일때 yield.
  });
