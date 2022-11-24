// how to create a promise function in javascript?

function promiseFunction() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve("Hello World");
        }, 2000);
    });
}


async function func() {
    console.log("one")
    const result = await promiseFunction();
    console.log(result);
    console.log("two")
}

func()
