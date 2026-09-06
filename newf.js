const greet = (name) => {
    return `Hello, ${name}!`;
};

const add = (x, y) => {
    return x + y;
};
const square = (num) => {
    return num * num;
};
console.log(greet("Alice")); 
console.log(add(5, 3)); 
console.log(square(4)); 

const even = (num) => {
    return num % 2 === 0;
};
console.log(even(10)); 
console.log(even(7)); 



const marks = [85, 92, 78, 90, 88];
const greaterThan = (threshold) => {
    return marks.filter(mark => mark > threshold);
};
console.log(greaterThan(85)); // Output: [92, 90, 88]

const student = {
    name: "Arav",
    age: 20,
    courses: ["Math", "Science", "History"]
};
const { name, age, courses } = student;
console.log(name); 
console.log(age); 
console.log(courses);

function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, 3000);
    });
}
async function run() {
    console.log("Waiting for 3 seconds...");
    await delay();
    console.log("Done waiting!");
}

run();

let obj1 = {name: 'Alice', age: 25};
let obj2 = {age: 30, city: 'New York'};
obj2.name = obj1.name;
console.log(obj2); 
