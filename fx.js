const log = console.log;
const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

function *infinity(i=0){while(true) yield i++;}


const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
}

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a); //then하는 순간 resolve된 값이 들어간다.


const reduce = curry((f, acc, iter) => {
    if(!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }else {
        iter = iter[Symbol.iterator]();
    }
    let cur;
    /* while (!(cur = iter.next()).done){
        const a = cur.value;
        acc = acc instanceof Promise ? acc.then(acc => f(acc,a)) : f(acc,a); // 이 방법은 연속적으로 프로미스 체인이됨.
    }
    return acc;
    */
    //유명함수 재귀로 처리함으로써 비동기가 필요할때만 Promise처리가 되고, 아닐때는 그냥 동기화로 while문에 들어가서 돈다.
    //재귀함수로 리턴하기 때문에 프로미스 체인이 일어나지않는다. 개인적으로 이부분이 이해가 힘들었다.
    return go1(acc, function recur(acc) {
        while (!(cur = iter.next()).done){
            const a = cur.value;
            acc = f(acc,a);
            if (acc instanceof Promise) return acc.then(recur);
        }
    }); // (acc)가 뒤에 또 붙은 이유는 유명함수라서 바로 호출까지 해주는 부분이 필요함.
    
});


const go = (...args) => reduce((a,f)=>f(a) ,args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);


const take = curry((l ,iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    return function recur() {
        let cur;
        while (!(cur = iter.next()).done) {
            const a = cur.value;
            if(a instanceof Promise) return a.then(a=> { //promise 부분
                res.push(a);
                return res.length == l ? res : recur();
            }); 
            res.push(a); //not promise 부분.
            if(res.length == l) return res;
        }
    }();
});  

const isIterable = (iter) => iter && iter[Symbol.iterator];



Lflatten = function *(iter) {
    for(const a of iter) 
        if(isIterable(a)) for(const b of a) yield b;
        else yield a;
};

const flatten = pipe(Lflatten, take(Infinity)); 


// 느긋한 L. L함수들은 세로로 진행된다고 보면됨. 
// breakpoint를 찍어보면 take먼저 실행되고 위로 올라가는 것을 볼 수 있음.


Lmap = curry(function *(f,iter) {
    for(const a of iter) yield go1(a,f);
  });

//Lmap + flatten
const flatMap = curry(pipe(Lmap, flatten));

Lfilter = curry(function *(f,iter) {
    for(const a of iter) if(f(a)) {
        yield a;}
         //true일때까지 for문 작동. true일때 yield.
  });


  const map = curry(pipe(Lmap,take(Infinity)));

  const filter = curry(pipe(Lfilter), take(Infinity));

  const find = curry((f, iter) => go(
    iter,
    Lfilter(f), 
    take(1),
    ([a]) => a, //array to string.
));