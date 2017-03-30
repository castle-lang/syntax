#lang "sweet.js"
export syntax mod = function(ctx) {
    const delim = ctx.next().value;
    const body = [];
    
    for (let item of delim.inner()) {
        if (item.val() === ';') {
            body.push(delim.fromPunctuator(','))
        } else {
            body.push(item);
        }
    }

    return #`new castle.Module([${body}])`;
}

// TODO: make it work for implicit void return value
export syntax extern = function(ctx) {
    const name_ = ctx.next().value;
    const name = name_.fromString(name_.val());
    
    const args_ = ctx.next().value;
    const args = [];
    
    const argsInner = args_.inner();

    while (1) {
        const next = argsInner.next();
        const argName_ = next.value;

        if (next.done) break;

        const argName = argName_.fromString(argName_.val());
        if (argsInner.next().value.val() !== ':') throw new Error();
        const argType_ = argsInner.next().value;
        const argType = argType_.fromString(argType_.val());
        const { done, value } = argsInner.next();

        const argRet = #`new castle.Arg(${argName}, ${argType})`;

        for (let item of argRet) {
            args.push(item);
        }

        if (!done && value.val() !== ',') throw value.val();
        if (done) break;

        args.push(value);
    }

    const { done, value } = ctx.next();
    if (!done && value.val() !== ':' && value.val() !== ';' && value.val() !== ',') throw value.val();
    
    let retType_;
    if (done || value.val() === ';' || value.val() === ',') {
        retType_ = 'void';
    } else {
        retType_ = ctx.next().value.val();
    }

    const retType = name_.fromString(retType_);
    
    return #`new castle.Extern(${name}, [${args}], ${retType})`;
}
