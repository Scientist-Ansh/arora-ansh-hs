function tree(obj) {
  let { name, items } = obj;

  if (items?.length) {
    name += '\n';
    name += items
      .map(tree)
      .map((text, i, { length }) => {
        return i < length - 1
          ? '├──' + text.toString().replace(/\n/g, '\n│  ')
          : '└──' + text.toString().replace(/\n/g, '\n   ');
      })
      .join('\n');
  }
  return name;
}

let obj = {
  name: 1,
  items: [
    {
      name: 2,
      items: [{ name: 3 }, { name: 4 }],
    },
    {
      name: 5,
      items: [{ name: 6 }],
    },
  ],
};

console.log(tree(obj));
