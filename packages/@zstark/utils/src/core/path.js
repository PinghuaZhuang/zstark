function xxx(...rest){
  const parths = rest.join('/')
	return parths
    .replace(/\/+/g, '/')
    .replace(/\/\.\//g, '/')
    .replace(/\/[^\/]*?\/\.\.\//, '/')
};

function join(src, dest){
  console.log('src', src, dest)
	src = src.split(/\/+/).slice(0, -1);
	dest = dest.split(/\/+/);

	dest.filter(function(term){
		return term !== '.';
	}).forEach(function(term){
		return term === '..' ? src.pop() : src.push(term);
	});

	return src.join('/').replace(':/', '://');
}

const ret = xxx('http://www.baidu.com', '/public', './asss', '../css/style.css')
console.log('retxxxx12', ret)
