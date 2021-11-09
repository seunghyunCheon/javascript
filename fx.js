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

const map = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]()
    let cur;
    while(!(cur = iter.next()).done){
        const a = cur.value;
        res.push
    }

    return res;
});

const filter = curry((f, iter) => {
    let res = []
    for(const a of iter){
        if(f(a)) res.push(a) //filter의 핵심.
    }
    return res;
});

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

const take = curry((l ,iter) => {
    let res = [];
    for(const a of iter){
        res.push(a);
        if(res.length == l) return res;
    }
    return res;
});

// 느긋한 L.

Lrange = function *(l) {
    let i = -1;
    while(++i < l) yield i;
}

Lmap = curry(function *(f,iter) {
    for(const a of iter) yield f(a);
  });

Lfilter = curry(function *(f,iter) {
    for(const a of iter) if(f(a)) yield a; //true일때까지 for문 작동. true일때 yield.
  });
