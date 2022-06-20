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

function tree(obj) {
  let result = '';
  let { name, items } = obj;
  if (items) {
    result += name + '\n' + '├──';
    items.forEach((item, i) => {
      result += tree(item);
      if (i < items.length - 1) {
        result += '\n├──';
      }
    });
  } else {
    result += '└── ' + name;
  }
  return result;
}

console.log(tree(obj));
